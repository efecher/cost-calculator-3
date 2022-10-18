export default function calculateMerit(
  freshmanOrTransfer: string,
  matrix: number[][],
  gpa: number,
  testScore: number,
  whichTest: string,
  useTest: boolean
) {
  let result: number = 0;
  console.log(...arguments)

  // NOTE:  There is a different matrix depending on if we are using a test-optional calculation. Both methods take into account GPA, but "With Test Scores" uses both the GPA AND Either the ACT or SAT score to determine value

  // NOTE:  High School of Transfer? 
  if(freshmanOrTransfer === "freshman") {
    // NOTE:  this is a high school student. ACT/SAT or GPA
    if(!useTest) {
      // NOTE:  using GPA-only alternative to calculate (3 column matrix)
      for(let row of matrix) {
        if(gpa >= row[0] && gpa <= row[1]){
          result = row[2];
        }
      }
    } else {
      // NOTE:  using either ACT or SAT score to calculate (GPA AND ACT/SAT values needed for lookup in 7-column matrix)
      if(whichTest === "SAT") {
        // NOTE:  use SAT
        for(let row of matrix){
          if(
            (gpa >= row[0] && gpa <= row[1]) &&
            (testScore >= row[2] && testScore <= row[3])
          ){
            result = row[6];
          }
        }
      } else {
        // NOTE:  use ACT
        for(let row of matrix){
          if(
            (gpa >= row[0] && gpa <= row[1]) &&
            (testScore >= row[0] && testScore <= row[1])
          ){
            result = row[6];
          }
        }
      }
    }
  } else {
    // NOTE: This is a Transfer student, only go by GPA
    for(let row of matrix) {
      if(gpa >= row[0] && gpa <= row[1]){
        result = row[6];
      }
    }
  }

  return result;
}