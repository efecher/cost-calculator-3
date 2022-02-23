interface TestScores {
  SAT?: number,
  ACT?: number
}  

interface MeritTables {
  meritSAT: number[][],
  meritACT: number[][],
  merittransfer: number[][],
  merittestoptional: number[][]
}

interface NeedsTables {
  freshmanNeedsBasedEFCNJResident: number[][],
  freshmanNeedsBasedEFCNonNJResident: number[][],
  transferNeedsBasedEFCNJResident: number[][],
  transferNeedsBasedEFCNonNJResident: number[][]
}

interface HTTPResponse<T> extends Response {
  parsedBody?: T
}

interface EFCTable {
  data: number[][];
}

interface POATable {
  poatotaladmissioncost: number[]
  poatuitionfees: number[],
  poabookssupplies: number[],
  poaroomboard: number[],
  poaotherexpenses: number[]
}

interface CalculationData {
    [key: string]: string
}

interface Report {
  dependency: string,
  EFC: number,
  Pell: number,
  TAG: number,
  Merit: number,
  Needs: number,
  POA: LooseObject
}