/**
 * Semantic UI Framework
 * =======================
 *
 * Extends the jsonArray functionality to include specific
 * functions for formatting semantic UI components
 *
 * :Author: Nik Sumikawa
 * :Date: Aug 4, 2020
 */


import React from "react";

import jsonArray from '../../../jsonArray'

var SemanticUI
try{ SemanticUI = require('semantic-ui-react') }catch{}



var json_array

// Sets the global json array value with the provided data. Checks
// to ensure that the data is the proper type and converts it if
// it is not
export function set( array ){

  json_array = array
  // ensure that the value is jsonArray
  if( !(array instanceof jsonArray) ){
    json_array = new jsonArray( array );
  }
}


// returns the excel reader using teh Semantic UI Framework for input controls
export function Excel( props ){

  var Excel = json_array.react.Excel

  if( SemanticUI === undefined ){
    return <Excel />
  }

  return(
    <Excel
      {...props}
      button = {SemanticUI.Button}
      buttonStyle = {{margin:0}}
      buttonProps = {{color: 'blue'}}

      input = {SemanticUI.Input}
      inputStyle = {{margin:0}}
      inputProps = {{icon: 'file', placeholder: 'xlsx, csv, ...' }}
      />
    )
}



// returns a table formatted using the Semantic UI table Framework
export function Table(props){
  
  var Table = new jsonArray(json_array).react.Table

  if( SemanticUI === undefined ) return Table

  return(
    <Table
      {...props}
      table = {SemanticUI.Table}
      th = {SemanticUI.Table.HeaderCell}
      thead = {SemanticUI.Table.Header}
      td = {SemanticUI.Table.Cell}
      tr = {SemanticUI.Table.Row}
      body = {SemanticUI.Table.Body}

      button = {SemanticUI.Table.Button}
      image = {SemanticUI.Table.Image}
      />
    )

}


export function Dropdown( props ){

  // set ascending order as a default for dropdown content
  var ascending = true
  if( props.ascending !== undefined ) ascending = props.ascending

  // retrieve the unique calues from the specified column
  const values = json_array.unique( props.column, ascending )

  var options = []

  // push the values into the array formatted for the dropdown menu
  values.forEach( element => options.push({
     key:  element, text: element, value: element
  }) )

  return(
    <SemanticUI.Dropdown
      {...props}
      options={options}
      key={`dropdown-${props.column}`}
    />
  )
}
