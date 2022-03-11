///<reference path="../typings/component.d.ts" />

import React, {useState, useEffect} from 'react';
// import Row from 'react-bootstrap/Row';
// import Col from 'react-bootstrap/Col';
// import Table from 'react-bootstrap/Table';
// import Container from 'react-bootstrap/Container';
// import Button from 'react-bootstrap/Button';
// import Alert from 'react-bootstrap/Alert';
import * as Util from '../util/util';

import calculateEFC from '../calculation/calculate-efc';
import determineDependency from '../calculation/dependency';
import calculateTAG from '../calculation/calculate-tag';
import calculatePell from '../calculation/calculate-pell';
import calculateNeeds from '../calculation/calculate-needs';
import calculateMerit from '../calculation/calculate-merit';

export default function Summary(props: SummaryProps) {
  const [efcValue, setEFCValue] = useState<number>(0);

  // NOTE:  state hooks to hold the tables retrieved 
  const [needsValue, setNeedsValue] = useState<number>(0);
  const [meritValue, setMeritValue] = useState<number>(0);
  const [tag, setTag] = useState<number[][]>([[]]);
  const [pellValue, setPellValue] = useState<number>();
  //////////////////////////////////////////////////
  const [calculatedData, setCalculatedData] = useState<object>({});

  console.log(props.calculationData);
  // NOTE:  Translate a couple things into usable values in the calculation
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
    Promise.all([
      // NOTE:  EFC
      fetchData(`/rest/data/costcalculator/get/${
        determineDependency(
          Number(props.calculationData['form-age']),
          (props.calculationData['form-children'] !== "No")? true:false,
          (props.calculationData['form-marital-status'] !== "No")? true:false)
        }/`) 
      .then(json => {
        return calculateEFC(
          json.data,
          Util.resolveNumberInCollege(props.calculationData['form-people-in-college']),
          Util.resolveNumberInFamily(props.calculationData['form-people-in-household']),
          Util.resolveIncomeRange(props.calculationData['form-household-income'])
        );
      }),
      // NOTE:  Needs Value
      fetchData(`/rest/data/costcalculator/get/${
      Util.resolveNeedsMode(
        (props.calculationData['form-current-residence'] === "New Jersey")? true: false,
        (props.calculationData['form-highschool-transfer'] === "High School")? true : false)
      }/`)
      .then(json => {
        return calculateNeeds(
          json.data, 
          efcValue, 
          Number(props.calculationData['form-current-gpa']), 
          freshmanOrTransfer
        );
      }),
      // NOTE:  Merit Value - depends on if we need to use test scores or not
      fetchData(`/rest/data/costcalculator/get/${Util.determineMeritTable(freshmanOrTransfer, meritMode)}/`)
      .then(json => {
        return calculateMerit(
          json.data,
          Number(props.calculationData['form-current-gpa']),
          freshmanOrTransfer,
          (props.calculationData['form-erw-sat'] === "0" || props.calculationData['form-math-sat'] === "0")? 0 : Number(props.calculationData['form-erw-sat']) + Number(props.calculationData['form-math-sat']),
          (props.calculationData['form-act'] === "0")? 0 : Number(props.calculationData['form-act'])
        );
      }),
      fetchData(`/rest/data/costcalculator/get/pell/`)
      .then(json => {
        return calculatePell(
          json.data,
          efcValue
        );
      })
    ])
    .then(([efcValue, needs, merit, pell]) => {
      setEFCValue(efcValue);
      setNeedsValue(needs);
      setMeritValue(merit);
      setPellValue(pell);
    })
    .then(() => {
      if(props.calculationData['form-current-residence'] === "New Jersey") {
        fetchData(`/rest/data/costcalculator/get/tag/`)
        .then(json => setTag(json.data));
      } else {
        setTag([[]]); // NOTE: empty if transfer student, only for NJ. Set someting other than undefined so there will be "data" for it to clear below in the JSX return
      }
    })
  },[efcValue, props.calculationData, freshmanOrTransfer, meritMode]);

  

  return (
    <>
      {console.log(calculatedData)} 
    </>
  );
}
