// React and components
import { ReactNode } from "react";
import DefinitionCard from "./DefinitionCard";

// TS types
interface TermDefinition {
  traditional: string;
  simplified: string;
  pinyin: string;
  glossary: string[];
}

const DefinitionDeck = (props: {
  isDisplayed: boolean;
  definitions: TermDefinition[];
}): ReactNode => {
  const { isDisplayed, definitions } = props;
  if (!isDisplayed) return;
  
  return (
    <div className="*:my-2 *:first:mt-0 *:last:mb-0">
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
