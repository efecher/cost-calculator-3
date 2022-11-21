///<reference path="../typings/calculation.d.ts" />

// NOTE: Determines Dependency Status
export default function determineDependency(
  age: number, 
  childSupport: boolean, 
  married: boolean
): string {
    
  if((age <= 24) || !married) {
    return "efcdependent"; 
  } else {
    return childSupport ? "efcindependentwithdependents" : "efcindependentnodependents";
  }
}