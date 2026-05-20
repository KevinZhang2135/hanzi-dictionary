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
      className="px-4 py-3 block bg-white/5 rounded-lg   
        *:my-1 *:first:mt-0 *:last:mb-0"
    >
      <h2 className="text-xl md:text-2xl">
        {definition.simplified} ( <span className="body-text">trad:</span>{' '}
        {definition.traditional} )
      </h2>

      <p className="body-text text-zinc-300">Pinyin: {definition.pinyin}</p>
      <p className="body-text text-zinc-300">
        Definition: {definition.glossary.join('; ')}
      </p>
    </div>
  );
};

export default DefinitionCard;
