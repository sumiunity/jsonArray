/**
 * Table Column Framework
 * =======================
 *
 * Add functionality to the base table driver to allow for
 * column header generation
 *
 * :Author: Nik Sumikawa
 * :Date: Aug 4, 2020
 */



import React from 'react';

import jsonArrayTable from './jsonArrayTable'

import {HeaderCell, Header, Row} from '../framework/Components'

const debug = false

export default function tableHeader( json_table ) {

  if( !(json_table instanceof jsonArrayTable) ){
    json_table = new jsonArrayTable(json_table)
  }


  // do not render header when visible is turned off
  if( json_table.parameters.showHeader === false ) return null

  var row = []
  var col_offset = 0

  // add a leading column when specific parameters are provided
  // in the table object
  if( json_table.parameters.accordian === true ){
    row.push(
      <HeaderCell
        {...json_table.parameters.thProps}
        style={{...{textAlign:'center'}, ...json_table.parameters.thStyle}}
        Component={json_table.parameters.th}
        defaultValue = {''}
        key = {`${json_table.parameters.tableName}-th-0`}
        />
    )
    col_offset = col_offset + 1
  }


  for (var i=col_offset; i < json_table.parameters.columns.length; i++ ){
      //retrieve the column name from the data structure
      var col = json_table.parameters.columns[i]

      //map the column name when the mapping exists
      if( Object.keys(json_table.parameters.columnNames).includes(col) ){
        col = json_table.parameters.columnNames[col]
      }

      var headerCellOnClick = null
      if( json_table.parameters.columnOnClick !== undefined ){
        // persist the onClick inputs to avoid mutation
        const col_name = col
        const col_number = i
        headerCellOnClick = () => json_table.parameters.columnOnClick({
          col_name: col_name,
          col_number: col_number
        })
      }

      // sorted={value === json_table.parameters.sortBy ? direction : null}

      //populate the header cell
      row.push(
        <HeaderCell
          {...json_table.parameters.thProps}
          style={{...{textAlign:'center'}, ...json_table.parameters.thStyle}}
          Component={json_table.parameters.th}
          defaultValue = {col}
          key = {`${json_table.parameters.tableName}-th-${i}`}
          onClick={headerCellOnClick}
          />
      )

  }

  // define the header row
  const headerrow = (
    <Row
      {...json_table.parameters.trProps}
      style={{...{textAlign:'center'}, ...json_table.parameters.trStyle}}
      Component={json_table.parameters.tr}
      defaultValue={row}
      key={`${json_table.parameters.tableName}-headerrow`}
      style={{textAlign:'center'}}
      />
  )


  return (
      <Header
        {...json_table.parameters.theadProps}
        style={{...{textAlign:'center'}, ...json_table.parameters.theadStyle}}
        Component={json_table.parameters.thead}
        defaultValue={headerrow}
        key = {`${json_table.parameters.tableName}-thead`}
        />
    );

}
