///<reference path="./typings/app.d.ts" />
import React from 'react';
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

class App extends React.Component<AppProps, AppState> {
  constructor(props: AppProps) {
    super(props);

    this.state = {
      currentPage: 0, // NOTE: Experimental, for the pagination
      furthestPage: 0, // NOTE: Pagination
      pages: PageData.PageData, // NOTE: page data
      //questionLogic: QuestionLogic.QuestionLogic, // NOTE: Question logic, "either/or", etc
      userInput: {}, // NOTE: as user progresses thru app, will collect their responses
      //disclaimerAccepted: false, // NOTE: flag that allows rest of app to progress once user accepts the disclaimer
    }  
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
    
    this.setState({
      userInput: {
        ...this.state.userInput,
        [`${ssID}`]: value
      }
    });
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
      return <Summary calculationData={this.state.userInput} 
      resetHandler={this.resetHandler} />;
    }  
  }
} 

export default App;
