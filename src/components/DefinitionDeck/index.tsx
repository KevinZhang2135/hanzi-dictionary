// React and components
import { ReactNode } from 'react';
import DefinitionCard from './DefinitionCard';

// TS types
interface TermDefinition {
  traditional: string;
  simplified: string;
  pinyin: string;
  glossary: string[];
}

const DefinitionDeck = ({
  isDisplayed,
  definitions,
}: {
  isDisplayed: boolean;
  definitions: TermDefinition[];
}): ReactNode => {

  if (!isDisplayed) return;
  return (
    <div className="grow flex flex-col gap-4">
      {definitions.map((element, index) => {
        const definition = element as unknown as TermDefinition;

        return (
          <div
            key={`search-history-${definition.traditional}-${index}`}
            className="animate-appear"
          >
            <DefinitionCard definition={definition} />
          </div>
        );
      })}
    </div>
  );
};

export default DefinitionDeck;
export type { TermDefinition };
