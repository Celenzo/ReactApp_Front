import React from 'react';
import ReactDOM from 'react-dom';

import App from './components/app/app';

class Root extends React.Component {
  
  render() {
    return (
      <App></App>
    )
  
  }
}

  // ========================================
  
ReactDOM.render(
  <Root />,
  document.getElementById('root')
);
  