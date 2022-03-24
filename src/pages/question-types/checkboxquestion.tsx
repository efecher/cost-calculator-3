import React from 'react';
import Form from 'react-bootstrap/Form';
import { Col }  from 'react-bootstrap'; 

// NOTE: Component that renders a question with radio buttons, a single-answer response from a list of choices

export const CheckboxQuestion: React.FC<QuestionComponentProps>  = (props) => {
  let qd: PageQuestion = props.questionData;
  //console.log(props.currentValue);
  return (
    <Col md={4}>
      <Form.Group controlId={qd.controlId}>
        <Form.Label>{qd.label}</Form.Label>
          <Form.Check
            type="checkbox"
            label={qd.label}
            id={qd.label}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) => {console.log(e); props.changeHandler(e, qd.stateStorageID, true)}} 
            value={props.currentValue}
            checked={(props.currentValue === "true")? true : false}
          />
        <Form.Text>{qd.text}</Form.Text>
      </Form.Group>
    </Col>
  );
}

export default CheckboxQuestion;