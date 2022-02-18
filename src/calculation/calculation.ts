///<reference path="../typings/calculation.d.ts" />
import * as Util from '../util/util';
import { determineDependency } from './dependency';

// NOTE: Generates the final report
export function generateReport(calculationData: CalculationData): Report {
  console.log(calculationData);
  let report: Report = {
    dependency: "",
    EFC: 0,
    Pell: 0,
    TAG: 0,
    Merit: 0,
    Needs: 0,
    POA: {
      totaladmissioncost: 0,
      tuitionfees: 0,
      bookssupplies: 0,
      roomboard: 0,
      otherexpenses: 0
    }
  };

  // NOTE: determine user's dependency status. Response will be one of either
  //      - efcDependent
  //      - efcindependentwithdependents
  //      - efcindependentnodependents
  let _dependency: string = determineDependency(
    parseInt(calculationData['form-student-age']),
    (parseInt(calculationData['form-children']) > 0)? false : true,
    (calculationData['marital-status'] === "Yes")? true : false
  );

  return report;
}


