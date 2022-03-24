interface AppProps {}

interface AppState {
  currentPage: number,
  furthestPage: number,
  pages: PageQuestion[][],
  userInput: {[key: string]: string},
}

interface SummaryProps {
  resetHandler: function,
  calculationData: CalculationData
}