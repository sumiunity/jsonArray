/**
 * Table Column Framework
 * =======================
 *
 * Add functionality to the base table driver to allow for
 * column header generation
 *
 *  @author Nik Sumikawa
 *  @date Aug 4, 2020
 */



import React from 'react';

import jsonArray from '../../../jsonArray'

import {HeaderCell, Header, Row} from '../framework/Components'

const debug = false

export default function TableHeader( props ) {

  var json_array = props.json_array
  if( !(props.json_array instanceof jsonArray) ){
    json_array = new jsonArray(props.json_array)
  }

  // when no columns are provided as props, pull them from the data source
  var columns = props.columns
  if( columns === undefined ) columns = json_array.columns

  // do not render header when visible is turned off
  if( props.showHeader === false ) return null

  var row = []
  var col_offset = 0

  // add a leading column when specific parameters are provided
  // in the table object
  if( props.accordian === true ){
    row.push(
      <HeaderCell
        {...props.thProps}
        style={{...{textAlign:'center'}, ...props.thStyle}}
        Component={props.th}
        defaultValue = {''}
        key = {`${props.tableName}-th-0`}
        />
    )
    col_offset = col_offset + 1
  }


  for (var i=col_offset; i < columns.length; i++ ){
      //retrieve the column name from the data structure
      var col = columns[i]

      //map the column name when the mapping exists
      if( props.columnNames !== undefined ){
        if( Object.keys(props.columnNames).includes(col) ){
          col = props.columnNames[col]
        }
      }

      var headerCellOnClick = null
      if( props.columnOnClick !== undefined ){
        // persist the onClick inputs to avoid mutation
        const col_name = col
        const col_number = i
        headerCellOnClick = () => props.columnOnClick({
          col_name: col_name,
          col_number: col_number
        })
      }

      // sorted={value === props.sortBy ? direction : null}

      //populate the header cell
      row.push(
        <HeaderCell
          {...props.thProps}
          style={{...{textAlign:'center'}, ...props.thStyle}}
          component={props.th}
          defaultValue = {col}
          key = {`${props.tableName}-th-${i}`}
          onClick={headerCellOnClick}
          />
      )

  }

  // define the header row
  const headerrow = (
    <Row
      {...props.trProps}
      style={{...{textAlign:'center'}, ...props.trStyle}}
      component={props.tr}
      defaultValue={row}
      key={`${props.tableName}-headerrow`}
      style={{textAlign:'center'}}
      />
  )


  return (
      <Header
        {...props.theadProps}
        style={{...{textAlign:'center'}, ...props.theadStyle}}
        component={props.thead}
        defaultValue={headerrow}
        key = {`${props.tableName}-thead`}
        />
    );

}
