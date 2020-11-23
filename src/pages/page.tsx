///<reference path="../typings/component.d.ts" />

import React from 'react';
import Form from 'react-bootstrap/Form';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Button from 'react-bootstrap/Button';
import Container from 'react-bootstrap/Container';
import NumericQuestion from './question-types/numericquestion';
import RadioQuestion from './question-types/radioquestion';

export const Page: React.FC<Page.PageProps> = (props) => {
  //console.log(props.pageQuestions);
  
  let pqInputs: JSX.Element[] = [];

  for(let q=0; q<props.pageQuestions.length; q++) {
    switch(props.pageQuestions[q].controlType) {
      case 'number': 

      //console.log(`Value: ${props.stateInputValues[`${props.pageQuestions[q].stateStorageID}`]}`);

      pqInputs.push(
        <NumericQuestion 
          questionData={props.pageQuestions[q]} 
          currentValue={props.stateInputValues[`${props.pageQuestions[q].stateStorageID}`]}
          changeHandler={props.inputChangeHandler}
          key={`pageQuestion-${q}`}
        />);
        break;

      case 'radio': 
        pqInputs.push(
          <RadioQuestion 
            questionData={props.pageQuestions[q]} 
            currentValue={props.stateInputValues[`${props.pageQuestions[q].stateStorageID}`]}
            changeHandler={props.inputChangeHandler}
            key={`pageQuestion-${q}`}
          />);
          break;

      default: pqInputs.push(<p key={`pageQuestion-${q}`}>Input Here</p>);
    }
  }

  return (
    <Form>
      <Container>
        <Row>
          {pqInputs}
        </Row>
      </Container>
      <hr />
      <Row>
        <Col md={{span: 2, offset: 4}}>
          <Button variant="outline-success"
            onClick={(e:React.MouseEvent<HTMLButtonElement>) => {props.submitPageHandler(e)}}
          >
            Continue »
          </Button>
        </Col>
      </Row>
    </Form>
  );
}

export default Page;