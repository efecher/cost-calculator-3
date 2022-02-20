///<reference path="../typings/component.d.ts" />

import React, {useState, useEffect} from 'react';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Table from 'react-bootstrap/Table';
import Container from 'react-bootstrap/Container';
import Button from 'react-bootstrap/Button';
import Alert from 'react-bootstrap/Alert';
import { needsMode } from '../util/util';
import calculateEFC from '../calculation/calculate-efc';

export default function Summary(props: SummaryProps) {
  const [efcValue, setEFCValue] = useState<number>();
  const [needsValue, setNeedsValue] = useState<number>();

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
    Promise.all(
    [
      fetchData(`/rest/data/costcalculator/get/efcdependent/`) 
      .then(json => {
        let answer = calculateEFC(json.data);
        console.log(answer);
        return answer;
      }),
      fetchData(`/rest/data/costcalculator/get/${
        needsMode(
          (props.calculationData['form-current-residence'] === "New Jersey")? true: false,
          (props.calculationData['form-highschool-transfer'] === "High School")? true : false)
        }/`)
      .then(json => {
        console.log(json.data);
        return json.data[0][2];
      })
    ]).then(([efcValue, needsValue]) => {
      setEFCValue(efcValue);
      setNeedsValue(needsValue);
    });
  
  },[]);

  return (
    <p>Loading...</p>
  );
}
