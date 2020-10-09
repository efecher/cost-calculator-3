///<reference path="../typings/component.d.ts" />

import React from 'react';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Table from 'react-bootstrap/Table';
import Container from 'react-bootstrap/Container';
import { generateReport } from '../calculation/calculation';

export const Summary: React.FC<SummaryProps> = (props) => {
  let results: Report = generateReport(props.calculationData);

  return (
    <Container>
      <Row>
        <Col md={12}>
          <h1>Summary</h1>
          <Table bordered>
          <tbody> 
            <tr>
              <th>Dependency</th><td>{results.dependency}</td>
            </tr>
            <tr>
              <th>Expected Family Contribution</th><td>{`$${results.EFC}`}</td>
            </tr>
            <tr>
              <th>Pell Grant</th><td>{`$${results.Pell}`}</td>
            </tr>
            <tr>
              <th>Tuition Assistance</th><td>{`$${results.TAG}`}</td>
            </tr>
            <tr>
              <th>Merit Award</th><td>{`$${results.Merit}`}</td>
            </tr>
            <tr>
              <th>Needs-Based Grant</th><td>{`$${results.Needs}`}</td>
            </tr>
            </tbody>
            <tfoot>
              <tr>
                <th>Total Estimated Aid</th>
                <td>
                  <strong>
                    <svg width="1em" height="1em" viewBox="0 0 16 16" className="bi bi-forward-fill" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
                    <path d="M9.77 12.11l4.012-2.953a.647.647 0 0 0 0-1.114L9.771 5.09a.644.644 0 0 0-.971.557V6.65H2v3.9h6.8v1.003c0 .505.545.808.97.557z"/>
                    </svg>
                    {` $${results.TAG + results.Pell + results.Merit + results.Needs}`}
                  </strong>
                </td>
              </tr>
            </tfoot>
          </Table>
          <p>
            Based on the information you have provided, the following calculations represent the average net price of attendance that students similar to you paid in the given year:&nbsp; 
            <strong>Academic Year: 2020-2021</strong><br />
          </p>
          <Table bordered>
            <tbody> 
              <tr>
                <th>Estimated Total Direct Cost</th><td>{`$${results.POA.totalCost}`}</td>
              </tr>
              <tr>
                <th>Estimated Tuition and Fees</th><td>{`$${results.POA.tuitionAndFees}`}</td>
              </tr>
              <tr>
                <th>Estimated Room and Board</th><td>{`$${results.POA.roomAndBoard}`}</td>
              </tr>
              <tr>
                <th>Estimated Total Grant Amount</th><td>{` $${results.TAG + results.Pell + results.Merit + results.Needs}`}</td>
              </tr>
              <tr>
                <th>Estimated Net Price<br />(direct cost minus aid)
                </th>
                <td>
                  <svg width="1em" height="1em" viewBox="0 0 16 16" className="bi bi-forward-fill" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
                  <path d="M9.77 12.11l4.012-2.953a.647.647 0 0 0 0-1.114L9.771 5.09a.644.644 0 0 0-.971.557V6.65H2v3.9h6.8v1.003c0 .505.545.808.97.557z"/>
                  </svg>
                  <strong>
                    {` $${results.POA.totalCost - (results.TAG + results.Pell + results.Merit + results.Needs)}`}
                  </strong>
                </td>
              </tr>
            </tbody>
          </Table>
          <p>
            Please Note: The estimates above apply to full-time, first-time degree/certificate-seeking undergraduate students only. This estimate is based on an expected family contribution (EFC) of <strong>${results.EFC}</strong>. Your actual EFC will be determined each year by filing the FAFSA.<br />
            These estimates do not represent a final determination, or actual award, of financial assistance or a final net price; they are only estimates based on price of attendance and financial aid provided to students in 2019-2020. Price of attendance and financial aid availability change year to year. These estimates shall not be binding on the Secretary of Education, the institution of higher education, or the State. <br />
            Not all students receive financial aid. In 2019-2020, 92% of our full-time students enrolling for college for the first time received grant/scholarship aid. Students may also be eligible for student loans and work-study. Students must complete the Free Application for Federal Student Aid (FAFSA) in order to determine their eligibility for Federal financial aid that includes Federal grant, loan, or work-study assistance. For more information on applying for Federal student aid, go to <a aria-label="FAFSA" href="http://www.fafsa.ed.gov/">http://www.fafsa.ed.gov/</a>
          </p>
          {console.log(results.POA)}
        </Col> 
      </Row>
    </Container>
  );
}

export default Summary;