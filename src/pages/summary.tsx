///<reference path="../typings/component.d.ts" />
import * as Util from '../util/util';
import React, { useState, useEffect, useRef } from 'react';
import calculateEFC from '../calculation/calculate-efc';
import calculateNeeds from '../calculation/calculate-needs';
import determineDependency from '../calculation/dependency';
import calculateMerit from '../calculation/calculate-merit';
import calculateTAG from '../calculation/calculate-tag';
import calculatePell from '../calculation/calculate-pell';
import calculatePOA from '../calculation/calculate-poa';
import { Container, Row, Col, Button } from 'react-bootstrap';
import '../App.scss';
import * as queryString from 'query-string';
import { prop } from '../util/util';

export default function Summary(props: SummaryProps) {
  const [report, setReport] = useState<Report>({
    efcValue: 0,
    needs: 0,
    merit: 0,
    tag: 0,
    pell: 0,
    poa: [0,0,0]
  });
  
  // NOTE:  reference to persist this value between renders. We use this to signal when we have fully retrieved and calculated the individual values so useEffect doesn't trigger an infinite loop from state updates. React will refresh a component when state is updated so that would also include these values if they were conventional variables, resulting in an endless loop of fetches. useRef perpetuates the state of these variables through refresh so we don't lose their values. 
  const efcMeritRetrieved = useRef<boolean>(false);
  const efcDependentValuesRetrieved = useRef<boolean>(false);

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

  const meritMode = () => {
    // NOTE: If the "Use Test Scores" option was unchecked, then consider any test scores entered as meaningless or user error. Unchecked => use the GPA "test optional" method
    if(props.calculationData['form-use-test-scores'] === "false") {
      return "merittestoptional";
    }
    // NOTE: If the "Use Test Scores" option was checked, then use the table with test scores to calculate
    return "meritwithtest";    
  };

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
        props.calculationData['form-current-residence'],
        freshmanOrTransfer
      )
    }/`
  );

  const meritURL: string = (
    `/rest/data/costcalculator/get/${
      Util.determineMeritTable(freshmanOrTransfer, meritMode())
    }/`
  );
  
  // NOTE:  Pell and TAG are constant and don't have variations. TAG is only available to NJ residents.
  const pellURL: string = '/rest/data/costcalculator/get/pell';

  const tagURL: string = '/rest/data/costcalculator/get/tag/';

  const poaURL: string = '/rest/data/costcalculator/get/tuitionandfees';
  
  // NOTE:  obtain EFC value, which many other things depend on.
  useEffect(() => {
    if(!efcMeritRetrieved.current) {
      //console.log(efcURL);
      Promise.all([
        fetchData(efcURL)
        .then(json => {
          let efc: number = calculateEFC(
            json.data,
            Util.resolveNumberInCollege(props.calculationData['form-people-in-college']),
            Util.resolveNumberInFamily(props.calculationData['form-people-in-household']),
            Util.resolveIncomeRange(props.calculationData['form-household-income'])
          ) || 0;
          return efc;
        }),

        fetchData(meritURL)
        .then(json => {
          let merit: number = calculateMerit(
            freshmanOrTransfer,
            json.data, 
            Number(props.calculationData['form-current-gpa']),  
            Number(props.calculationData['form-test-score']), 
            props.calculationData['form-which-test'],
            (props.calculationData['form-use-test-scores'] === "true")? true : false
          ) || 0;
          return merit;
        })
      ])
      .then(([efc, merit]) => {
        efcMeritRetrieved.current = true;
        setReport({
          ...report,
          efcValue: efc,
          merit: merit
        });
      });
    }
  },[efcURL, meritURL, report, freshmanOrTransfer, props]);

  // NOTE: once we have the EFC value, retrieve other values dependent on it
  if(efcMeritRetrieved.current && !efcDependentValuesRetrieved.current) {
    Promise.all([
      fetchData(needsURL)
      .then(json => {
        let needs: number = calculateNeeds(
          json.data, 
          report.efcValue, 
          Number(props.calculationData['form-current-gpa']), 
          freshmanOrTransfer
        ) || 0;
        
        return needs;
      }),

      fetchData(poaURL)
      .then(json => {
        let poa: number[] = calculatePOA(
          json.data,
          props.calculationData['form-planned-residence']
        ) || [0,0,0];

        return poa;
      }),

      fetchData(tagURL)
      .then(json => {
        let tag: number = calculateTAG(
          props.calculationData['form-current-residence'], 
          json.data, 
          report.efcValue
        ) || 0;

        return tag;
      }),

      fetchData(pellURL)
      .then(json => {
        let pell: number = calculatePell(
          json.data, 
          report.efcValue
        ) || 0;
        return pell;
      })
    ])
    .then(([needs, poa, tag, pell]) => {
      efcDependentValuesRetrieved.current = true;
      setReport({
        ...report,
        needs: needs,
        tag: tag,
        pell: pell,
        poa: poa
      });
    });
  }
  
  let qs:queryString.ParsedQuery = queryString.parse(window.location.search);

  const dumpData = () => {
    console.log(`========User Input Data========`);
    console.table(props.calculationData);
    console.log(`========Calculated Data========`);
    console.table(report);
  }

  // NOTE: Component Output
  return (
    <>
    {
      (qs.debug)? 
      dumpData() 
      : null
    }
    <Container className="ncc-container">
      <Row className="ncc-row ncc-page">
        <Col md={12}>
          <h1>Summary</h1>
          <p>
            Based on the information you have provided, the following calculations represent the average net price of attendance that students in similar situations have paid recently.<br />
            <small>Academic Year: 2019-2020</small>
          </p>
          <hr />
          <table summary="Estimated costs" className="ncc-table">
            <tbody>
              <tr>
                <th scope="row">Estimated Total Direct Cost: </th>
                <td className="ncc-major-costs">${report.poa[0].toLocaleString("en-US")}</td>
              </tr>
              <tr>
                <th scope="row">Estimated Tuition and Fees: </th> 
                <td className="ncc-major-costs">${report.poa[1].toLocaleString("en-US")}</td>
              </tr>
              <tr>
                <th scope="row">Estimated Room and Board: </th>
                <td className="ncc-major-costs">${report.poa[2].toLocaleString("en-US")}</td>
              </tr>
            </tbody>
          </table>
          <table summary="Estimated Grant" className="ncc-table">
            <tbody>
              <tr>
                <th scope="row">
                  Estimated Total Grant Amount <br /> 
                  <em>Includes both merit and needs-based aid <br />
                  from all sources - federal, state and institutional</em>: 
                </th>
                <td className="ncc-major-costs">${(report.tag + report.pell + report.needs + report.merit).toLocaleString("en-US")}</td>
              </tr>
              <tr>
                <th scope="row">
                  Estimated Net Price to Attend<br />
                  <em>Direct Cost minus Grant Aid</em>: 
                </th>
                <td className="ncc-major-costs final-total">${(report.poa[0] - (report.tag + report.pell + report.needs + report.merit)).toLocaleString("en-US")}</td>
              </tr>
            </tbody>
          </table>
        </Col>
      </Row>
      <hr />
      <Row className="ncc-row ncc-page">
        <Col md={12}>
          <p className="ncc-summary-p">
            <em>In addition to direct costs, you should plan to cover any additional indirect costs. Here are some approximate costs you should be aware of:</em>
          </p>
          <ul className="list-unstyled ncc-summary-p">
            <li><strong>Books and Supplies: $1000</strong></li>
            <li><strong>Other Expenses: $2200</strong></li>
            <li><strong>Room and Board (off-campus): $6000</strong></li>
          </ul>
          <p className="ncc-summary-p">
          Please Note: The estimates above apply to full-time, first-time degree/certificate-seeking undergraduate students only. This estimate is based on an expected family contribution (EFC) of <strong><span className="typography-underline">${report.efcValue}</span></strong>. Your actual EFC will be determined each year by filing the FAFSA.<br />
          These estimates do not represent a final determination, or actual award, of financial assistance or a final net price; they are only estimates based on price of attendance and financial aid provided to students in 2019-2020. Price of attendance and financial aid availability change year to year. These estimates shall not be binding on the Secretary of Education, the institution of higher education, or the State.<br />
          Not all students receive financial aid. In 2019-2020, 92% of our full-time students enrolling for college for the first time received grant/scholarship aid. Students may also be eligible for student loans and work-study. Students must complete the Free Application for Federal Student Aid (FAFSA) in order to determine their eligibility for Federal financial aid that includes Federal grant, loan, or work-study assistance. For more information on applying for Federal student aid, go to studentaid.gov.
          </p>
        </Col>
      </Row>
      <Row>
        <Col>
          <Button onClick={props.resetHandler}>Start Over</Button>
        </Col>
      </Row>
    </Container>
    </>
  ); 
}
