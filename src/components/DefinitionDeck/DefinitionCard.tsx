// React and components
import { ReactNode } from "react";

// TS types
import { TermDefinition } from ".";

const DefinitionCard = (props: { definition: TermDefinition }): ReactNode => {
  const { definition } = props as { definition: TermDefinition };

  return (
    <div
      className="px-4 py-3 block bg-zinc-800 rounded-lg
        transition ease-in-out hover:scale-105 hover:bg-zinc-700 duration-300 delay-100
        *:my-1 *:first:mt-0 *:last:mb-0"
    >
      <h2 className="text-2xl text-zinc-100 font-normal">
        {definition.simplified} (<span className="text-xl">trad:</span>{" "}
        {definition.traditional})
      </h2>

      <p className="text-zinc-200">Pinyin: {definition.pinyin}</p>
      <p className="text-zinc-200">
        Definition: {definition.glossary.join("; ")}
      </p>
    </div>
  );
};

export default DefinitionCard;
