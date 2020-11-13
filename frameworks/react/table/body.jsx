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
import jsonArray from '../../../jsonArray'


export default function TableBody( props ) {

  const [selectedRow, setSelectedRow] = useState(props.selectedRow)
  const [onHover, setOnHover] = useState(false)

  // default to using the DataFrame Row Format
  var Component = Row
  var rows = props.table_data.length

  // when lazy loading is implemented, limited the number of rows to render
  if( (props.lazyLoading === true)&(props.renderedRows < rows) ){
    rows = props.renderedRows
  }

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
        setSelectedRow = {(value) => setSelectedRow(value)}
        />
    )
  }

  // add a row to show more rows, when there are more rows to show
  if( (props.lazyLoading === true)&(props.renderedRows < props.table_data.length) ){
    body.push(
      <TableRow
        {...props.trProps}
        style={{...props.trStyle}}
        component={props.tr}
        key={`${props.tableName}-row--lazyloading`}
        onClick={() => {
          const step = (props.lazyLoadingStep === undefined ? 100 : props.lazyLoadingStep)
          props.setRenderedRows(props.renderedRows + step)
        }}
        defaultValue={
          <td
            onMouseOver={()=>setOnHover(true)}
            onMouseOut={()=>setOnHover(false)}
            style={{backgroundColor: (onHover ? '#AFEEEE' : '#F0FFFF')}}
            colSpan={props.columns.length}>
            <h3>show more rows</h3>
          </td>
        }
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

    const row_data = props.table_data[props.row_idx]
    const row = []
    for (var i=0; i < props.columns.length; i++ ){
      const col = props.columns[i]
      row.push(
        <Cell
          {...props}
          row={row_data}
          value={row_data[col]}
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
          row_data: row_data
        })
      }
    }

    // set the background color when the row is selected
    var rowStyle = {textAlign:'center'}
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

/**
 * Accordian Tables are available after performing the groupby
 * function, where both metadata and the json object are available
 * based on the split.
 *
 * The accordian table shows the data based on the split described
 * by the parent table
 * @param       {[type]} props [description]
 * @constructor
 */
function AccordianRow( props ){

  // state variable to track the visibility state of the accordian
  const [visible, setVisible] = useState(false)

  const row_data = props.table_data[props.row_idx]

  // map the rowOnClick function to cellonClick to
  // disable the onClick function of the icon row
  var cellOnClick = {}
  if( props.rowOnClick !== undefined ){
    for( var i=0; i < props.columns.length; i++ ){
      cellOnClick[props.columns[i]] = () => {
        props.setSelectedRow( props.row_idx );
        props.rowOnClick({
          row: props.row_idx,
          row_data: row_data,
        })
      }
    }
  }

  // console.log( props.selectedRow, props)
  // set the background color when the row is selected
  var rowStyle = {textAlign:'center'}
  if( props.row_idx === props.selectedRow ){
    rowStyle = {textAlign:'center', backgroundColor: '#8c9ac0'}
  }

  // select an icon based on the visible flag
  var icon = '^'
  if( visible === true ) icon = '>'


  var AccordianTable = new jsonArray(row_data.json_obj)

  // when provided, apply the the function to transform the subgroup
  if( props.accordianFunc !== undefined) AccordianTable = props.accordianFunc(AccordianTable)

  var columns = AccordianTable.columns
  if( props.accordianColumns !== undefined ) columns = props.accordianColumns

  return (
    <>
      <TableRow
        {...props.trProps}
        style={{...rowStyle, ...props.trStyle}}
        component={props.tr}
        key={`${props.tableName}-row--${props.row_idx}`}
        defaultValue={
          <>
            <Cell
              {...props}
              style={{maxWidth:'50px'}}
              row={props.row_idx}
              value={icon}
              dtype={'icon'}
              key={`${props.tableName}-accordian-control-${props.row_idx}`}
              col = {'accordianEnable'}
              onClick={() => {setVisible(!visible)} }
              />

            <Row
              {...props}
              cellContentOnly={true}
              cellOnClick={cellOnClick}
              />
          </>
        }
        />



        { visible ?
          <TableRow
            {...props.trProps}
            component={props.tr}
            key={`${props.tableName}-accordian-row-${props.row_idx}`}
            defaultValue={
              <Cell
                {...props}
                tdProps={{colSpan:4}}
                tdStyle={{margin:0, padding:0}}
                row={props.row_idx}
                dtype={'table'}
                key={`${props.tableName}-accordian-dropodwn-${props.row_idx}-${-1}`}
                col = {'accordianTable'}
                value={
                  <AccordianTable.react.semanticUI.Table
                    {...props.accordianProps}
                    tableName={`accordianTable - ${props.row_idx}`}
                    tableStyle={{padding:0, margin:0}}
                    columns={columns}
                    tdStyle={{margin:0, padding:0}}
                    showHeader={props.accordianHeader}
                    />
                }
                />


            }
            />
          : null
        }


    </>
  )

}
// <Table.Row>
//   <Cell
//     {...props}
//     row={-1}
//     value={icon}
//     dtype={'icon'}
//     key={`${props.tableName}-cell-${props.row_idx}-${-1}`}
//     col = {'accordianEnable'}
//
//     >
//     {icon}
//   </Cell>
//
//   <Row {...props} />
//
// </Table.Row>
