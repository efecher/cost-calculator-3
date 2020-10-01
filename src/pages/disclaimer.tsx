///<reference path="../typings/component.d.ts" />

import React from 'react';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Button from 'react-bootstrap/Button';
import Container from 'react-bootstrap/Container';

export const Disclaimer: React.FC<DisclaimerProps> = (props) => {
  return (
    <Container>
      <Row>
        <Col md={12}>
          <p>
          <strong>Please read.</strong><br />
          By clicking below, I acknowledge that the estimate provided using this calculator does not represent a final determination, or actual award, of financial assistance, or a final net price; it is an estimate based on price of attendance and financial aid provided to students in a previous year. Price of attendance and financial aid availability change year to year. The estimates shall not be binding on the Secretary of Education, the institution of higher education, or the State. Students must complete the Free Application for Federal Student Aid (FAFSA) in order to be eligible for, and receive, an actual financial aid award that includes Federal grant, loan, or work-study assistance. For more information on applying for Federal student aid, go to <a href="http://www.fafsa.ed.gov/" aria-label="FAFSA website">http://www.fafsa.ed.gov/</a>.
          </p>
          <Button onClick={(e) => {props.acceptHandler(e)}}>Accept</Button>
        </Col>
      </Row>
    </Container>
  );
}

export default Disclaimer;