import React from 'react';
import Form from 'react-bootstrap/Form';
import { Col }  from 'react-bootstrap'; 

// NOTE: Component that renders a question with radio buttons, a single-answer response from a list of choices

export const RadioQuestion: React.FC<QuestionComponentProps>  = (props) => {
  let qd: PageQuestion = props.questionData;
  return (
    <Col md={4}>
      <Form.Group controlId={qd.controlId}>
        <Form.Label>{qd.label}</Form.Label>
        { 
          qd.options.map((option, index) => {
            return <Form.Check 
              key={`input-${qd.controlId}-${index}`} 
              type="radio" id={option} 
              name={qd.controlId} 
              value={option} 
              label={option} 
              onChange={(e: React.ChangeEvent<HTMLInputElement>) => {props.changeHandler(e, qd.stateStorageID)}} 
              checked={props.currentValue === option} 
            />
          })
        }
        <Form.Text>{qd.text}</Form.Text>
      </Form.Group>
    </Col>
  );
}

export default RadioQuestion;