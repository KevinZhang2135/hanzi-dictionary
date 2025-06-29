import { ReactNode } from "react";

const SegmentSuggestions = (props: {
  isDisplayed: boolean;
  segments: string[];
  enterSearchTerm: (term: string) => void;
}): ReactNode => {
  const { isDisplayed, segments, enterSearchTerm } = props;
  if (!isDisplayed) return;

  return (
    <div className="flex flex-nowrap gap-2 overflow-x-auto text-nowrap">
      {segments.map((segment, index) => {
        return (
          <button
            key={`segment-suggestion-${segment}-${index}`}
            className="px-2 py-1 bg-zinc-950 rounded-md 
                text-zinc-100 text-base
                animate-appear transition-color duration-300
                hover:bg-rose-500 active:bg-rose-600"
            onClick={() => enterSearchTerm(segment)}
          >
            {segment}
          </button>
        );
      })}
    </div>
  );
};

export default SegmentSuggestions;
