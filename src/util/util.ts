/* UTIL.TS 
*  Grouping of various utility and "helper" functions
*  to support computing the various values for the 
*  user's net cost report
*/ 

// NOTE: given an object and key of said object, returns the key value
// (needed for type assertion since Object.keys doesn't directly satisfy a type trying to match key value pairs with filter)
export function prop<T, K extends keyof T>(obj: T, key: K):T[K] {
  return obj[key];
}

/* NOTE: resolveIncomeRange
*  given the income range as a string from the value 
*  of the radio button the user selected, resolve into a number
*  corresponding to the EFC value for that income range's EFC value *  in the table
*/
export function resolveIncomeRange(range: string): number {
  //console.log(range);
  let index: number = 0;
  
  switch(range) {
    case "$30,000 - $39,999": index = 4; break;
    case "$40,000 - $49,999": index = 5; break;
    case "$50,000 - $59,999": index = 6; break;
    case "$60,000 - $69,999": index = 7; break;
    case "$70,000 - $79,999": index = 8; break;
    case "$80,000 - $89,999": index = 9; break;
    case "$90,000 - $99,999": index = 10; break;
    case "$100,000 or above": index = 11; break;
    default: index = 3; break;
   }  

   //console.log(index);
  return index;
}

/* NOTE: resolveNumberInFamily
*  resolves literal value of user-selected input
*  to numeric representation for comparison
*/
export function resolveNumberInFamily(value: string): number {
  let returnValue: number = 0;

  switch(value) {
    case "Three": returnValue = 3; break;
    case "Four": returnValue = 4; break;
    case "Five": returnValue = 5; break;
    case "Six or more": returnValue = 6; break;
    default: returnValue = 2; break;
  }

  return returnValue;
}

/* NOTE: resolveNumberInCollege
*  resolves literal value of user-selected input to
*  numeric representation for comparison
*/
export function resolveNumberInCollege(value: string): number {
  let returnValue: number = 0;

  switch(value) {
    case "One Child": returnValue = 1; break;
    case "Two Children": returnValue = 2; break;
    default: returnValue = 3; break;
  }

  return returnValue;
}

// NOTE:  determine needs mode based on 
//        - true = NJ Residnet, fasle = out of state
//        - true = freshman, false = transfer student
export function resolveNeedsMode(residency: string, freshman: string): string {
  if(residency === "New Jersey") {
    // NOTE: User is NJ Resident
    if(freshman === "freshman") {
      // NOTE User is freshman
      //console.log("freshmanneedsbasednj");
      return "freshmanneedsbasednj";
    } else {
      // NOTE: User is transfer
      //console.log("transferneedsbasednj");
      return "transferneedsbasednj";
    }
  } else {
    // NOTE: User is NOT NJ Resident
    if(freshman === "freshman") {
      //console.log("freshmannnedsbasednonnj");
      return "freshmanneedsbasednonnj";
    } else {
      //console.log("transferneedsbasednonnj");
      return "transferneedsbasednonnj";
    }
  }
}

export function determineMeritTable(freshmanOrTransfer: string, meritMode: string): string {

  // NOTE:  For Freshman it could be WITH or WITHOUT test
  //        scores. Transfer is without test scores.
  if(freshmanOrTransfer === "freshman") {
    if(meritMode === "meritwithtest") {
      return "freshmanmeritwithtest";
    } else {
      return "merittestoptional";
    }
  } else {
    // NOTE:  Transfer, doesn't use test scores uses it's 
    //        own different "merit" table  
    return "transfermeritbased";
  }
}

export function determineDependency(age: number, children: boolean, married: boolean): string {
  if (age < 24) {
    return "efcindependent";
  } else {
    if(children || married) {
      return "efcindependentwithdependents";
    } else {
      return "efcindependentnodependents";
    }
  }
}