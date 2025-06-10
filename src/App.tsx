// Styling
import "./App.css";

// React and component
import { ReactNode, useState } from "react";
import {
  MagnifyingGlassIcon,
  ViewfinderCircleIcon,
} from "@heroicons/react/24/outline";
import DefinitionDeck, { TermDefinition } from "./components/DefinitionDeck";

// Chinese phrase segmenter
import init, { cut } from "jieba-wasm";
import SegmentSuggestions from "./components/SegmentSuggestions";
await init();

// Imports dictionary entries for Chinese characters and phrases and mappings
// for traditional and simplified characters
const dictEntries = await (
  await fetch("cedict-ts.json", {
    headers: {
      "Content-Type": "application/json",
      Accept: "application/json",
    },
  })
).json();

const charMappings = await (
  await fetch("char-mappings.json", {
    headers: {
      "Content-Type": "application/json",
      Accept: "application/json",
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
  const [searchTerm, setSearchTerm] = useState<string>("");
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
    if (!term) return;

    const entry = getDictEntry(term);
    setSearchTerm("");

    if (entry) {
      setDefinitions([...entry]);
    } else {
      const segments = cut(term, true).filter((segment) => segment in charMappings);
      segments.length > 0 && setSegments(segments);
    }
  };

  /**
   * Searches the input as if the search button was pressed upon pressing the
   * enter key
   * @param {React.KeyboardEvent<HTMLInputElement>} e Browser event
   */
  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    e.key === "Enter" && enterSearchTerm(searchTerm);
  };

  return (
    <div className="flex flex-col gap-4">
      <h1 className="text-2xl text-zinc-100 font-medium">
        Chinese English Dictionary
      </h1>

      <p className="text-zinc-200">
        Dictionary that looks up Pinyin and English definition of Chinese
        characters and phrases.
      </p>

      {/* Search History and Definitions */}
      <DefinitionDeck
        isDisplayed={definitions.length > 0}
        definitions={definitions}
      />

      <div className="flex flex-col sticky bottom-8 gap-1">
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
          <div className="*:px-4 *:py-3 *:bg-zinc-950 flex flex-1">
            <input
              id="character-input"
              className=" flex-1 bg-zinc-950 text-zinc-100 rounded-l-lg
                placeholder:text-zinc-300 placeholder:italic"
              type="text"
              value={searchTerm}
              placeholder="Enter a Chinese character or phrase"
              autoComplete="off"
              onChange={(e) => setSearchTerm(e.target.value)}
              onKeyDown={(e) => handleKeyDown(e)}
            />

            <button
              className="rounded-r-lg cursor-pointer
            transition-color duration-300 hover:text-rose-500"
              type="submit"
            >
              <ViewfinderCircleIcon className="stroke-1 size-6" />
            </button>
          </div>

          <button
            className="px-4 py-3 flex items-center rounded-lg
            bg-rose-500 text-zinc-100 font-medium cursor-pointer 
            transition-color duration-300 hover:bg-rose-400 active:bg-rose-600"
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
