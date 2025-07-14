// React and components
import { ReactNode } from 'react';

const Spinner = (props: { className?: string }): ReactNode => {
  const { className } = props as { className?: string };
  return (
    <div className={className}>
      <svg className="animate-spin-fast" viewBox="0 0 24 24">
        <path stroke="currentColor" d="M 12 4 A 8 8 0 0 1 20 12" />
      </svg>
    </div>
  );
};

export default Spinner;
