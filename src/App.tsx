// React and component
import { ReactNode, useEffect, useState } from "react";
import {
  MagnifyingGlassIcon,
  ClipboardIcon,
} from "@heroicons/react/24/outline";

import DefinitionDeck, { TermDefinition } from "./components/DefinitionDeck";
import SegmentSuggestions from "./components/SegmentSuggestions";
import Spinner from "./components/Spinner";

// Chinese phrase segmenter
import init, { cut } from "jieba-wasm";
await init();

// Tesseract OCR
import { createWorker } from "tesseract.js";
import workerPath from "tesseract.js/dist/worker.min.js?url";

// Will not work on all devices, but works for Chrome Extensions
import corePath from "tesseract.js-core/tesseract-core-simd.wasm.js?url";

// Imports dictionary entries for Chinese characters and phrases and mappings
// for traditional and simplified characters
const dictEntries = await fetch("cedict-ts.json").then((res) => res.json());
const charMappings = await fetch("char-mappings.json").then((res) =>
  res.json()
);

/**
 * Retrieves the dictionary entries for a specified term.
 * @param {string} term The specified character or phrase to retrieve the
 *   dictionary entry for
 * @returns A list of dictionary entry objects for the specified term, or null if the
 *   term does not exist
 */
const getDictEntries = (term: string): TermDefinition[] | null => {
  // Check if the term exists in the dictionary entries
  if (term in charMappings) {
    return charMappings[term].map((index: number) => dictEntries[index]);
  }

  return null;
};

const App = (): ReactNode => {
  const [searchTerm, setSearchTerm] = useState<string>("");
  const [segments, setSegments] = useState<string[]>([]);

  const [definitions, setDefinitions] = useState<TermDefinition[]>([]);

  const clipBoardIcon = <ClipboardIcon className="stroke-2 size-6" />;
  const spinnerIcon = (
    <Spinner className="stroke-4 size-6 text-zinc-100 rotate-60" />
  );

  const [workerInProgress, setWorkerInProgress] = useState<boolean>(false);
  const [worker, setWorker] = useState<Tesseract.Worker | null>(null);
  useEffect(() => {
    // Attempts to load SIMD core path
    createWorker(["chi_sim", "chi_tra"], 1, {
      workerPath,
      langPath: "trained-data",
      corePath,
      workerBlobURL: false,
      cacheMethod: "refresh",
    }).then(setWorker);

    return () => {
      worker?.terminate();
    };
  }, []);

  /**
   * Looks up the term in the dictionary and clears the {@code searchTerm}. If
   * the term exists, all definitions are outputted to {@code definitions}.
   * Otherwise, if the term is not immediately in the dictionary, the phrase
   * is segmented into smaller segments in {@code segments}
   * @param {string} term The phrase to look up
   */
  const enterSearchTerm = (term: string) => {
    term = term.replaceAll(/\s/g, ""); // Remove all whitespace
    if (!term) return; // Empty search term

    let entries = getDictEntries(term);
    setSearchTerm("");

    // Term is easily found in dictionary
    if (entries) {
      setDefinitions(entries);
      return;
    }

    // Otherwise, the term is not immediately in the dictionary.

    // Attempts to segment the term into smaller sub-terms. If none found,
    // each character is treated as a segment
    let segments = cut(term);

    // Handles segments where the dictionary does not have an entry
    // by splitting them into their constituent characters
    for (let i = 0; i < segments.length; i++) {
      const segment = segments[i];

      if (!(segment in charMappings)) {
        // Inserts characters as segments
        segments.splice(i, 1, ...segment.split(""));

        // Skip over added characters; minus one is to remove the original
        // segment
        i += segment.length - 1;
      }
    }

    // Final check to remove unsanitary segments
    segments = segments.filter((segment) => segment in charMappings);

    // If the segment is isolated, treat it as if it was an usual single term
    if (segments.length === 1) {
      entries = getDictEntries(segments[0]);
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
    e.key === "Enter" && enterSearchTerm(searchTerm);
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
    if (!worker) return;
    const clipboard = (await navigator.clipboard.read())[0];

    // Retrieve image from clipboard
    if (clipboard.types.includes("image/png")) {
      const image64 = (await clipboard
        .getType("image/png")
        .then((imageBlob) => blobToBase64(imageBlob))) as string;

      // Recognize text from image using Tesseract OCR and search for it
      const {
        data: { text },
      } = await worker.recognize(image64);
      text && setSearchTerm(text.replaceAll(/\s/g, ""));
    }

    // Retrieve text from clipboard
    else if (clipboard.types.includes("text/plain")) {
      clipboard
        .getType("text/plain")
        .then((textBlob) => textBlob.text())
        .then((text) => {
          text && setSearchTerm(searchTerm + text);
        });
    }
  };

  return (
    <div className="flex flex-col gap-4 animate-appear">
      <h1 className="text-zinc-100">
        Chinese English Dictionary
      </h1>

      {/* Instructions; disappears upon searching */}
      {definitions.length === 0 && (
        <div className="body-text flex flex-col gap-2 text-zinc-200">
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

      {/* Input Bar */}
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
          className="flex flex-col sm:flex-row gap-2 
            body-text text-zinc-100 animate-appear"
          onSubmit={(e) => e.preventDefault()}
        >
          <div className="rounded-lg bg-zinc-950 flex flex-1">
            {/* Search Input Field */}
            <input
              autoFocus
              id="character-input"
              className="min-w-30 button flex-1 text-ellipsis cursor-text!
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
                disabled:text-zinc-400 disabled:cursor-progress"
              type="button"
              disabled={worker === null || workerInProgress}
              onClick={() => {
                setWorkerInProgress(true);
                handleClipboardPaste().then(() => setWorkerInProgress(false));
              }}
            >
              {workerInProgress ? spinnerIcon : clipBoardIcon}
            </button>
          </div>

          {/* Search Button */}
          <button
            className="button bg-rose-600 font-medium
              transition-color duration-300 
              hover:bg-rose-500 active:bg-rose-600"
            onClick={() => enterSearchTerm(searchTerm)}
          >
            <MagnifyingGlassIcon className="stroke-3 size-5" />
            Search
          </button>
        </form>
      </div>
    </div>
  );
};

export default App;
