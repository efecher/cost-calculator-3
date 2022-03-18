///<reference path="../typings/component.d.ts" />
import * as Util from '../util/util';
import React, { useState, useEffect, useRef } from 'react';
import calculateEFC from '../calculation/calculate-efc';
import calculateNeeds from '../calculation/calculate-needs';
import determineDependency from '../calculation/dependency';
import calculateMerit from '../calculation/calculate-merit';
import calculateTAG from '../calculation/calculate-tag';

export default function Summary(props: SummaryProps) {
  const [report, setReport] = useState<Report>({
    efcValue: 0,
    needs: null,
    merit: null,
    tag: null,
    pell: null
  });
  
  // NOTE:  reference to persist this value between renders. We use this to signal when we have fully retrieved and calculated the individual values so useEffect doesn't trigger an infinite loop from state updates.
  const efcRetrieved = useRef<boolean>(false);
  const needsRetrieved = useRef<boolean>(false);
  //const tagRetrieved = useRef<boolean>(false);

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
    if(!efcRetrieved.current) {
      fetchData(efcURL)
      .then(json => {
        let efc: number = calculateEFC(
          json.data,
          Util.resolveNumberInFamily(props.calculationData['form-people-in-college']),
          Util.resolveNumberInFamily(props.calculationData['form-people-in-household']),
          Util.resolveIncomeRange(props.calculationData['form-household-income'])
        ) || 0;
        efcRetrieved.current = true;
        setReport({
          ...report,
          efcValue: efc
        }); 
      });
    }
  }, []); 

  // NOTE: once we have the EFC value, retrieve other values dependent on it
 
  if(efcRetrieved.current && !needsRetrieved.current) {
    fetchData(needsURL)
    .then(json => {
      let needs: number = calculateNeeds(json.data, report.efcValue, Number(props.calculationData['form-current-gpa']), freshmanOrTransfer) || 0;
      needsRetrieved.current = true;
      setReport({
        ...report,
        needs: needs
      });
    })
  }
  
  
      
  
  

  return <p>Results.</p>
  
}
