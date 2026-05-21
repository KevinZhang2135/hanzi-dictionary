/* React and components */
import { ReactNode, useEffect, useState } from 'react';
import {
  MagnifyingGlassIcon,
  ClipboardIcon,
} from '@heroicons/react/24/outline';

import DefinitionDeck, { TermDefinition } from './components/DefinitionDeck';
import SegmentSuggestions from './components/SegmentSuggestions';
import Spinner from './components/Spinner';

/* Chinese segmenter */
const segmenterZh = new Intl.Segmenter('zh', { granularity: 'word' });

/*
 * Uses PaddleOCR by Baidu for recognizing characters in the clipboard
 * Tesseract works as well, but PaddleOCR handles better with CJK characters
 */
// import * as ocr from '@paddlejs-models/ocr';
// await (ocr as any).init();

/*
 * Imports dictionary entries for Chinese characters and phrases and mappings
 * for traditional and simplified characters
 */
const dictEntries = await fetch('cedict-ts.json').then((res) => res.json());
const charMappings = await fetch('char-mappings.json').then((res) =>
  res.json()
);

/*
 * Icons and graphics
 */
const clipBoardIcon = <ClipboardIcon className="size-6 stroke-2" />;
const spinnerIcon = (
  <Spinner className="size-6 rotate-60 stroke-4 text-zinc-100" />
);

/**
 * Retrieves the dictionary entries for a specified term.
 * @param {string} term The specified character or phrase to retrieve the
 *   dictionary entry for
 * @returns A list of dictionary entry objects for the specified term, or []
 *   if the term does not exist
 */
const getDictEntries = (term: string): TermDefinition[] => {
  // Check if the term exists in the dictionary entries and retrieves all
  // definitions associated with the term.
  if (term in charMappings) {
    return charMappings[term].map((index: number) => dictEntries[index]);
  }

  return [];
};

const App = (): ReactNode => {
  // The text within the main search bar
  const [searchTerm, setSearchTerm] = useState<string>('');

  // The sequence of words within `searchTerm`
  const [segments, setSegments] = useState<string[]>([]);

  // The set of definitions associated with `searchTerm`
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
    if (!term) return; // Empty search term
    setSearchTerm(''); // Clears text in the main search bar

    // Attempts to directly search the term; some slang terms may not be
    // recognized by the segmenter
    if (term in charMappings) {
      setDefinitions(getDictEntries(term));
      return;
    }

    // Otherwise, attempts to segment the term into smaller sub-terms.
    // If the term is not in the dictionary, split it into its constituent
    // characters that are in the dictionary
    const segments = Array.from(segmenterZh.segment(term)).reduce(
      (acc, { segment }) => {
        if (segment in charMappings) {
          return [...acc, segment];
        }

        return [
          ...acc,
          ...segment.split('').filter((char) => char in charMappings),
        ];
      },
      [] as string[]
    );

    // If the segment is isolated, treat it as if it was an usual single term
    if (segments.length === 1) {
      let entries = getDictEntries(segments[0]);
      entries && setDefinitions(entries);
    }

    // Otherwise create suggestions using the segments
    else if (segments.length > 0) {
      setSegments(segments);
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
   * Handles pasting from the clipboard. If text is found, it is used as the
   * search term. If an image is found, it is processed using Tesseract OCR to
   * extract text before being used as the search term.
   */
  const handleClipboardPaste = async () => {
    // if (!worker) return;
    // const clipboard = (await navigator.clipboard.read())[0];
    // // Retrieve image from clipboard
    // if (clipboard.types.includes('image/png')) {
    //   const image64 = await clipboard.getType('image/png');
    //   // Recognize text from image using Tesseract OCR and search for it
    //   worker
    //     .recognize(image64)
    //     .then(
    //       ({ data: { text } }) =>
    //         text && setSearchTerm(text.replaceAll(/\s/g, ''))
    //     );
    // }
    // // Retrieve text from clipboard
    // else if (clipboard.types.includes('text/plain')) {
    //   clipboard
    //     .getType('text/plain')
    //     .then((textBlob) => textBlob.text())
    //     .then((text) => text && setSearchTerm(searchTerm + text));
    // }
  };

  return (
    <div
      className="m-auto min-w-75 max-w-200 min-h-screen px-4 md:px-8
        flex flex-col text-zinc-100 animate-appear"
    >
      <h1
        className="sticky top-0 py-4 
          bg-linear-to-b from-30% from-neutral-900 to-transparent 
          backdrop-blur-xs"
      >
        Chinese English Dictionary
      </h1>

      {/* Instructions; disappears upon searching */}
      {definitions.length === 0 && (
        <div className="flex flex-col gap-2 body-text text-zinc-300">
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
      <DefinitionDeck
        isDisplayed={definitions.length > 0}
        definitions={definitions}
      />

      {/* Input Bar */}
      <div
        className={`${definitions.length > 0 ? 'sticky bottom-0' : ''} 
          py-4 flex flex-col gap-2
          bg-linear-to-t from-30% from-neutral-900 to-transparent`}
      >
        {/* Segment Suggestions */}
        <SegmentSuggestions
          isDisplayed={segments.length > 0}
          segments={segments}
          enterSearchTerm={enterSearchTerm}
        />

        {/* Search Input */}
        <form
          id="search-input"
          className="body-text flex bg-zinc-950/50 rounded-lg backdrop-blur-xs"
          onSubmit={(e) => e.preventDefault()}
        >
          {/* Search Input Field */}
          <input
            autoFocus
            id="character-input"
            className="button min-w-30 mr-2 flex-1 text-ellipsis cursor-text
              placeholder:text-zinc-300 placeholder:italic"
            type="text"
            value={searchTerm}
            placeholder="Enter a Chinese character or phrase"
            autoComplete="off"
            onChange={(e) => setSearchTerm(e.target.value)}
            onKeyDown={(e) => handleEnterKey(e)}
          />

          {/* Clipboard Paste Button */}
          <button
            className="button
                transition-color duration-300 hover:text-rose-500
                disabled:cursor-progress disabled:text-zinc-400"
            type="button"
            // disabled={worker === null || workerInProgress}
            // onClick={() => {
            //   setWorkerInProgress(true);
            //   handleClipboardPaste().then(() => setWorkerInProgress(false));
            // }}
          >
            {clipBoardIcon}
          </button>

          {/* Search Button */}
          <button
            className="button transition-color bg-rose-600 font-medium
              duration-300 hover:bg-rose-500 active:bg-rose-600"
            onClick={() => enterSearchTerm(searchTerm)}
          >
            <MagnifyingGlassIcon className="size-5 stroke-3" />
          </button>
        </form>
      </div>
    </div>
  );
};

export default App;
