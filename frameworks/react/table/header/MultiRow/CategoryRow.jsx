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

export default function TableRow( props ) {

  var col_offset = 0
  var catCells = []

  // add a leading column when specific parameters are provided
  // in the table object
  if( props.accordian === true ){
    catCells.push(
      <HeaderCell
        {...props.thProps}
        style={{...{textAlign:'center'}, ...props.thStyle}}
        component={props.th}
        defaultValue = {''}
        key = {`${props.tableName}-th-0-CategoryRow`}
        />
    )
    col_offset = col_offset + 1
  }


  // when no columns are provided as props, pull them from the data source
  var categories = Object.keys(props.columnGroups)

  for (var i=0; i < categories.length; i++ ){
      //retrieve the column name from the data structure
      var cat = categories[i]
      const colNumber = i + col_offset

      // determine the col/row spanning based on the col group types
      var thProps = {...props.thProps, ...{}}
      if( typeof props.columnGroups[cat] === 'string' ){
        thProps['rowSpan'] = 2
      } else{
        thProps['colSpan'] = props.columnGroups[cat].length
      }

      //populate the header cell
      catCells.push(
        <Cell
          {...props}
          col = {cat}
          colNumber = {colNumber}
          thProps={thProps}
          key = {`${props.tableName}-th-${colNumber}-CategoryRow`}
          />
      )

  }


  // define the header row
  return (
    <Row
      {...props.trProps}
      style={{...{textAlign:'center'}, ...props.trStyle}}
      component={props.tr}
      defaultValue={catCells}
      key={`${props.tableName}-CategoryRow`}
      />
  )



}
