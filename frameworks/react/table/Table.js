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

import {Table as TableComponent} from '../framework/Components'

import TableHeader from './header'
import TableBody from './body'


var json_array

export default function DefaultFunc(){ console.log( 'default not implemented' )}

// Sets the global json array value with the provided data. Checks
// to ensure that the data is the proper type and converts it if
// it is not
export function set( array ){

  json_array = array
  // ensure that the value is jsonArray
  if( !(array instanceof jsonArray) ){
    json_array = new jsonArray( array );
  }
}


//     this.parameters = {
//       tableName: 'table',
//       table: undefined,
//       td: undefined,
//       th: undefined,
//       tr: undefined,
//       body: undefined,
//       showHeader: true,
//       columnOnClick: undefined,
//       rowOnClick: undefined,
//       cellOnClick:{},
//       button: {},
//       accordian: false,
//       columns: this.data.columns,
//       columnNames: {},
//       sortable: false,
//       sortBy: undefined,
//       sortAscending : false,
//     }
//

// Renders the table based on the data and parameters specified in the
// json table attribute. This was moved to it's own function in order
// to be complient with React's requirement for useState functionality
// to be implemented within a function
export function Table( props ){

  // internal variable to tracke the sorted column and sort order
  const [sortBy, setSortBy] = useState(props.sortBy)
  const [sortAscending, setSortAscending] = useState(props.sortAscending)

  // cast the data to a json_array data type
  var table_data = json_array
  if( table_data === undefined ) table_data = props.json_array
  if( !(table_data instanceof jsonArray) ){
    table_data = new jsonArray(table_data)
  }

  // pull the column names from the props when available. Default
  // to using all columns in the DataFrame
  var columns = props.columns
  if( columns === undefined ) columns = table_data.columns

  // define the table name which will be used to define the keys
  var tableName = props.tableName
  if( tableName === undefined ) tableName = 'Table'

  // enable the column onClick to track the selected column, which will
  // be sorted when enabled
  var columnOnClick = props.columnOnClick
  if( props.sortable === true ){
      columnOnClick = (content) => {
        setSortBy( content.col_name );
        setSortAscending( !sortAscending );
      }
  }

  // sort the data based on the column name specified in the parameters
  // or the internal state variable when selection is enabled
  var sortedColumn = sortBy
  if( sortedColumn !== undefined ){
    table_data = table_data.sort_values( sortedColumn, sortAscending)
  }

  return (
    <TableComponent
      {...props.bodyProps}
      style={{...{textAlign:'center'}, ...props.bodyStyle}}
      component={props.table}
      key={`${tableName}-table`}
      defaultValue={[

        <TableHeader
          {...props}
          key={`${tableName}-TableHeader`}
          tableName = {tableName}
          json_array={table_data}
          columns = {columns}
          columnOnClick = {columnOnClick}
          />,

        <TableBody
          {...props}
          key={`${tableName}-TableBody`}
          tableName = {tableName}
          json_array={table_data}
          columns = {columns}
          />
        ]}
      />

  );

}
