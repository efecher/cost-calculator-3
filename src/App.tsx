///<reference path="./typings/app.d.ts" />
import React, { useState, useEffect } from 'react';
import PageData from './questions/question-bank.json';
//import QuestionLogic from './questions/question-logic.json';
import Page from './pages/page';
import Summary from './pages/summary';
import { Container, Row, Col } from 'react-bootstrap'
import 'bootstrap/dist/css/bootstrap.min.css';
import { prop } from './util/util'; 
import PageIndicator from './page-indicator';
import './App.css';

// NOTE: UI components are from react-bootstrap package https://react-bootstrap.github.io/

export default function App(props: AppProps) {

  const [appState, setAppState] = useState<AppState>({
    currentPage: 0,
    furthestPage: 0,
    pages: PageData.PageData,
    userInput: {}
  });

    

  useEffect(() => {
    let _ssidKeys: LooseObject = {};
    for(let p of appState.pages) {
      for(let q in p) {
        _ssidKeys = {
          ..._ssidKeys, // NOTE: we are creating a "new state" by including what was there and adding a new property, prevent mutation
          [`${p[q].stateStorageID}`]: prop(p[q], "default")  // NOTE: using "array notation" to create a new property
        }
      }
    }

    setAppState({
      ...appState,
      userInput: _ssidKeys
    });
  },[appState.pages]);

  const resetHandler = () => {
    let _ssidKeys: LooseObject = {};
    for(let p of appState.pages) {
      for(let q in p) {
        _ssidKeys = {
          ..._ssidKeys,
          [`${p[q].stateStorageID}`]: prop(p[q], "default")
        }
      }
    }
    setAppState({
      ...appState,
      currentPage: 0,
      userInput: _ssidKeys
    });

    return;
  }

  const pageSubmitHandler = () => {
    
    let _cp: number = appState.currentPage + 1;
    setAppState({
      ...appState,
      currentPage: _cp,
      furthestPage: appState.furthestPage + 1
    });

    return;
  }

  const inputChangeHandler = (
    e:React.ChangeEvent<HTMLInputElement>, 
    ssID: string, isCheckBox: boolean) => {
      
    let value = e.currentTarget.value;
    // NOTE: given the id, update the input value in state
    // NOTE: if the control is a check box, toggle the true/false representing whether it is checked or not.
    if(isCheckBox) {
      if(value === "true") {
        value = "false";
      } else {
        value = "true";
      }
    }
    
    setAppState({
      ...appState,
      userInput: {
        ...appState.userInput,
        [`${ssID}`]: value
      }
    });
    return;
  }
    
  const jumpBackToPageHandler = (pageNum: number) => {
    setAppState({
      ...appState,
      currentPage: pageNum
    });
    return;
  }


  if(appState.currentPage < appState.pages.length) {
    if(Object.keys(appState.userInput).length > 0) {
      return (
        <>
          <Container>
            <h2 className="text-center">Net Cost Calculator</h2>
            <Row>
              <Col md={12}>
                <PageIndicator pageClickHandler={jumpBackToPageHandler} currentPage={appState.currentPage} numberOfPages={appState.pages.length} />
                <Page 
                  pageQuestions={appState.pages[appState.currentPage]} 
                  submitPageHandler={pageSubmitHandler}
                  stateInputValues={appState.userInput} 
                  inputChangeHandler={inputChangeHandler}  
                />
              </Col>
            </Row>
          </Container>
        </>
      );
    } else {
      return <p>Loading...</p>;
    }
  } else {
    // NOTE: we are done with the data collection, show the Summary component and run the report.
    return <Summary calculationData={appState.userInput} 
    resetHandler={resetHandler} />;
  }
}