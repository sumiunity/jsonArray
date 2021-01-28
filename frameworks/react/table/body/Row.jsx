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




export default function Row( props ) {

    const row_data = props.table_data[props.row_idx]
    const row = []
    for (var i=0; i < props.columns.length; i++ ){
      const col = props.columns[i]

      var tdProps = {...props.tdProps, ...{}}
      if( props.col_span !== undefined ) tdProps['colSpan'] = props.col_span[col]
      if( props.row_span !== undefined){
        if (Object.keys(props.row_span).includes(col)) tdProps['rowSpan'] = props.row_span[col]
      }


      row.push(
        <Cell
          {...props}
          row={row_data}
          value={row_data[col]}
          dtype={props.table_data.dtypes[col]}
          key={`${props.tableName}-cell-${props.row_idx}-${i}`}
          col = {col}
          tdProps={tdProps}
          />
      )
    }


    // define the rowOnClick function to standardize the returned data
    var rowOnClick = null
    if( props.rowOnClick !== undefined ){
      rowOnClick = () => {
        props.setSelectedRow( props.row_idx );
        props.rowOnClick({
          row: props.row_idx,
          row_data: row_data
        })
      }
    }

    

    // set the background color when the row is selected
    var rowStyle = {textAlign:'center'}

    if((props.alternateStyle == true)&(props.row_idx % 2 === 0) ){
      rowStyle['backgroundColor'] = '#f6fcfe'
    }


    if( props.row_idx === props.selectedRow ){
      rowStyle = {textAlign:'center', backgroundColor: '#8c9ac0'}
    }

    // Row background color allows for the control of the background
    // color of multiple rows based on the index number
    if( props.rowBackgroundColor !== undefined ){
      if( props.rowBackgroundColor.includes(row_data.__index__) ){
        rowStyle = {textAlign:'center', backgroundColor: '#8c9ac0'}
      }
    }

    // return the cell content not wrapped in a row element. This
    // is needed for row extensions such as the accordian rows.
    if( props.cellContentOnly === true ){
      return row
    }

    return (
      <TableRow
        {...props.trProps}
        style={{...rowStyle, ...props.trStyle}}
        component={props.tr}
        key={`${props.tableName}-row--${props.row_idx}--${props.multirow_idx}`}
        onClick={rowOnClick}
        defaultValue={row}
        />
    )
}
