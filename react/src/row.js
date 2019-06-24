import React from 'react';

const GlyphIcon = <span className="glyphicon glyphicon-remove" aria-hidden="true"></span>;

export default class Row  extends React.Component {

  render() {
    let row  = this.props.row;
    if( !row.id ) return null;

    return (<tr className={this.selected?"danger":""}>
      <td className="col-md-1">{row.id}</td>
      <td className="col-md-4"><a>{row.label}</a></td>
      <td className="col-md-1"><a>{GlyphIcon}</a></td>
      <td className="col-md-6"></td>
    </tr>);
  }
}
