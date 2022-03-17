///<reference path="../typings/component.d.ts" />
import * as Util from '../util/util';
import React, { useState, useEffect } from 'react';
import calculateEFC from '../calculation/calculate-efc';
import calculateNeeds from '../calculation/calculate-needs';
import determineDependency from '../calculation/dependency';

export default function Summary(props: SummaryProps) {
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

  // NOTE:  based on input, resolve whether user is Freshman or Transfer 
  //        (this is used for the REST URL we call for data)
  const freshmanOrTransfer: string = 
    (props.calculationData['form-highschool-transfer'] === "High School")
    ? "freshman"
    : "transfer";

  const meritMode: string = (
    // NOTE:  if both ACT and SAT are 0, we aren't using test scores, use the GPA "test-optional" method instead
    (
      Number(props.calculationData['form-act']) === 0
        && 
      Number(props.calculationData['form-sat']) === 0
    )
    ? "meritwithtest"
    : "merittestoptional"
  );

  const efcURL: string = (
    // NOTE:  since HTML inputs are string, will need to convert numeric 
    //        data to numbers to use in numeric calculations, likewise 
    //        with booleans
    `/rest/data/costcalculator/get/${
    determineDependency(
      Number(props.calculationData['form-age']),
      (props.calculationData['form-children'] !== "No")? true : false,
      (props.calculationData['form-marital-status'] !== "No")? true:false)
    }/`
  );

  const needsURL: string = (
    `/rest/data/costcalculator/get/${
      Util.resolveNeedsMode(
        freshmanOrTransfer,
        (props.calculationData['form-highschool-transfer'] === "High School")? "freshman" : "transfer"
      )
    }/`
  );

  const meritURL: string = (
    `/rest/data/costcalculator/get/${
      Util.determineMeritTable(freshmanOrTransfer, meritMode)
    }/`
  );
  
  // NOTE:  Pell and TAG are constant and don't have variations. TAG is only available to NJ residents.
  const pellURL: string = '/rest/data/costcalculator/get/pell';

  const tagURL: string = '/rest/data/costcalculator/get/tag/';
  
  // NOTE:  obtain EFC value, which many other things depend on.
  useEffect(() => {
    fetchData(efcURL)
    .then(json => {
      let efc: number = calculateEFC(
        json.data,
        Util.resolveNumberInFamily(props.calculationData['form-people-in-college']),
        Util.resolveNumberInFamily(props.calculationData['form-people-in-household']),
        Util.resolveIncomeRange(props.calculationData['form-household-income'])
      ) || 0;
      return efc;
    })
    .then(efc => {
      // NOTE:  Do our Needs data retrieval and calculation
      fetchData(needsURL)
      .then(json => {
        return calculateNeeds(
          json.data,
          efc,
          Number(props.calculationData['form-gpa']),
          freshmanOrTransfer
        )
      })
      .then(response => {console.log(`Needs: ${response}`)})
    });
  }, []);
  
  
  
  
  return <p>Results.</p>
  
}
