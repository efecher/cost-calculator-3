export default function calculateNeeds(
  matrix: number[][],
  efc: number,
  gpa: number,
  studentStatus: string
): number {
// NOTE:  we should have the correct matrix based on residency and freshman/transfer already. Use the values passed in for EFC & GPA to find the needs value
  // console.log(matrix);
  // console.log(gpa);
  let row: number[] = [];

  // console.log(`EFC: ${efc}`);
  // console.log(`GPA: ${gpa}`);
  // console.log(`Student Status: ${studentStatus}`);

  if(studentStatus === "transfer") {
    for(let r of matrix) {
      if((efc > r[0] && efc <= r[1])) {
        // NOTE:  if the EFC falls in the range, we found the row
        row = r;
        break;
      }
    }

    if(gpa < 3) {
      return row[2];
    }

    if((gpa >= 3) && (gpa < 3.5)) {
      return row[3];
    }

    if(gpa >= 3.5) {
      return row[4];
    }
    console.log("result");
  } else {
    // NOTE:  freshman
    //console.log("FRESHMAN!");
    for(let r of matrix) {
      if(efc >= r[0]) {
        if(efc <= r[1]) {
          return r[2];
        }
      } 
    }
    //console.log(result);
  }

  // NOTE:  by default return 0 if a value wasn't found
  return 0;
} 