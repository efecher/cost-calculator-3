import React from 'react';
import Pagination from 'react-bootstrap/Pagination';


class PageIndicator extends React.Component<PaginationProps, PaginationState> {
  

  generatePagination = (numPages: number) => {
    let returnJSX: JSX.Element[] = [];
    for(let n=0; n<numPages; n++) {
      returnJSX.push(<Pagination.Item active={n === this.props.currentPage} key={`page${n}`}>{n + 1}</Pagination.Item>)
    }
    return returnJSX;
  }

  render() { 
    return (
      <Pagination size="sm" onClick={this.props.pageClickHandler}>
        {this.generatePagination(this.props.numberOfPages)}
      </Pagination>
    );
  }
}

export default PageIndicator;