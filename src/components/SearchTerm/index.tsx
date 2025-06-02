import { ReactNode } from 'react';

interface TermEntry {
  traditional: string;
  simplified: string;
  pinyin: string;
  glossary: string[];
}

const SearchTerm = (props: { termEntry: TermEntry }): ReactNode => {
  const { termEntry } = props as { termEntry: TermEntry };

  return (
    <div
      className="mb-2 px-4 py-3 block bg-gray-800 rounded-lg
        transition ease-in-out hover:scale-105 hover:bg-gray-700 duration-200 delay-100
        *:py-2 *:first:pt-0 *:last:pb-0"
    >
      <h2 className="text-2xl text-gray-100 font-medium">
        {termEntry.simplified} ({termEntry.traditional})
      </h2>

      <p className="text-gray-200">Pinyin: {termEntry.pinyin}</p>
      <p className="text-gray-200">Definition: {termEntry.glossary.join('; ')}</p>
    </div>
  );
};

export default SearchTerm;
export type { TermEntry };
