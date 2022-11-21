// NOTE:  calculateTAG
//        - uses the determined EFC value to find the 
//          Assistance Grant.  
//          EFC will fall between the first two numbers in the correct
//          array and the 3rd value will be the TAG amount.  
//        - only for NJ students, all others will return 0.

export default function calculateTAG(
  stateResidency: string, 
  tagTable: number[][], 
  efc: number
  ): number {
  
  if(stateResidency === "New Jersey") {
    for(let r of tagTable) {
      if((efc >= r[0]) && (efc <= r[1])) {
        return r[2];
      }
    }
  }
  // NOTE:  Return 0 if user is not NJ resident as TAG is only for NJ residents.
  return 0;
}