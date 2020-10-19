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

import ReactLibraryFramework from '../ReactLibraryFramework'

var SemanticUI
try{ SemanticUI = require('semantic-ui-react') }catch{}


export default class SemanticUILibrary extends ReactLibraryFramework{
  constructor(data){
    super(data)

    // must bind this to all internal functions or they will be
    // lost when rendering via react
    this.Excel = this.Excel.bind(this)
    this.Table = this.Table.bind(this)
    this.Dropdown = this.Dropdown.bind(this)
    this.ToCsv = this.ToCsv.bind(this)

  }

  Excel( props ){
    return Excel( this.props(props) )
  }

  Table( props ){
    return Table( this.props(props) )
  }

  Dropdown( props ){
    return Dropdown( this.props(props) )
  }

  ToCsv( props ){
    const fileIO = require('../plugins/fileIO')
    return fileIO.ToCsv( {...this.props(props), ...{button: SemanticUI.Button}})
  }


}


// returns the excel reader using teh Semantic UI Framework for input controls
export function Excel( props ){

  var Excel = props.data.react.Excel

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

  var Table = props.data.react.Table

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
      icon = {SemanticUI.Icon}
      />
    )

}


export function Dropdown( props ){

  // set ascending order as a default for dropdown content
  var ascending = true
  if( props.ascending !== undefined ) ascending = props.ascending

  // retrieve the unique calues from the specified column
  var values
  switch( props.plottype ){
    case 'column':
      values = props.data.columns
      break

    case 'value' :
      values = props.data.unique( props.column, ascending )
      break

    default :
      values = props.data.unique( props.column, ascending )
      break
  }

  var options = []

  // push the values into the array formatted for the dropdown menu
  values.forEach( element => options.push({
     key:  element, text: element, value: element
  }) )

  const child_props = props
  delete child_props.data

  return(
    <SemanticUI.Form.Field
      {...child_props}
      key={`dropdown-${props.column}`}
      control={SemanticUI.Select}
      label={props.column}
      options={options}
      search={true}
      clearable={true}
      placeholder={props.column}
    />
  )
}

// <SemanticUI.Dropdown
//   {...child_props}
//   options={options}
//   key={`dropdown-${props.column}`}
//   />
