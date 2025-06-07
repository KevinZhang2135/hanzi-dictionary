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
  init().then(() => console.log(cut("中华人民共和国武汉市长江大桥")));

  const [searchTerm, setSearchTerm] = useState<string>("");
  const [searchDefinitions, setSearchDefinitions] = useState<TermDefinition[]>(
    []
  );

  const enterSearchTerm = () => {
    const entry = getDictEntry(searchTerm);
    setSearchTerm("");

    if (entry) {
      setSearchDefinitions([...entry]);
    } else {
      // If the term is not immediately in the dictionary, segments the phrase
      // into smaller segments as suggestions to search
      // console.log(cut("中华人民共和国武汉市长江大桥", true));
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    e.key === "Enter" && enterSearchTerm();
  };

  return (
    <div className="*:my-4 *:first:mt-0 *:last:mb-0">
      <h1 className="text-3xl text-zinc-100 font-medium">
        Chinese English Dictionary
      </h1>

      <p className="text-zinc-200">
        Dictionary that looks up Pinyin and English definition of Chinese
        characters and phrases.
      </p>

      {/* Search History and Definitions */}
      <DefinitionDeck
        isDisplayed={searchDefinitions.length > 0}
        searchDefinitions={searchDefinitions}
      />

      {/* Search Input */}
      <div
        id="search-input"
        className="animate-appear flex flex-col sm:flex-row sticky bottom-8 gap-4"
      >
        <div className="*:px-4 *:py-3 *:bg-zinc-950 flex flex-1">
          <input
            id="character-input"
            className="flex-1 bg-zinc-950 text-zinc-100 rounded-l-lg
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
            onClick={() => enterSearchTerm()}
          >
            <ViewfinderCircleIcon className="stroke-1 size-6" />
          </button>
        </div>

        <button
          className="px-4 py-3 flex items-center rounded-lg
            bg-rose-500 text-zinc-100 font-medium cursor-pointer 
            transition-color duration-300 hover:bg-rose-400 active:bg-rose-600"
          onClick={() => enterSearchTerm()}
        >
          <MagnifyingGlassIcon className="size-5 mr-2" />
          Search
        </button>
      </div>
    </div>
  );
};

export default App;
