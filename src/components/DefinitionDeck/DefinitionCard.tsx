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
      className="px-4 py-3 block bg-zinc-800 rounded-lg   
        transition delay-100 duration-300 ease-in-out 
        hover:scale-105 hover:bg-zinc-700
        *:my-1 *:first:mt-0 *:last:mb-0"
    >
      <h2 className="text-xl md:text-2xl text-zinc-100 ">
        {definition.simplified} ( trad: {definition.traditional} )
      </h2>

      <p className="body-text text-zinc-200">
        Pinyin: {definition.pinyin}
      </p>
      <p className="body-text text-zinc-200">
        Definition: {definition.glossary.join('; ')}
      </p>
    </div>
  );
};

export default DefinitionCard;
