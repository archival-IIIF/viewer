import React from 'react';

interface IProps {
  direction: "horizontal"|"vertical";
}


export default function SplitterDots(props: IProps) {

  const dots = props.direction === "vertical" ?
      <>{[0,1,2,3,4,5,6].map(i => <div key={i}>
        <div /><div />
      </div>)}</> :
      <>{[0,1].map(i => <div key={i}>
        <div /><div /><div /><div /><div /><div /><div />
      </div>)} </>;

  return <div className="aiiif-splitter-dots">
      {dots}
    </div>;
}
