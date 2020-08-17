/**
 * Semantic UI Framework
 * =======================
 *
 * Extends the jsonArray functionality to include specific
 * functions for formatting semantic UI components
 *
 * :Author: Nik Sumikawa
 * :Date: Aug 4, 2020
 */


import React, {useState, useEffect} from 'react';

import jsonArray from '../../../jsonArray'


import tableHeader from './header'
import tableBody from './body'

const debug = false

export default class jsonArrayTable{


  constructor(array) {

    this.data = array
    if( !(array instanceof jsonArray) ){
      this.data = new jsonArray( array )
    }

    this.parameters = {
      tableName: 'table',
      table: undefined,
      td: undefined,
      th: undefined,
      tr: undefined,
      body: undefined,
      showHeader: true,
      columnOnClick: undefined,
      rowOnClick: undefined,
      cellOnClick:{},
      button: {},
      accordian: false,
      columns: this.data.columns,
      columnNames: {},
      sortable: false,
      sortBy: undefined,
      sortAscending : false,
    }


  }

  render( props={} ){

    // internal variable to tracke the sorted column and sort order
    const [sortBy, setSortBy] = useState(this.parameters.sortBy)
    const [sortAscending, setSortAscending] = useState(this.parameters.sortAscending)

    // enable the column onClick to track the selected column, which will
    // be sorted when enabled
    if( this.parameters.sortable === true ){
        this.parameters.columnOnClick = (content) => {
          setSortBy( content.col_name );
          setSortAscending( !sortAscending );
        }
    }

    // sort the data based on the column name specified in the parameters
    // or the internal state variable when selection is enabled
    var sortedColumn = sortBy
    if( sortedColumn !== undefined ){
      this.data = this.data.sort_values( sortedColumn, sortAscending)

      this.parameters.sortBy = sortedColumn
      this.parameters.sortAscending = sortAscending
    }

    return (
      __table__(
        this,
        [
          tableHeader(this),
          tableBody(this)
        ],
        props
      )
    );

  }


}




// returns the date as a string based on the provided format
function __table__(json_table, value, props){


  // if( props.sort)
  // return standard html json_table header html component when
  // a different cell type is not provided
  if( json_table.parameters.table === undefined ){
    return(
      <table
        key={`${json_table.table_name}-table`}
        style={{textAlign:'center'}}
        >
          {value}
      </table>
    )
  }

  return (
    <json_table.parameters.table
      key={`${json_table.table_name}-table`}
      style={{textAlign:'center'}}
      >
        {value}
    </json_table.parameters.table>
    );

}
