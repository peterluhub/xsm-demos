import React from 'react';
import { bindState } from 'xsm';
import Row from './row'

export default class Table  extends React.Component {
    constructor() {
        super();
        bindState(this, {loading: false, rows: []});
    }

    render() {
      const {loading, rows} = this;
      return loading?
          <span>Loading</span>
          :
          rows.map(row => <Row key={row.id} row={row} />)
   }
}
