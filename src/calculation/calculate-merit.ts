export default function calculateMerit(
  matrix: number[][],
  gpa: number,
  studentStatus: string,
  sat?: number,
  act?: number
) {
  let result: number = 0;

  console.log(studentStatus);
  if(studentStatus === "freshman") {
    // NOTE:  freshman
    if(typeof sat !== 'undefined') {
      // NOTE:  with test scores and using SAT
      // NOTE:  find the row we need
      for(let r of matrix) {
        if((gpa >= r[0]) && (gpa <= r[1])) {
          // NOTE:  we found the GPA range see if SAT range matches
          if((sat >= r[2]) && (sat <= r[3])) {
            // NOTE:  get the last value which is the award amount
            result = r[6]; 
            break;
          }
        }
      }
    }

    if(typeof act !== 'undefined') {
      // NOTE:  with test scores and using ACT
      // NOTE:  find the row we need
      for(let r of matrix) {
        if((gpa >= r[0]) && (gpa <= r[1])) {
          // NOTE:  we found the GPA range see if ACT range matches
          if((act >= r[4]) && (act <= r[5])) {
            // NOTE:  get the last value which is the award amount
            result = r[6]; 
            break;
          }
        }
      }
    }
  } else {
    // NOTE:  transfer
    // NOTE:  find the row we need
    for(let r of matrix) {
      if((gpa >= r[0]) && (gpa <= r[1])) {
        result = r[2];
        break;
      }
    }
  }

  return result;
}