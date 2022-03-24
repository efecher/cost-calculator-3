import React from 'react';
// import Form from 'react-bootstrap/Form';
// import { Col }  from 'react-bootstrap'; 

// NOTE: Component that renders a question with radio buttons, a single-answer response from a list of choices

export const RadioQuestion: React.FC<QuestionComponentProps>  = (props) => {
  let qd: PageQuestion = props.questionData;
  return (
    <div className="cell medium-4">
      <label>{qd.label}</label>
      { 
        qd.options.map((option, index) => {
          return <>
            <input 
            key={`input-${qd.controlId}-${index}`} 
            type="radio" 
            id={option} 
            name={qd.controlId} 
            value={option}  
            onChange={(e: React.ChangeEvent<HTMLInputElement>) => {props.changeHandler(e, qd.stateStorageID)}} 
            checked={props.currentValue === option} 
          />
          <label htmlFor={option}>{option}</label>
          <br />
          </>
        })
      }
        <small>{qd.text}</small>
    </div>
  );
}

export default RadioQuestion;