///<reference path="../typings/calculation.d.ts" />

// NOTE: Determines Dependency Status
export default function determineDependency(
  age: number, 
  childSupport: boolean, 
  married: boolean)
  : string {
    
  let dependency = "";

  if((age <= 24) || !married) {
    dependency = "efcdependent"; 
  } else {
    if(childSupport) {
      dependency = "efcindependentwithdependents";
    } else {
      dependency = "efcindependentnodependents";
    }
  }

  return dependency;
}