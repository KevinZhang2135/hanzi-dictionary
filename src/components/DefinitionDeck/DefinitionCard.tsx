// React and components
import { ReactNode } from 'react';

// TS types
import { TermDefinition } from '.';

const DefinitionCard = ({
  definition,
}: {
  definition: TermDefinition;
}): ReactNode => {
  return (
    <div
      className="block rounded-lg bg-zinc-800 px-4 py-3 
        transition delay-100 duration-300 ease-in-out 
        *:my-1 *:first:mt-0 *:last:mb-0
        hover:scale-105 hover:bg-zinc-700"
    >
      <h2 className="text-xl text-zinc-100 md:text-2xl">
        {definition.simplified} ( trad: {definition.traditional} )
      </h2>

      <p className="text-sm text-zinc-200 md:text-base">
        Pinyin: {definition.pinyin}
      </p>
      <p className="text-sm text-zinc-200 md:text-base">
        Definition: {definition.glossary.join('; ')}
      </p>
    </div>
  );
};

export default DefinitionCard;
