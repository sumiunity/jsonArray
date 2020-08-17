/**
 * Table Header
 * ===============
 * Routines for formatting the table header
 *
 * :Author: Nik Sumikawa
 */

import React from 'react';


function TableHeaderCell(props) {

  //add the onclick fundtion. Default to do nothing when the function does not exist
  var onClick = null
  if( props.onClick !== undefined ){
    onClick = () => props.onClick(props.col)
  }

  return (
    <th
      style={{textAlign:'center'}}
      onClick={onClick}>
        {props.value}
    </th>);
}


/**
 * Routine for populating the table headers based on the contents of the
 * table data structure. see REST API for table data structure documentation
 * @param       {objects} props Table Datastructure
 * @constructor
 */
export function TableHeader(props) {

    // do not render header when visible is turned off
    if( props.showHeader === false ) return null

    var row = []
    var col_offset = 0

    // add a leading column when specific parameters are provided
    // in the table object
    if( props.table.accordian !== undefined ){
      row.push(
        <TableHeaderCell
          key={'th-leading-button'}
          col={0}
          onClick={props.onClick}
          />
      )
      col_offset = col_offset + 1
    }
    //
    // extract the lookup variables when they exist
    var lookup_keys = []
    if( props.table.col_map !== undefined ){
      lookup_keys = Object.keys( props.table.col_map )
    }

    for (var i=0; i < props.table.columns.length; i++ ){
        //retrieve the column name from the data structure
        var col_name = props.table.columns[i]

        //map the column name when the mapping exists
        if( lookup_keys.includes(col_name) ){
          col_name = props.table.col_map[col_name]
        }

        //populate the header cell
        row.push(
          <TableHeaderCell
            key={'th-' + i}
            value={col_name}
            col={i + col_offset}
            onClick={props.onClick}
            />)

    }

    return (
      <thead>
        <tr>
            {row}
        </tr>
      </thead>
      );
}
