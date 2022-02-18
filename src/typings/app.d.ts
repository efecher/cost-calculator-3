declare module "*.json" {
  const value: any;
  export default value;
}

interface AppProps {}

interface AppState {
  currentPage: number,
  furthestPage: number,
  pages: PageQuestion[][],
  userInput: {[key: string]: string},
  questionLogic: LogicOrPage[]
}

interface LogicOrPage {
  logicORLeft: string[],
  logicORRight: string[]
}

interface SummaryProps {
  resetHandler: function,
  calculationData: CalculationData
}