export default function calculateNeeds(
  matrix: number[][],
  efc: number,
  gpa: number
): number {
// NOTE:  we should have the correct matrix based on residency and freshman/transfer already. Use the values passed in for EFC & GPA to find the needs value
  let row: number[] = [];
  let result: number = 0;

  for(let r of matrix) {
    if((efc > r[0] && efc <= r[1])) {
      // NOTE:  if the EFC falls in the range, we found the row
      row = r;
      break;
    }
  }

  if(gpa < 3) {
    result = row[2];
  }

  if((gpa >= 3) && (gpa < 3.5)) {
    result = row[3];
  }

  if(gpa >= 3.5) {
    result = row[4];
  }

  return result;
}