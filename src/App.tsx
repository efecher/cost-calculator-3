///<reference path="./typings/app.d.ts" />
import React from 'react';
import * as EFCData from './data/efc.json';
import * as MeritData from './data/merit.json';
import * as PellData from './data/pell.json';
import * as TAGData from './data/tag.json';
import * as POAData from './data/poa.json';
import Disclaimer from './pages/disclaimer';
import * as PageData from './questions/question-bank.json';
import * as QuestionLogic from './questions/question-logic.json';
import Page from './pages/page';
import Summary from './pages/summary';
import { Container, Row, Col } from 'react-bootstrap'
import 'bootstrap/dist/css/bootstrap.min.css';
import { prop } from './util/util'; 
import PageIndicator from './page-indicator';


class App extends React.Component<AppProps, AppState> {
  constructor(props: AppProps) {
    super(props);

    this.state = {
      calculationTables: {
        EFC: EFCData,
        Merit: MeritData,
        Pell: PellData, 
        TAG: TAGData,
        POA: POAData
      },
      currentPage: 0,
      furthestPage: 0,
      pages: PageData.pages,
      questionLogic: QuestionLogic.logic,
      userInput: {},
      disclaimerAccepted: false
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
          ..._ssidKeys,
          [`${p[q].stateStorageID}`]: prop(p[q], "default")
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
      let _l: LogicOrPage = this.state.questionLogic[this.state.currentPage];
      //console.log(_l);
      for(let _q of _l.logicORLeft) {
        if(_q === ssID) {
          /* NOTE: if the current input is one of the left side, disable the right side
          * of the 'or' 
          */
          for(let r of _l.logicORRight) {
            //console.log(r.substring(5,(ssID.length - 5)));
            (document.querySelector<HTMLInputElement>(`#${r.substring(5)}`))!.disabled = true;
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

  acceptHandler = (e:React.MouseEvent<HTMLButtonElement>) => {
    if(!this.state.disclaimerAccepted) {
      this.setState({
        disclaimerAccepted: true
      });
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
    // NOTE: User must accept the disclaimer first
    if(!this.state.disclaimerAccepted) {
      return (
        <>
        <h2 className="text-center">Net Cost Calculator</h2>
        <Container>
          <Row>
            <Col md={{span:8, offset: 2}}>
              <Disclaimer acceptHandler={this.acceptHandler} />
              </Col>
          </Row>
        </Container>
        </>
      );
    } else {
      // NOTE: make sure we're not on the last page
      if(this.state.currentPage < this.state.pages.length) {
        //console.log(this.state.questionLogic);
        // NOTE: Important to ensure the state keys are there
        // for the controlled inputs
        if(Object.keys(this.state.userInput).length > 0) {
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
        return <Summary calculationData={this.packageSummaryData()} 
        resetHandler={this.resetHandler} />;
      } 
    }
  }
} 

export default App;
