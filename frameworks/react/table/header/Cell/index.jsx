/**
 * Table Cell Framework
 * =======================
 *
 * Component used to render table cells
 *
 *  @author Nik Sumikawa
 *  @date Sept 18, 2021
 */




import React from 'react';

import {HeaderCell} from '../../../framework/Components'

import ColumnFilter from '../Filter/ColumnFilter'


/**
 * [Cell description]
 * @param       {string} col column name
 * @param       {integer} colNumber column number
 * @constructor
 */
export default function Cell( props ) {

  var col = props.col

  //map the column name when the mapping exists
  if( props.columnNames !== undefined ){
    if( Object.keys(props.columnNames).includes(col) ){
      col = props.columnNames[col]
    }
  }

  // generate the standard Header onClick function
  var headerCellOnClick = null
  if( props.columnOnClick !== undefined ){
    headerCellOnClick = () => props.columnOnClick({
      col_name: col,
      colNumber: props.colNumber
    })
  }

  // replace the column component with a filter when filters are specified
  var ColComponent = col
  if( props.columnFilterOnChange !== undefined ){
    headerCellOnClick = null

    ColComponent = (
      <ColumnFilter
        {...props}
        key = {`Header-ColFilter-${col}`}
        col = {col}
        colNumber = {props.colNumber}
        />
    )
  }

  // sorted={value === props.sortBy ? direction : null}

  //populate the header cell
  return(
    <HeaderCell
      {...props.thProps}
      style={{...{textAlign:'center'}, ...props.thStyle}}
      component={props.th}
      defaultValue = {ColComponent}
      key = {`${props.tableName}-th-${props.colNumber}`}
      onClick={headerCellOnClick}
      />
  )

}
