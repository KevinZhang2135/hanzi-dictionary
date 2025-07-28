import { ReactNode } from 'react';

const SegmentSuggestions = (props: {
  isDisplayed: boolean;
  segments: string[];
  enterSearchTerm: (term: string) => void;
}): ReactNode => {
  const { isDisplayed, segments, enterSearchTerm } = props;
  if (!isDisplayed) return;

  return (
    <div className="flex flex-nowrap gap-2 overflow-x-auto overflow-y-hidden
        text-base md:text-lg text-zinc-100 text-nowrap"
    >
      {segments.map((segment, index) => {
        return (
          <button
            key={`segment-suggestion-${segment}-${index}`}
            className="px-2 py-1 bg-zinc-950 rounded-md animate-appear
              transition ease-in-out duration-300 delay-100
              hover:scale-105 hover:bg-rose-500
              active:bg-rose-600"
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
