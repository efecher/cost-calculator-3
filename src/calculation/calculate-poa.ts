export default function calculatePOA(
  matrix: number[][],
  livingSituation: string
) :number[] {

  // NOTE:  Holds the values pulled from the tuition breakdown data (Total tuition, room & board, fees, books, etc)
  let returnValues: number[] = [];
  console.log(matrix);
  // NOTE:  Total tuition and "room and board" value
  switch(livingSituation) {
    case "Alone/off-campus/with roommate": 
      returnValues.push(matrix[0][2]); // NOTE: Total
      returnValues.push(matrix[1][2]); // NOTE: Tuition
      returnValues.push(matrix[3][2]); // NOTE: Fees
      break;

    case "With parents/family": 
      returnValues.push(matrix[0][1]);
      returnValues.push(matrix[1][1]);
      returnValues.push(matrix[3][1]);
      break;

    default:
      // NOTE:  most often is likely On campus
      returnValues.push(matrix[0][0]);
      returnValues.push(matrix[1][0]);
      returnValues.push(matrix[3][0]);
  }
  console.log(returnValues);
  return returnValues;
}