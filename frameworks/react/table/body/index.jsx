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

import Series from '../../../../Series'

import {Body, Row as TableRow} from '../../framework/Components'

import Row from './Row'
import SeriesRow from './SeriesRow'
import AccordianRow from './AccordianRow'
import MultiRow from './MultiRow'

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

  // change component types to MultiRow when the multirow props are present
  if( props.multirow !== undefined ){
    Component = MultiRow
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
