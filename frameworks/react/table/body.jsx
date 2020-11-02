/**
 * Table Body
 * ================
 *
 * React components used to generate the Table Body
 *
 *  @author Nik Sumikawa
 *  @date Aug 27, 2020
 */



import React, {useState} from 'react';

import Series from '../../../Series'

import Cell from './cell'
import {Body, Row as TableRow} from '../framework/Components'



export default function TableBody( props ) {

  const [selectedRow, setSelectedRow] = useState()

  // default to using the DataFrame Row Format
  var Component = Row
  var rows = props.table_data.length

  // when lazy loading is implemented, limited the number of rows to render
  if( props.lazyLoading === true ) rows = props.renderedRows

  // overwrite the component with Accordian rows when specified
  if( props.accordian === true ) Component = AccordianRow

  // change component types when the data is of series type
  if( props.table_data instanceof Series ){
    Component = SeriesRow
    rows = props.table_data.values.length
  }


  const body = []
  for (var i=0; i < rows; i++ ){

    body.push(
      <Component
        {...props}
        key={`${props.tableName}-Row-${i}`}
        row_idx = {i}
        selectedRow = {selectedRow}
        setSelectedRow = {setSelectedRow}
        />
    )


  }

  return (
    <Body
      {...props.bodyProps}
      style={{...{textAlign:'center'}, ...props.bodyStyle}}
      component={props.body}
      key={`${props.tableName}-body`}
      defaultValue={body}
      />
  )


}




function Row( props ) {

    const row = []
    for (var i=0; i < props.columns.length; i++ ){
      const col = props.columns[i]
      row.push(
        <Cell
          {...props}
          row={props.table_data[props.row_idx]}
          value={props.table_data[props.row_idx][col]}
          dtype={props.table_data.dtypes[col]}
          key={`${props.tableName}-cell-${props.row_idx}-${i}`}
          col = {col}
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
          row_data: props.table_data[props.row_idx]
        })
      }
    }

    // set the background color when the row is selected
    var rowStyle = {textAlign:'center'}
    if( props.row_idx === props.selectedRow ){
      rowStyle = {textAlign:'center', backgroundColor: '#8c9ac0'}
    }


    return (
      <TableRow
        {...props.trProps}
        style={{...rowStyle, ...props.trStyle}}
        component={props.tr}
        key={`${props.tableName}-row--${props.row_idx}`}
        onClick={rowOnClick}
        defaultValue={row}
        />
    )
}




/**
 * Returns a Row of Cell components based on data Formatted
 * as a Series
 * @param       {Object} props data and style parameters
 */
function SeriesRow( props ) {

  const index = props.table_data.index
  const values = props.table_data.values

  // format the row data to return in onClick functions
  const row_data = {
    __index__: index[props.row_idx],
    __value__: values[props.row_idx],
  }

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
      dtype={props.table_data.dtypes[row_data['__index__']]}
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

// // An accordian row unfolds when the carot icon is selected. It retracts
// // when the carot icon is selected again. The purpose is to allow for an
// // unfolding rows to show additional options
function AccordianRow( props ){
  return <Row {...props} />
}
//
//   const [visible, setVisible] = useState(false)
//
//
//   if( props.table.accordian === undefined ) return null
//
//
//   // when the content of the accordian data is less than the
//   // row number, post warning and return the data as a standard
//   // row
//   if( props.row >= props.table.accordian.length ){
//     console.log( 'WARN - accordian data not long enough', props.row, props.table.accordian.length )
//     return <TableBodyRow {...props} />
//   }
//
//   // select an icon based on the visible flag
//   var icon = <Icon name='caret up' />
//   if( visible === true ) icon = <Icon name='caret down' />
//
//   // extract the number of columns for the specified row
//   const columns = Object.keys(props.table.data[props.row]).length
//
//   return (
//     <>
//       <Table.Row>
//         <Table.Cell
//           style={{width:'50px'}}
//           onClick={() => setVisible(!visible)}
//           >
//           {icon}
//         </Table.Cell>
//
//         <TableBodyRow
//           cellDataOnly={true}
//           {...props}
//           />
//
//       </Table.Row>
//
//       { visible ?
//         <Table.Row>
//           <Table.Cell colSpan={columns} style={{padding:'0'}}>
//             {props.table.accordian[props.row]}
//           </Table.Cell>
//         </Table.Row>
//         : null
//       }
//
//     </>
//   )
//
// }
