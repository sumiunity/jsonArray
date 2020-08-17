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
      __headercell__(
        json_table,
        '',
        `${json_table.parameters.tableName}-th-0`,
      )
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

      //populate the header cell
      row.push(
        __headercell__(
          json_table,
          col,
          `${json_table.parameters.tableName}-th-${i}`,
          headerCellOnClick
        ))

  }

  // define the header row
  const headerrow = __headerrow__(
    json_table,
    row,
    `${json_table.parameters.tableName}-headerrow`
  )


  return (
      __header__(
        json_table,
        headerrow,
        `${json_table.parameters.tableName}-thead`
      )
    );

}




// returns the date as a string based on the provided format
function __headercell__(json_table, value, key, onClick){

  // return standard html json_table header html component when
  // a different cell type is not provided
  if( json_table.parameters.th === undefined ){
    return(
      <th
        key={key}
        style={{textAlign:'center'}}
        onClick={onClick}>
          {value}
      </th>
    )
  }

  var direction = null
  if( json_table.parameters.sortAscending === true ) direction = 'ascending'
  if( json_table.parameters.sortAscending === false ) direction = 'descending'

  console.log( value === json_table.parameters.sortBy, json_table.parameters.sortBy, direction,  )
  return (
    <json_table.parameters.th
      key={key}
      sorted={value === json_table.parameters.sortBy ? direction : null}
      style={{textAlign:'center'}}
      onClick={onClick}>
        {value}
    </json_table.parameters.th>
    );

}

// returns the date as a string based on the provided format
function __headerrow__(json_table, value, key, onClick){

  // return standard html json_table header html component when
  // a different cell type is not provided
  if( json_table.parameters.tr === undefined ){
    return(
      <tr
        key={key}
        style={{textAlign:'center'}}
        onClick={onClick}>
          {value}
      </tr>
    )
  }

  return (
    <json_table.parameters.tr
      key={key}
      style={{textAlign:'center'}}
      onClick={onClick}>
        {value}
    </json_table.parameters.tr>
    );

}

// returns the date as a string based on the provided format
function __header__(json_table, value, key, onClick){

  // return standard html json_table header html component when
  // a different cell type is not provided
  if( json_table.parameters.thead === undefined ){
    return(
      <thead
        key={key}
        style={{textAlign:'center'}}
        onClick={onClick}>
          {value}
      </thead>
    )
  }

  return (
    <json_table.parameters.thead
      key={key}
      style={{textAlign:'center'}}
      onClick={onClick}>
        {value}
    </json_table.parameters.thead>
    );

}
