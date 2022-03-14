///<reference path="../typings/component.d.ts" />
import determineDependency from './dependency';
import * as Util from '../util/util';
import calculateEFC from '../calculation/calculate-efc';
import calculateNeeds from './calculate-needs';
// NOTE:  based on user inputs, determine the data we need to perform 
//        the calculations.

export default async function gatherData(userInput: CalculationData): Promise<{}> {
  // NOTE:  set up a few values we may need later
  // NOTE:  based on input, resolve whether user is Freshman or Transfer 
  //        (this is used for the REST URL we call for data)
  const freshmanOrTransfer: string = 
    (userInput['form-highschool-transfer'] === "High School")
    ? "freshman"
    : "transfer";

  // NOTE:  Resolve whether we are using the "with test" or "test   
  //        optional" method for merit award calculation (looking to 
  //        replace this with a conditional question during user input 
  //        on whether we are using test scores to avoid extra 
  //        coversions here)
  const meritMode: string = (
    Number(userInput['form-act']) === 0 && 
    Number(userInput['form-erw-sat']) === 0 && 
    Number(userInput['form-math-sat']) === 0
    )
    ? "meritwithtest"
    : "merittestoptional";

  const efcURL: string = (
    // NOTE:  since HTML inputs are string, will need to convert numeric 
    //        data to numbers to use in numeric calculations, likewise 
    //        with booleans
    `/rest/data/costcalculator/get/${
    determineDependency(
      Number(userInput['form-age']),
      (userInput['form-children'] !== "No")? true : false,
      (userInput['form-marital-status'] !== "No")? true:false)
    }/`
  );

  const needsURL: string = (
    `/rest/data/costcalculator/get/${
      Util.resolveNeedsMode(
        freshmanOrTransfer,
        (userInput['form-highschool-transfer'] === "High School")? "freshman" : "transfer"
      )
    }/`
  );

  const meritURL: string = (
    `/rest/data/costcalculator/get/${
      Util.determineMeritTable(freshmanOrTransfer, meritMode)
    }/`
  );

  const pellURL: string = '/rest/data/costcalculator/get/pell';

  const tagURL: string = '/rest/data/costcalculator/get/tag/';

  // NOTE:  obtain EFC value, which many other things depend on.
  const efcValue: number = await fetchData(efcURL)
    .then(json => {
      return calculateEFC(
        json.data,
        Util.resolveNumberInFamily(userInput['form-people-in-college']),
        Util.resolveNumberInFamily(userInput['form-people-in-household']),
        Util.resolveIncomeRange(userInput['form-household-income'])
      );
    });
  
  

  return {
    
  };
}

// NOTE: Universal function to fetch data as we need it
const fetchData = async (url: string) => {
  try {
    const response = await fetch(url);
    if(response.ok) {
      return response.json();
    } else {
      throw new Error("Error retrieving the data");
    }
  } catch (error) {
    throw new Error("Data not found.");
  }
};