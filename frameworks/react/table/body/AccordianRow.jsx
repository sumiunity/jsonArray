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

import Cell from '../cell'
import {Row as TableRow} from '../../framework/Components'
import jsonArray from '../../../../jsonArray'

import Row from './Row'

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
export default function AccordianRow( props ){

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



  var AccordianTable = row_data.json_obj

  // when provided, apply the the function to transform the subgroup
  if( props.accordianFunc !== undefined) AccordianTable = props.accordianFunc(AccordianTable)

  var columns = AccordianTable.columns
  if( props.accordianColumns !== undefined ) columns = props.accordianColumns

  // select an icon based on the visible flag
  var iconOnClick = () => {setVisible(!visible)}
  var icon = 'caret right'
  if( visible === true ) icon = 'caret down'
  if( AccordianTable.length === 0 ){
    icon = 'ellipsis horizontal'
    iconOnClick = () => {console.log('no data to unfold')}
  }

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
              tdProps={{rowSpan:(visible) ? 2 : 1}}
              style={{maxWidth:'50px'}}
              row={props.row_idx}
              value={icon}
              dtype={'icon'}
              key={`${props.tableName}-accordian-control-${props.row_idx}`}
              col = {'accordianEnable'}
              onClick={iconOnClick}
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
                tdProps={{colSpan:props.columns.length}}
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
                    thStyle={{margin:0, padding:0}}
                    tdStyle={{margin:0, padding:0}}
                    showHeader={props.accordianHeader}
                    radius={10}
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
