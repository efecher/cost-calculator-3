export default function calculateMerit(
  matrix: number[][],
  gpa: number,
  studentStatus: string,
  sat: number,
  act: number
) {
  let result: number = 0;

  console.log(studentStatus);
  if(studentStatus === "freshman") {
    // NOTE:  freshman
    console.log(sat);
    console.log(act);
    if(sat >= 400) {
      // NOTE:  SAT has range of 400-1600 (combined), anything less than 400 assume to be input error and treat as the user meant to leave at zero/didn't take this test/doesn't want to use the score
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

    if(act > 0) {
      // NOTE:  ACT has a range of 1 to 36. If left zero, assume user doesn't want to use this test score or didn't take the test. Use the GPA method to calculate Merit
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

    if(sat === 0 && act === 0) {
      // NOTE:  Merit using GPA ("test optional"), this is a different matrix than the one used to compute based on ACT/SAT 
      console.log("merit test optional");
      for(let r of matrix) {
        if((gpa >= r[0]) && (gpa <= r[1])) {
          // NOTE:  GPA is in range for this row
          result = r[2];
          console.log(result);
          break;
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

  console.log(result);
  return result;
}