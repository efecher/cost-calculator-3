export default function calculateMerit(
  matrix: number[][],
  gpa: number,
  studentStatus: string,
  testScore: number,
  whichTest: string,
  testOptional: boolean
) {
  let result: number = 0;

  // console.log(testOptional);
  // console.log(`Test Score: ${testScore}`);
  // console.log(`Which Test: ${whichTest}`);
  // console.log(`GPA: ${gpa}`);
  
  // TODO: Determine if we are using test scores, then determine which one if we are using the test score method, otherwise use the test optional method. 
  if (!testOptional) {
    // NOTE:  We are using test scores to determine, the date matrix provided should be the "Matrix with test scores"
    if(whichTest === "ACT") {
      // NOTE:  We are using ACT test scores
      for(let row of matrix) {
        if(testScore >= row[4] && testScore <= row[5]) {
          result = row[6];
        }
      }
    } else {
      // NOTE:  We are using SAT scores
      for(let row of matrix) {
        if(testScore >= row[2] && testScore <= row[3]) {
          result = row[6];
        }
      }
    }
  } else {
    // NOTE:  We are using the GPA method to determine
    for(let row of matrix) {
      if(gpa >= row[0] && gpa <= row[1]) {
        result = row[6];
      }
    }
  }
    

  return result;
}