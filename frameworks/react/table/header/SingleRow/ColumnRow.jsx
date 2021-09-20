/**
 * Table Row Framework
 * =======================
 *
 * Component used to render table Rows
 *
 *  @author Nik Sumikawa
 *  @date Sept 18, 2021
 */


import React from 'react';

import {HeaderCell, Row} from '../../../framework/Components'
import Cell from '../Cell'

export default function ColumnRow( props ) {

  var col_offset = 0
  var colCells = []

  // add a leading column when specific parameters are provided
  // in the table object
  if( props.accordian === true ){
    colCells.push(
      <HeaderCell
        {...props.thProps}
        style={{...{textAlign:'center'}, ...props.thStyle}}
        component={props.th}
        defaultValue = {''}
        key = {`${props.tableName}-th-0-ColRow`}
        />
    )
    col_offset = col_offset + 1
  }


  // when no columns are provided as props, pull them from the data source
  var columns = props.columns
  if( columns === undefined ) columns = props.table_data.columns


  for (var i=0; i < columns.length; i++ ){
      //retrieve the column name from the data structure
      var col = columns[i]
      const colNumber = i + col_offset

      //populate the header cell
      colCells.push(
        <Cell
          {...props}
          col = {col}
          colNumber = {colNumber}
          key = {`${props.tableName}-th-${colNumber}-ColRow`}
          />
      )

  }


  // define the header row
  return (
    <Row
      {...props.trProps}
      style={{...{textAlign:'center'}, ...props.trStyle}}
      component={props.tr}
      defaultValue={colCells}
      key={`${props.tableName}-headerrow`}
      />
  )



}
