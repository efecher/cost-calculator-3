///<reference path="../typings/component.d.ts" />

import React from 'react';
import gatherData from '../calculation/gather-data';

export default function Summary(props: SummaryProps) {
  let results = gatherData(props.calculationData);

  
  
  
  if(typeof results !== "undefined") {
    return (
      <>
      <p>No results.</p>
      </>
    );
  } else {
    return <>{console.log(results)}</>
  }
}
