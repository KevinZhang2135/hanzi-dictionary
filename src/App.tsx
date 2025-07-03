// React and component
import { ReactNode, useState } from 'react';
import {
  MagnifyingGlassIcon,
  ClipboardIcon,
} from '@heroicons/react/24/outline';

import DefinitionDeck, { TermDefinition } from './components/DefinitionDeck';
import SegmentSuggestions from './components/SegmentSuggestions';

// Chinese phrase segmenter
import init, { cut } from 'jieba-wasm';
await init();

// Tesseract OCR
import { createWorker } from 'tesseract.js';
const worker = await createWorker(['chi_sim', 'chi_tra']
  , 1, {
  workerPath: 'node_modules/tesseract.js/dist/worker.min.js',
  langPath: 'trained-data',
  corePath: 'node_modules/tesseract.js-core',
  workerBlobURL: false
});

// Imports dictionary entries for Chinese characters and phrases and mappings
// for traditional and simplified characters
const dictEntries = await (
  await fetch('cedict-ts.json', {
    headers: {
      'Content-Type': 'application/json',
      Accept: 'application/json',
    },
  })
).json();

const charMappings = await (
  await fetch('char-mappings.json', {
    headers: {
      'Content-Type': 'application/json',
      Accept: 'application/json',
    },
  })
).json();

/**
 * Retrieves the dictionary entry for a specified term.
 * @param {string} term The specified character or phrase to retrieve the
 *   dictionary entry for
 * @returns The dictionary entry object for the specified term, or null if the
 *   term does not exist
 */
const getDictEntry = (term: string): TermDefinition[] | null => {
  // Check if the term exists in the dictionary entries
  if (term in charMappings) {
    return charMappings[term].map((index: number) => dictEntries[index]);
  }

  return null;
};

const App = (): ReactNode => {
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [segments, setSegments] = useState<string[]>([]);

  const [definitions, setDefinitions] = useState<TermDefinition[]>([]);

  /**
   * Looks up the term in the dictionary and clears the {@code searchTerm}. If
   * the term exists, all definitions are outputted to {@code definitions}.
   * Otherwise, if the term is not immediately in the dictionary, the phrase
   * is segmented into smaller segments in {@code segments}
   * @param {string} term The phrase to look up
   */
  const enterSearchTerm = (term: string) => {
    term = term.replaceAll(/\s/g, ''); // Remove all whitespace
    if (!term) return;

    const entry = getDictEntry(term);
    setSearchTerm('');

    if (entry) {
      setDefinitions([...entry]);
    }

    // Attempts to segment the term into smaller sub-terms. If none found,
    // each character is treated as a segment
    else {
      let segments = cut(term);

      // Handles segments where the dictionary does not have an entry
      // by splitting them into their constituent characters
      for (let i = 0; i < segments.length; i++) {
        const segment = segments[i];

        if (!(segment in charMappings)) {
          segments.splice(i, 1, ...segment.split(''));
          i += segment.length - 1; // Skip over added segments
        }
      }

      // Final check to remove unsanitary segments
      segments = segments.filter((segment) => segment in charMappings);
      segments.length > 0 && setSegments(segments);
    }
  };

  /**
   * Searches the input as if the search button was pressed upon pressing the
   * enter key
   * @param {React.KeyboardEvent<HTMLInputElement>} e Browser event
   */
  const handleEnterKey = (e: React.KeyboardEvent<HTMLInputElement>) => {
    e.key === 'Enter' && enterSearchTerm(searchTerm);
  };

  /**
   * Retrieves the base 64 encoding of an image blob
   * @param blob Image blob
   * @returns A promise resolving to the image's base 64 encoding
   */
  const blobToBase64 = async (blob: Blob) => {
    const fileReader = new FileReader();
    fileReader.readAsDataURL(blob);

    return new Promise((resolve) => {
      fileReader.onloadend = () => {
        resolve(fileReader.result);
      };
    });
  };

  /**
   * Handles pasting from the clipboard. If text is found, it is used as the
   * search term. If an image is found, it is processed using Tesseract OCR to
   * extract text before being used as the search term.
   */
  const handleClipboardPaste = async () => {
    const clipboard = (await navigator.clipboard.read())[0];

    // Retrieve image from clipboard
    if (clipboard.types.includes('image/png')) {
      const image64 = await clipboard
        .getType('image/png')
        .then((imageBlob) => blobToBase64(imageBlob));

      // Recognize text from image using Tesseract OCR and search for it
      const {
        data: { text },
      } = await worker.recognize(image64);
      text && setSearchTerm(text.replaceAll(/\s/g, ''));
    }

    // Retrieve text from clipboard
    else if (clipboard.types.includes('text/plain')) {
      clipboard
        .getType('text/plain')
        .then((textBlob) => textBlob.text())
        .then((text) => {
          text && setSearchTerm(searchTerm + text);
        });
    }
  };

  return (
    <div className="flex flex-col gap-4">
      <h1 className="text-2xl text-zinc-100 font-medium">
        Chinese English Dictionary
      </h1>
      {definitions.length === 0 && (
        <div className="flex flex-col gap-2 text-zinc-200">
          <p>
            Input any Chinese character or phrase in the search bar to look up
            its Pinyin and English definition. Text as well as images on the
            clipboard can be searched via the clipboard icon.
          </p>
          <p>
            If the phrase is not found, it will be spliced into its constituent
            segments as suggestions.
          </p>
        </div>
      )}

      {/* Search History and Definitions */}
      <DefinitionDeck
        isDisplayed={definitions.length > 0}
        definitions={definitions}
      />

      <div className="flex flex-col sticky bottom-8 gap-2">
        {/* Segment Suggestions */}
        <SegmentSuggestions
          isDisplayed={segments.length > 0}
          segments={segments}
          enterSearchTerm={enterSearchTerm}
        />

        {/* Search Input */}
        <form
          id="search-input"
          className="animate-appear flex flex-col sm:flex-row gap-2"
          onSubmit={(e) => e.preventDefault()}
        >
          <div className="rounded-lg bg-zinc-950 flex flex-1">
            <input
              autoFocus
              id="character-input"
              className="px-4 py-3 flex-1 text-zinc-100
                placeholder:text-zinc-300 placeholder:italic"
              type="text"
              value={searchTerm}
              placeholder="Enter a Chinese character or phrase"
              autoComplete="off"
              onChange={(e) => setSearchTerm(e.target.value)}
              onKeyDown={(e) => handleEnterKey(e)}
            />

            <button
              className="px-4 py-3 cursor-pointer
                transition-color duration-300 hover:text-rose-500"
              type="button"
              onClick={handleClipboardPaste}
            >
              <ClipboardIcon className="stroke-1 size-6" />
            </button>
          </div>

          <button
            className="px-4 py-3 flex items-center
            bg-rose-600 rounded-lg text-zinc-100 font-medium cursor-pointer 
            transition-color duration-300 hover:bg-rose-500 active:bg-rose-600"
            onClick={() => enterSearchTerm(searchTerm)}
          >
            <MagnifyingGlassIcon className="size-5 mr-2" />
            Search
          </button>
        </form>
      </div>
    </div>
  );
};

export default App;
