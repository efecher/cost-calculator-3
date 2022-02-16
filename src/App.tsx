///<reference path="./typings/app.d.ts" />
import React from 'react';
import * as EFCData from './data/efc.json';
import * as MeritData from './data/merit.json';
import * as PellData from './data/pell.json';
import * as TAGData from './data/tag.json';
import * as POAData from './data/poa.json';
import Disclaimer from './pages/disclaimer';
import PageData from './questions/question-bank.json';
import QuestionLogic from './questions/question-logic.json';
import Page from './pages/page';
import Summary from './pages/summary';
import { Container, Row, Col } from 'react-bootstrap'
import 'bootstrap/dist/css/bootstrap.min.css';
import { prop } from './util/util'; 
import PageIndicator from './page-indicator';
import './App.css';

// NOTE: UI components are from react-bootstrap package https://react-bootstrap.github.io/

class App extends React.Component<AppProps, AppState> {
  constructor(props: AppProps) {
    super(props);

    this.state = {
      calculationTables: {
        EFC: EFCData, // NOTE: Expected Family Contribution matrix data
        Merit: MeritData, // NOTE: Merit award matrix data
        Pell: PellData, // NOTE: Pell Grant data
        TAG: TAGData, // NOTE: Tuition Assistance Grant data
        POA: POAData, // NOTE: Price of Admission data
      },
      currentPage: 0, // NOTE: Experimental, for the pagination
      furthestPage: 0, // NOTE: Pagination
      pages: PageData.PageData, // NOTE: page data
      questionLogic: QuestionLogic.QuestionLogic, // NOTE: Question logic, "either/or", etc
      userInput: {}, // NOTE: as user progresses thru app, will collect their responses
      //disclaimerAccepted: false, // NOTE: flag that allows rest of app to progress once user accepts the disclaimer
    }  
  } 

  /* NOTE: since there is a lot of data that needs to go to the 
  *  Calculator part of the app, organize and package up the data
  *  we need as one object to send to the Summary compnent as props
  *  instead of a large number or individual props
  */ 
  packageSummaryData = () => {
    let calculationData = {
      calculationTables: this.state.calculationTables,
      userInput: this.state.userInput
    };

    return calculationData;
  }

  componentDidMount = () => {
    let _ssidKeys: LooseObject = {};
    for(let p of this.state.pages) {
      for(let q in p) {
        _ssidKeys = {
          ..._ssidKeys, // NOTE: we are creating a "new state" by including what was there and adding a new property, prevent mutation
          [`${p[q].stateStorageID}`]: prop(p[q], "default")  // NOTE: using "array notation" to create a new property
        }
      }
    }

    this.setState({
      ...this.state,
      userInput: _ssidKeys
    });
  }

  resetHandler = (e:React.MouseEvent<HTMLButtonElement>) => {
    let _ssidKeys: LooseObject = {};
    for(let p of this.state.pages) {
      for(let q in p) {
        _ssidKeys = {
          ..._ssidKeys,
          [`${p[q].stateStorageID}`]: prop(p[q], "default")
        }
      }
    }
    this.setState({
      currentPage: 0,
      userInput: _ssidKeys
    });

    return;
  }

  pageSubmitHandler = (e:React.MouseEvent<HTMLButtonElement>) => {
    
    let _cp: number = this.state.currentPage + 1;
    this.setState({
      currentPage: _cp,
      furthestPage: this.state.furthestPage + 1
    });

    return;
  }

  inputChangeHandler = (
    e:React.ChangeEvent<HTMLInputElement>, 
    ssID: string) => {
    //console.log(`${ssID} :: ${e.currentTarget.value}`);
    
    // NOTE: given the id, update the input value in state
    this.setState({
      userInput: {
        ...this.state.userInput,
        [`${ssID}`]: e.currentTarget.value
      }
    });

    /* NOTE: determine if this is a situation like SAT/ACT where user 
    * can answer the SAT questions, but then not ACT and vice-versa
    * if so, then if the user enters a value for either SAT input, disable
    * the ACT and vice-versa for the ACT
    */

    // NOTE: if there is a value in the input
    if(parseInt(e.currentTarget.value) > 0) {
      let _l: LogicOrPage = this.state.questionLogic[this.state.currentPage]; // NOTE: check if this question has logic behind it
      //console.log(_l);
      for(let _q of _l.logicORLeft) {
        if(_q === ssID) {
          /* NOTE: if the current input is one of the left side, disable the right side
          * of the 'or' 
          */
          for(let r of _l.logicORRight) {
            (document.querySelector<HTMLInputElement>(`#${r.substring(5)}`))!.disabled = true; // NOTE: the ! is not a typo, it's an assertion to the typescript compiler that the condition is true and there's always expected to be the item in question available in the DOM, to prevent a compilation error. If the item isn't there, there's something wrong anyway.
          }
        }
      }

      for(let _q of _l.logicORRight) {
        if(_q === ssID) {
          /* NOTE: if the current input is one of the left side, disable the right side
          * of the 'or' 
          */
          for(let r of _l.logicORLeft) {
            //console.log(r);
            (document.querySelector<HTMLInputElement>(`#${r.substring(5)}`))!.disabled = true;
          }
        }
        break;
      }
    } else {
      let _l: LogicOrPage = this.state.questionLogic[this.state.currentPage];
      for(let _ssID of _l.logicORLeft) {
        (document.querySelector<HTMLInputElement>(`#${_ssID.substring(5)}`))!.disabled = false;
      }
      for(let _ssID of _l.logicORRight) {
        (document.querySelector<HTMLInputElement>(`#${_ssID.substring(5)}`))!.disabled = false;
      }
    }
    return; 
  }

  jumpBackToPageHandler = (pageNum: number) => {
    this.setState({
      currentPage: pageNum
    });
    return;
  }

  render = () => {
    // NOTE: make sure we're not on the last page
    if(this.state.currentPage < this.state.pages.length) {
      //console.log(this.state.questionLogic);
      // NOTE: Important to ensure the state keys are there
      // for the controlled inputs
      if(Object.keys(this.state.userInput).length > 0) {
        // NOTE: in JSX you can only output one 'root' element for all the content, so rather than use a <div>, use <> which is equivalent to <React.Fragment>
        return (
          <>
            <Container>
              <h2 className="text-center">Net Cost Calculator</h2>
              <Row>
                <Col md={12}>
                  <PageIndicator pageClickHandler={this.jumpBackToPageHandler} currentPage={this.state.currentPage} numberOfPages={this.state.pages.length} />
                  <Page 
                    pageQuestions={this.state.pages[this.state.currentPage]} 
                    submitPageHandler={this.pageSubmitHandler}
                    stateInputValues={this.state.userInput} 
                    inputChangeHandler={this.inputChangeHandler}  
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
      return <Summary calculationData={this.packageSummaryData()} 
      resetHandler={this.resetHandler} />;
    }  
  }
} 

export default App;
