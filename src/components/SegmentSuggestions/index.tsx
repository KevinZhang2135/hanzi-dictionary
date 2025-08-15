import { ReactNode } from 'react';

const SegmentSuggestions = (props: {
  isDisplayed: boolean;
  segments: string[];
  enterSearchTerm: (term: string) => void;
}): ReactNode => {
  const { isDisplayed, segments, enterSearchTerm } = props;
  if (!isDisplayed) return;

  return (
    <div
      className="flex flex-nowrap gap-2 overflow-x-auto overflow-y-hidden 
        text-base md:text-lg text-nowrap text-zinc-100"
    >
      {segments.map((segment, index) => {
        return (
          <button
            key={`segment-suggestion-${segment}-${index}`}
            className="px-2 py-1 bg-zinc-950 rounded-md  
              animate-appear transition delay-100 duration-300 ease-in-out
              hover:scale-105 hover:bg-rose-500 active:bg-rose-600"
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
