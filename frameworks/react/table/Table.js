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


import React, {useState} from 'react';

import jsonArray from '../../../jsonArray'
import Series from '../../../Series'

import ReactLibraryFramework from '../ReactLibraryFramework'

import {Table as TableComponent} from '../framework/Components'
import {SeriesHeader, DataFrameHeader} from './header'
import TableBody from './body'



export default class Table extends ReactLibraryFramework{
  constructor(data){
    super(data)

    // must bind this to all internal functions or they will be
    // lost when rendering via react
    this.Table = this.Table.bind(this)

    console.log( 'data type', this.data instanceof Series )
  }

  Table( props ){

    // Render the table with a Series data structure
    if( this.data instanceof Series ){
      return SeriesTable( this.props(props) )
    }

    console.log( 'these are the props', this.props)
    // default to render the table as a DataFrame type
    return Render( this.props(props) )
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
export function Render( props ){

  // internal variable to tracke the sorted column and sort order
  const [sortBy, setSortBy] = useState(props.sortBy)
  const [sortAscending, setSortAscending] = useState(props.sortAscending)

  // cast the data to a json_array data type
  var table_data = props.data
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

        <DataFrameHeader
          {...props}
          key={`${tableName}-TableHeader`}
          tableName = {tableName}
          table_data={table_data}
          columns = {columns}
          columnOnClick = {columnOnClick}
          />,

        <TableBody
          {...props}
          key={`${tableName}-TableBody`}
          tableName = {tableName}
          table_data={table_data}
          columns = {columns}
          />
        ]}
      />

  );

}




/**
 * Renders the a table for data of Series type
 * @param       {Object} props parameters for rendering Table
 * @constructor
 */
export function SeriesTable( props ){

  // internal variable to tracke the sorted column and sort order
  const [sortBy, setSortBy] = useState(props.sortBy)
  const [sortAscending, setSortAscending] = useState(props.sortAscending)

  var table_data = props.data

  // define the table name which will be used to define the keys
  var tableName = props.tableName
  if( tableName === undefined ) tableName = 'SeriesTable'

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

        <SeriesHeader
          {...props}
          key={`${tableName}-TableHeader`}
          tableName = {tableName}
          table_data={table_data}
          columnOnClick = {columnOnClick}
          />,

        <TableBody
          {...props}
          key={`${tableName}-TableBody`}
          tableName = {tableName}
          table_data={table_data}
          />
        ]}
      />

  );

}
