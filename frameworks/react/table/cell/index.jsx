/**
 * Cells
 * =================
 * Routines for generating different Cell formats
 *
 * :Author: Nik Sumikawa
 * :Date: Jan 13, 2020
 */



import React from 'react';


import {Cell as TableCell} from '../../framework/Components'

import cellType from './cellType'


export default function Cell( props ) {
  // populute each cell based on the specified column type. When no
  // column type is provided, default to text format

  const cell = cellType(props)

  var style = {textAlign:'center'}

  // the background color can be provided as a field of table object.
  // The background color parameter requires a json array with the
  // same fields as the data table. What would normally contain the
  // data now contains colors
  if( props.cellBackgroundColor !== undefined ){
    try{
      const color = props.cellBackgroundColor[props.row_idx][props.col]
      if( color !== undefined ) style['backgroundColor'] = color
    }catch{}
  }

  if( props.cellStyle !== undefined ){
    try{
      style = {
        ...style,
        ...props.cellStyle[props.row_idx][props.col]

      }
    }catch{}
  }

  return (
    <TableCell
      {...props.tdProps}
      style={{...style, ...props.tdStyle}}
      component={props.td}
      key = {`${props.tableName}-cell-${props.col}-${props.row_idx}`}
      onClick={cell.cellOnClick}
      defaultValue= {cell.cellContent}
      />
  )

}
