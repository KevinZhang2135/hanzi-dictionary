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
      className="px-4 py-3 block bg-zinc-800 rounded-lg
        transition ease-in-out hover:scale-105 hover:bg-zinc-700 duration-300 delay-100
        *:my-1 *:first:mt-0 *:last:mb-0"
    >
      <h2 className="text-2xl text-zinc-100 font-normal">
        {termEntry.simplified} (<span className="text-xl">trad:</span> {termEntry.traditional})
      </h2>

      <p className="text-zinc-200">Pinyin: {termEntry.pinyin}</p>
      <p className="text-zinc-200">
        Definition: {termEntry.glossary.join('; ')}
      </p>
    </div>
  );
};

export default SearchTerm;
export type { TermEntry };
