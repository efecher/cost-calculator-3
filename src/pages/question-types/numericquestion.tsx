import React from 'react';
import Form from 'react-bootstrap/Form';
import { Row, Col }  from 'react-bootstrap'; 

// NOTE: Component that renders a question with a Numeric answer. This will render as a text input with the only values allowed being numeric within the range defined by the min and max values, and the "step" parameter indicating how much each click of the up/don buttons rendered in most browsers will increment or decrement by. 

export const NumericQuestion: React.FC<QuestionComponentProps>  = (props) => {
  let qd: PageQuestion = props.questionData;
  //console.log(props.currentValue);
  return (
    <Col md={4}>
      <Form.Group as={Row} controlId={qd.controlId}>
        <Col md={6}>
          <Form.Label>{qd.label}</Form.Label> 
          <Form.Control key={`input-${qd.controlId}`} 
            size="lg" 
            type="number" 
            min={(typeof qd.min !== "undefined")? qd.min : "0"} 
            max={(typeof qd.max !== "undefined")? qd.max : ""} 
            step={(typeof qd.step !== "undefined")? qd.step : "1"} 
            value={props.currentValue}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
              // NOTE: needed for aesthetics to keep floating point precision in items like GPA, but not in integer values like age
              let n: number = Number(e.target.value);
              if(Number.isInteger(n) === false) {
                e.target.value = parseFloat(e.target.value).toString();
              }
              props.changeHandler(e, qd.stateStorageID, false)
            }}
          />
        </Col>
        <br />
        <Form.Text>{qd.text}</Form.Text>
      </Form.Group>
    </Col>
  );
}

export default NumericQuestion;