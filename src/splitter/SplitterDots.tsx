import React from 'react';

export default function SplitterDots() {
  return <div className="aiiif-splitter-dots">
    {[0,1,2,3,4,5,6].map(i => <div key={i}>
      <div /><div />
    </div>)}
    </div>;
}
