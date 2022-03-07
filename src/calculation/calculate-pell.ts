export default function calculatePell(
  efc: number, 
  pellTable: number[][]
  ): number {

  //console.log(pellTable);
  let pell: number = 0;
  
  for(let r of pellTable) {
    if((efc >= r[0]) && (efc <= r[1])) {
      pell = r[2];
      break;
    }
  }
  //console.log(`Pell: ${pell}`);
  return pell;
}