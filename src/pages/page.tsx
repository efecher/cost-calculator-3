///<reference path="../typings/component.d.ts" />

// NOTE: Component for rendering a page of questions. The questions are rendered by nested components under ./question-types/, the data for the questions themselves comes from /src/questions/question-bank.json and any logic as far as "either/or", for instance both SAT scores OR ACT (but not both) or none at all comes from /src/questions/question-logic.json per-question. The data is loaded in state in the root APP component. 

import React from 'react';
import Form from 'react-bootstrap/Form';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Button from 'react-bootstrap/Button';
import Container from 'react-bootstrap/Container';
import NumericQuestion from './question-types/numericquestion';
import RadioQuestion from './question-types/radioquestion';
import CheckboxQuestion from './question-types/checkboxquestion';

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

      case 'checkbox':
        pqInputs.push(
          <CheckboxQuestion
            questionData={props.pageQuestions[q]} 
            currentValue={props.stateInputValues[`${props.pageQuestions[q].stateStorageID}`]}
            changeHandler={props.inputChangeHandler}
            key={`pageQuestion-${q}`}
          />);
          break;

          // NOTE: in case other types of questions (checkbox, plain text, slider/range) add another case here

      default: pqInputs.push(<p key={`pageQuestion-${q}`}>Input Here</p>);
    }
  }

  return (
    <Form>
      <Container className="ncc-page">
        <Row className="ncc-row">
          {pqInputs}
        </Row>
      </Container>
      <Row className="ncc-page-button">
        <Col md={{span: 2, offset: 11}}>
          <Button className="btn btn-ghost"
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