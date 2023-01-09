namespace Page {
  interface PageProps {
    pageQuestions: PageQuestion[],
    submitPageHandler: function,
    inputChangeHandler: function,
    stateInputValues: LooseObject
  }
}

interface PageQuestion {
  checked?: string,
  controlId: string,
  controlType: string,
  default?: string,
  label: string,
  max?: string,
  min?: string,
  options: string[],
  stateStorageID: string,
  step?: string,
  text: string
}


// NOTE: a placeholder for when we don't have a more specific type at the moment
interface LooseObject {
  [key: string]: any
}

interface QuestionComponentProps {
  questionData: PageQuestion,
  currentValue: string,
  changeHandler: function
}

interface DisclaimerProps {
  acceptHandler: function
}

interface SummaryProps {
  calculationData: CalculationData
}

interface PaginationProps {
  currentPage: number,
  numberOfPages: number,
  pageClickHandler: function
}

interface PaginationState {}