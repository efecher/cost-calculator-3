export default function calculateMerit(
  matrix: number[][],
  gpa: number,
  studentStatus: string,
  testScore: number,
  whichTest: string,
  testOptional?: boolean
) {
  let result: number = 0;

  console.log(testOptional);
  console.log(`Test Score: ${testScore}`);
  console.log(`Which Test: ${whichTest}`);
  console.log(`GPA: ${gpa}`);
  
  // TODO: Determine if we are using test scores, then determine which one if we are using the test score method, otherwise use the test optional method. 
    
    

  return result;
}