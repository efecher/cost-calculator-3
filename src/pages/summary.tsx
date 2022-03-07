///<reference path="../typings/component.d.ts" />

import React, {useState, useEffect} from 'react';
// import Row from 'react-bootstrap/Row';
// import Col from 'react-bootstrap/Col';
// import Table from 'react-bootstrap/Table';
// import Container from 'react-bootstrap/Container';
// import Button from 'react-bootstrap/Button';
// import Alert from 'react-bootstrap/Alert';
import * as Util from '../util/util';
import calculationReport from '../calculation/calculation-report';
import calculateEFC from '../calculation/calculate-efc';
import determineDependency from '../calculation/dependency';
import calculateTAG from '../calculation/calculate-tag';
import calculatePell from '../calculation/calculate-pell';

export default function Summary(props: SummaryProps) {
  const [efcValue, setEFCValue] = useState<number>(0);

  // NOTE:  state hooks to hold the tables retrieved 
  const [needsTable, setNeedsTable] = useState<number[][]>([[]]);
  const [meritTable, setMeritTable] = useState<number[][]>([[]]);
  const [tag, setTag] = useState<number[][]>([[]]);
  const [pell, setPell] = useState<number[][]>([[]]);
  //////////////////////////////////////////////////

  // NOTE:  Translate a couple things into useable values in the calculation
  const freshmanOrTransfer: string = (
    props.calculationData['form-highschool-transfer'] === "High School"
    )? "freshman":"transfer";

  const meritMode: string = (
    Number(props.calculationData['form-act']) === 0 && 
    Number(props.calculationData['form-erw-sat']) === 0 && 
    Number(props.calculationData['form-math-sat']) === 0
    )? "meritwithtest": "merittestoptional";

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

  useEffect(() => {
    // NOTE:  figure out dependency so we fetch the correct 
    //        matrix (there are 3: efcDependend, 
    //        efcindependentwithdependents and 
    //        efcindependentnodependents)
    //        Age < 24 = dependent, married/has children = Independent WITH Dependents
    //        else Indepnedent with NO Dependents
    fetchData(`/rest/data/costcalculator/get/${
      determineDependency(
        Number(props.calculationData['form-age']),
        (props.calculationData['form-children'] !== "No")? true:false,
        (props.calculationData['form-marital-status'] !== "No")? true:false)
      }/`) 
    .then(json => {
      setEFCValue(calculateEFC(
        json.data,
        Util.resolveNumberInCollege(props.calculationData['form-people-in-college']),
        Util.resolveNumberInFamily(props.calculationData['form-people-in-household']),
        Util.resolveIncomeRange(props.calculationData['form-household-income'])
      ));
    })
    .then(() => {
      Promise.all([
        // NOTE:  Needs data table
        fetchData(`/rest/data/costcalculator/get/${
        Util.resolveNeedsMode(
          (props.calculationData['form-current-residence'] === "New Jersey")? true: false,
          (props.calculationData['form-highschool-transfer'] === "High School")? true : false)
        }/`)
        .then(json => {
          return json.data;
        }),
        // NOTE:  Merit table - depends on if we need to use test scores or not
        fetchData(`/rest/data/costcalculator/get/${Util.determineMeritTable(freshmanOrTransfer, meritMode)}/`)
        .then(json => {
          return json.data;
        }),
        fetchData(`/rest/data/costcalculator/get/pell/`)
        .then(json => {
          return json;
        })
      ])
      .then(([needs, merit, pell]) => {
        setNeedsTable(needs);
        setMeritTable(merit);
        setPell(pell.data);
      })
      .then(() => {
        if(props.calculationData['form-current-residence'] === "New Jersey") {
          fetchData(`/rest/data/costcalculator/get/tag/`)
          .then(json => setTag(json.data));
        } else {
          setTag([[]]); // NOTE: empty if transfer student, only for NJ. Set someting other than undefined so there will be "data" for it to clear below in the JSX return
        }
      })
    });  
  },[props.calculationData, freshmanOrTransfer, meritMode]);

  const finalCalculationPackage = (): object => {
    const cdata: object = {
      userInput: props.calculationData, // NOTE:  all of the user inputs
      efc: efcValue, // NOTE: the EFC value we calculated here
      meritMode: meritMode,
      // NOTE:  given the userInput, the correct values will be pulled from 
      //        these tables in the final tally
      meritTable: meritTable, 
      needsTable: needsTable,
      pell: calculatePell(efcValue, pell),
      tag: calculateTAG(props.calculationData['form-current-residence'], tag, efcValue)
    }


    return cdata;
  }

  return (
    <>
    {console.log(finalCalculationPackage())}
    </>
  );
}
