declare module "*.json" {
  const value: any;
  export default value;
}

interface AppProps {}

interface AppState {
  currentPage: number,
  pages: PageQuestion[][],
  userInput: {
    [key: string]: string
  },
  questionLogic: LogicOrPage[],
  disclaimerAccepted: boolean,
  calculationTables: CalculationData.calculationTables
}

interface LogicOrPage {
  logicORLeft: string[],
  logicORRight: string[]
}

interface SummaryProps {
  resetHandler: function,
  calculationData: CalculationData
}