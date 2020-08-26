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

import {Table} from '../framework/Components'

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

    return (
      <Render
        json_table = {this}
        />
    )
  }


}


// Renders the table based on the data and parameters specified in the
// json table attribute. This was moved to it's own function in order
// to be complient with React's requirement for useState functionality
// to be implemented within a function
function Render( props ){

  // internal variable to tracke the sorted column and sort order
  const [sortBy, setSortBy] = useState(props.json_table.parameters.sortBy)
  const [sortAscending, setSortAscending] = useState(props.json_table.parameters.sortAscending)

  // enable the column onClick to track the selected column, which will
  // be sorted when enabled
  if( props.json_table.parameters.sortable === true ){
      props.json_table.parameters.columnOnClick = (content) => {
        setSortBy( content.col_name );
        setSortAscending( !sortAscending );
      }
  }

  // sort the data based on the column name specified in the parameters
  // or the internal state variable when selection is enabled
  var sortedColumn = sortBy
  if( sortedColumn !== undefined ){
    props.json_table.data = props.json_table.data.sort_values( sortedColumn, sortAscending)

    props.json_table.parameters.sortBy = sortedColumn
    props.json_table.parameters.sortAscending = sortAscending
  }

  return (
    <Table
      {...props.json_table.parameters.bodyProps}
      style={{...{textAlign:'center'}, ...props.json_table.parameters.bodyStyle}}
      Component={props.json_table.parameters.table}
      key={`${props.json_table.parameters.tableName}-table`}
      defaultValue={[
        tableHeader(props.json_table),
        tableBody(props.json_table)
        ]}
      />

  );

}
