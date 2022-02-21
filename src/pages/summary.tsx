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
import calculateNeeds from '../calculation/calculate-needs';
import determineDependency from '../calculation/dependency';

export default function Summary(props: SummaryProps) {
  const [efcValue, setEFCValue] = useState<number>();
  const [needsTable, setNeedsTable] = useState<number[][]>();
  const [meritTable, setMeritTable] = useState<number[][]>();

  const freshmanOrTransfer: string = (props.calculationData['form-highschool-transfer'] === "High School")? "freshman":"transfer";

  const meritMode: string = (Number(props.calculationData['form-act']) === 0 && Number(props.calculationData['form-erw-sat']) === 0 && Number(props.calculationData['form-math-sat']) === 0)? "meritwithtest": "merittestoptional";

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
        fetchData(`/rest/data/costcalculator/get/${
        Util.resolveNeedsMode(
          (props.calculationData['form-current-residence'] === "New Jersey")? true: false,
          (props.calculationData['form-highschool-transfer'] === "High School")? true : false)
        }/`)
        .then(json => {
          return json.data;
        }),
        fetchData(`/rest/data/costcalculator/get/${freshmanOrTransfer}${meritMode}`)
        .then(json => {
          return json.data;
        })
      ])
      .then(([needs, merit]) => {
        setNeedsTable(needs);
        setMeritTable(merit);
      });
    });  
  },[props.calculationData, freshmanOrTransfer, meritMode]);

  return (
    <p>Loading...</p>
  );
}
