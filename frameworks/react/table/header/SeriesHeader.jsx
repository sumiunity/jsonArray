/**
 * Table Column Framework
 * =======================
 *
 * Add functionality to the base table driver to allow for
 * column header generation
 *
 *  @author Nik Sumikawa
 *  @date Aug 4, 2020
 */



import React from 'react';

import {HeaderCell, Header, Row} from '../../framework/Components'



/**
 * Returns the Table Header for data in Series Format
 * @param       {Object} props Parameter object
 * @constructor
 */
export default function SeriesHeader( props ) {

  // do not render header when visible is turned off
  if( props.showHeader === false ) return null

  var data = props.table_data

  // attempt to pull the name out of the series. Default to
  // value when it's not available
  var name = data.name
  if( name === undefined ) name = 'value'

  var row = []
  const columns = ['', name]

  for (var i=0; i < columns.length; i++ ){
      //retrieve the column name from the data structure
      var col = columns[i]


      var headerCellOnClick = null
      if( props.columnOnClick !== undefined ){
        // persist the onClick inputs to avoid mutation
        const col_name = col
        const col_number = i
        headerCellOnClick = () => props.columnOnClick({
          col_name: col_name,
          col_number: col_number
        })
      }

      //populate the header cell
      row.push(
        <HeaderCell
          {...props.thProps}
          style={{...{textAlign:'center'}, ...props.thStyle}}
          component={props.th}
          defaultValue = {col}
          key = {`${props.tableName}-th-${i}`}
          onClick={headerCellOnClick}
          />
      )

  }

  // define the header row
  const headerrow = (
    <Row
      {...props.trProps}
      style={{...{textAlign:'center'}, ...props.trStyle}}
      component={props.tr}
      defaultValue={row}
      key={`${props.tableName}-headerrow`}
      />
  )


  return (
      <Header
        {...props.theadProps}
        style={{...{textAlign:'center'}, ...props.theadStyle}}
        component={props.thead}
        defaultValue={headerrow}
        key = {`${props.tableName}-thead`}
        />
    );

}
