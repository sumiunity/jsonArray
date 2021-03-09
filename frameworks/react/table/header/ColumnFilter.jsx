/**
 * Column Filter
 * ==============
 *
 * adds a dropdown menu to the column header, that can
 * be used to filter the column contents
 *
 * @author Nik Sumikawa
 * @Date Dec 1, 2020
 *
 */

import React from 'react';

import _ from 'lodash'

import { Dropdown, Segment } from 'semantic-ui-react'

export default function ColumnFilter( props ){

  const unique_values = props.data.unique([props.col])
  const options = unique_values.map(r => {
    return {
      key:`${r}-${_.uniqueId()}`,
      text:`${r}`,
      value:`${r}`,
      style: {fontSize:'12px', padding: '0px', margin:0}
    }})

  var headerCellOnClick = null
  if( props.columnOnClick !== undefined ){
    // persist the onClick inputs to avoid mutation
    headerCellOnClick = () => props.columnOnClick({
      col_name: props.col,
      col_number: props.col_number
    })
  }


  var columnFilterOnChange = null
  if( props.columnFilterOnChange !== undefined ){
    // persist the onClick inputs to avoid mutation
    columnFilterOnChange = (e, val) => props.columnFilterOnChange({
      col_name: props.col,
      col_number: props.col_number,
      value: val.value
    })
  }

  var filterValues
  if( props.filters !== undefined ){
    filterValues = (props.filters
      .filter(r => r.col_name === props.col)
      .map(r => r.value)
    )

    if( filterValues.length === 0 ){
      filterValues = undefined
    }else{
      filterValues = filterValues[0]
    }
  }


  return(
    <Segment.Group
      key={`Header-SeggyGroup-${props.col}`}
      raised={false}
      compact

      style={{
        width:'100%',
        padding:0,
        margin:0,
        boxShadow: 'none',
        border: '0',
        backgroundColor:'transparent'}}>

      <Segment
        key={`Header-Title-${props.col}`}
        basic
        textAlign='center'
        onClick={headerCellOnClick}
        style={{
          padding:0,
          margin:0,
          backgroundColor:'transparent',
          border: '0'}} >
        {props.col}
      </Segment>

      <Segment
        key={`Header-Filter-${props.col}`}
        basic
        textAlign='center'
        style={{
          padding:0,
          margin:0,
          backgroundColor:'transparent',
          border: '0'}}
        >

        <Dropdown
          key={`Header-Dropdown-${props.col}}`}
          style={{
            margin:0,
            padding:'0',
            maxWidth: '100px',
            minHeight: '10px',
            fontSize: '10px',
            backgroundColor: '#e5faf9',
            color: '#212121'
          }}
          placeholder={'filter...'}
          multiple
          selection
          onChange={columnFilterOnChange}
          options={options}
          icon= {'none'}


          />
      </Segment>
    </Segment.Group>


  )
}
