export default function calculateEFC(
  matrix: number[][],
  numInCollege: number,
  numInFamily: number,
  incomeRange: number
  ): number {
    console.log(`numInCollege = ${numInCollege}`);
    console.log(`numInFamily = ${numInFamily}`);
    console.log(matrix);
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
    console.log(row[incomeRange]);
  return row[incomeRange];
}