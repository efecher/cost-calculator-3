export default function calculatePell(
  pellTable: number[][],
  efc: number
  ): number {
  
  for(let r of pellTable) {
    if((efc >= r[0]) && (efc <= r[1])) {
      return  r[2];
    }
  }
  
  // NOTE:  Return 0 if value not found in matrix
  return 0;
}