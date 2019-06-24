import React from 'react';
import ReactDOM from 'react-dom';
import { set, setMany, setcfg } from 'xsm';
import Table from './table'

setcfg({framework: 'React', debug: false});

function Button({ id, cb, title }) {
  return (
    <div className="col-sm-6 smallpad">
      <button type="button" className="btn btn-primary btn-block" id={id} onClick={cb}>{title}</button>
    </div>
  );
}

class Jumbotron extends React.Component {
  syncrow = () => {
      set('rows', [{id: 1, label: 'this is a sync apple'}]);
  }

  asyncrow = () => {
      set('loading', true);
      setTimeout(() => setMany({loading: false, rows: [{id: 1, label: 'this is an async apple'}]}), 1000);
  }

  clear = () => {
    set('rows', []);
  }

  render() {
    return (
      <div className="jumbotron">
        <div className="row">
          <div className="col-md-6">
            <h1>React-XSM</h1>
          </div>
          <div className="col-md-6">
            <div className="row">
              <Button id="sync" title="Create a row synchronously" cb={this.syncrow} />
              <Button id="async" title="Create a row asynchronously" cb={this.asyncrow} />
              <Button id="Clear" title="Clear" cb={this.clear} />
            </div>
          </div>
        </div>
      </div>
    );
  }
}

class Main extends React.Component {
  render() {
    return (<div className="container">
      <Jumbotron />
      <table className="table table-hover table-striped test-data"><tbody><Table /></tbody></table>
    </div>);
  }
}

ReactDOM.render(
  <Main />,
  document.getElementById('main'),
);
