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



import jsonArray from '../jsonArray'
import React from 'react';


const debug = false

export default function tableHeader( table ) {

  if( !(table instanceof jsonArray) ){
    table = new jsonArray(table)
  }


  // do not render header when visible is turned off
  if( table.showHeader === false ) return null

  var row = []
  var col_offset = 0

  // add a leading column when specific parameters are provided
  // in the table object
  if( table.accordian !== undefined ){
    row.push(
      cell(
        table,
        '',
        `${table.tableName}-th-0`,
      )
    )
    col_offset = col_offset + 1
  }
  // //
  // // extract the lookup variables when they exist
  // var lookup_keys = []
  // if( props.table.col_map !== undefined ){
  //   lookup_keys = Object.keys( props.table.col_map )
  // }
  //
  const onClickColumns = Object.keys( table.columnOnClick )

  for (var i=col_offset; i < table.columns.length; i++ ){
      //retrieve the column name from the data structure
      var col = table.columns[i]

      // //map the column name when the mapping exists
      // if( lookup_keys.includes(col_name) ){
      //   col_name = props.table.col_map[col_name]
      // }

      var onClick = null
      if( onClickColumns.includes(col) ) onClick = table.columnOnClick[col]

      //populate the header cell
      row.push(
        cell(
          table,
          col,
          `${table.tableName}-th-${i}`,
          onClick
        ))

  }

  return (
    <thead key={`${table.tableName}-thead`}>
      <tr key={`${table.tableName}-tr`}>
          {row}
      </tr>
    </thead>
    );

}




// returns the date as a string based on the provided format
function cell(table, value, key, onClick){

  // return standard html table header html component when
  // a different cell type is not provided
  if( table.th === undefined ){
    return(
      <th
        key={key}
        style={{textAlign:'center'}}
        onClick={onClick}>
          {value}
      </th>
    )
  }

  return (
    <table.th
      key={key}
      style={{textAlign:'center'}}
      onClick={onClick}>
        {value}
    </table.th>
    );

}
