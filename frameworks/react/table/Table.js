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


/**
 * Integrated table component  build into the jsonArray
 * @param       {String} props.tableName
 * @param       {Component} props.table base html component that can be overwritten by Framework component
 * @param       {Component} props.tr    base html component that can be overwritten by Framework component
 * @param       {Component} props.td    base html component that can be overwritten by Framework component
 * @param       {Component} props.th    base html component that can be overwritten by Framework component
 * @param       {Component} props.body  base html component that can be overwritten by Framework component
 * @param       {Component} props.button base html component that can be overwritten by Framework component
 * @param       {function} props.columnOnClick  function exectued when a column is selected
 * @param       {function} props.rowOnClick     function exectued when a row is selected
 * @param       {function} props.cellOnClick    function exectued when a cell is selected
 * @param       {Boolean} props.accordian  Not implemented
 * @param       {Boolean} props.accordianHeader  Not implemented
 * @param       {Boolean} props.accordianColumns  Not implemented
 * @param       {Boolean} props.accordianFunc  Not implemented
 * @param       {Boolean} props.showHeader when True, the table header will be shown
 * @param       {Boolean} props.sortable   When True, the table can be sorted by the columns
 * @param       {Array} props.columns     Array of column names
 * @param       {Array} props.columnNames Array of column names
 * @param       {String} props.sortBy     column name that will be presorted
 * @param       {String} props.sortAscending  sort column direction
 * @param       {boolean} props.lazingLoading  when True, only part of the table will be rendered with the ability to render in steps (lazy loading)
 * @param       {Integer} props.lazyLoadingStart  Number of rows to render on init
 * @param       {Integer} props.lazyLoadingStep   Number of rows to add when rerendering
 * @param       {Array} props.rowBackgroundColor set the background color of multiple rows based on the index number
 * @constructor
 */
export default class Table extends ReactLibraryFramework{
  constructor(data){
    super(data)

    // must bind this to all internal functions or they will be
    // lost when rendering via react
    this.Table = this.Table.bind(this)
  }

  Table( props ){

    // Render the table with a Series data structure
    if( this.data instanceof Series ){
      return SeriesTable( this.props(props) )
    }

    // default to render the table as a DataFrame type
    return Render( this.props(props) )
  }

}




/**
 * Renders the table based on the data and parameters specified in the
 // json table attribute. This was moved to it's own function in order
 // to be complient with React's requirement for useState functionality
 // to be implemented within a function
 * @param       {[type]} props [description]
 * @constructor
 */
export function Render( props ){

  // internal variable to tracke the sorted column and sort order
  const [sortBy, setSortBy] = useState(props.sortBy)
  const [sortAscending, setSortAscending] = useState(props.sortAscending)
  const [filters, setFilters] = useState(props.filters)
  const [renderedRows, setRenderedRows] = useState((props.lazyLoadingStart === undefined) ? 100 : props.lazyLoadingStart)

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

  // enable the column onClick to track the selected column, which will
  // be sorted when enabled
  var columnFilterOnChange = props.columnFilterOnChange
  if( props.filterable === true ){
      columnFilterOnChange = (content) => {
        var temp = filters
        // manage initial conditions
        if( temp === undefined ) temp = []

        temp = temp.filter(r => r.col_name !== content.col_name)

        // only push valid values (accounts for dropdown clearing)
        if( content.value.length > 0 ) temp.push( content )
        setFilters( temp )
      }
  }

  // sort the data based on the column name specified in the parameters
  // or the internal state variable when selection is enabled
  var sortedColumn = sortBy
  if( sortedColumn !== undefined ){
    table_data = table_data.sort_values( sortedColumn, sortAscending)
  }

  // filter Table based on the values stored in the filter object array
  if( filters !== undefined ){
    for( var i=0; i < filters.length; i ++ ){
      // console.log( 'thisis the filter', filters[i])
      const filt = filters[i]
      table_data = table_data.filter(r => filt.value.includes(r[filt.col_name]) )
    }
    // console.log( table_data)
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
          filters = {filters}
          columnOnClick = {columnOnClick}
          columnFilterOnChange = {columnFilterOnChange}
          />,

        <TableBody
          {...props}
          key={`${tableName}-TableBody`}
          tableName = {tableName}
          table_data={table_data}
          columns = {columns}
          renderedRows = {renderedRows}
          setRenderedRows = {setRenderedRows}
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
