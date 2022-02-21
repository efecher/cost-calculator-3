export default function calculateEFC(
  matrix: number[][],
  numInCollege: number,
  numInFamily: number,
  incomeRange: number
  ): number {
    // NOTE:  find the row we need based on matching 
    //        the # in college and # in family values
    let row: number[] = [];
    for(let r of matrix) {
      if((r[0] === numInCollege) && (r[1] === numInFamily)) {
        row = r;
        break;
      }
    }

  // NOTE:  we found the row, the value for incomeRange
  //        will be the EFC value to return.

  return row[incomeRange];
}