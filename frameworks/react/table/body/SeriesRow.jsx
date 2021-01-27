/**
 * Table Body
 * ================
 *
 * React components used to generate the Table Body
 *
 *  @author Nik Sumikawa
 *  @date Aug 27, 2020
 */



import React from 'react';


import Cell from '../cell'
import {Row as TableRow} from '../../framework/Components'


/**
 * Returns a Row of Cell components based on data Formatted
 * as a Series
 * @param       {Object} props data and style parameters
 */
export default function SeriesRow( props ) {

  const index = props.table_data.index
  const values = props.table_data.values

  // format the row data to return in onClick functions
  const row_data = {
    __index__: index[props.row_idx],
    __value__: values[props.row_idx],
  }

  // default the data type unless the table contains a datatype array
  // which is provided manually for table customization
  var dtype = props.table_data.dtype
  if( props.table_data.dtypes !== undefined ) dtype = props.table_data.dtypes[row_data['__index__']]

  const row = [
    <Cell
      {...props}
      row={row_data}
      value={row_data['__index__']}
      dtype={'string'}
      key={`${props.tableName}-cell-${props.row_idx}-${0}`}
      col = {'__index__'}
      />,

    <Cell
      {...props}
      row={row_data}
      value={row_data['__value__']}
      dtype={dtype}
      key={`${props.tableName}-cell-${props.row_idx}-${1}`}
      col = {'__value__'}
      />

  ]



  // define the rowOnClick function to standardize the returned data
  var rowOnClick = null
  if( props.rowOnClick !== undefined ){
    rowOnClick = () => props.rowOnClick({
      row: props.row_idx,
      row_data: row_data
    })
  }

  return (
    <TableRow
      {...props.trProps}
      style={{...{textAlign:'center'}, ...props.trStyle}}
      component={props.tr}
      key={`${props.tableName}-row--${props.row_idx}`}
      onClick={rowOnClick}
      defaultValue={row}
      />
  )
}
