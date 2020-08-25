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


import jsonArray from '../../../jsonArray'

var SemanticUI
try{ SemanticUI = require('semantic-ui-react') }catch{}


export default class jsonSemanticUI {

  // ensure that the data read in is of jsonArray type
  // and store it as a local variable
  constructor(array) {

    this.json_array = array

    // ensure that the value is jsonArray
    if( !(array instanceof jsonArray) ){
      this.json_array = new jsonArray( array );
    }
  }

  dropdown(col, ascending=true){

    var dropdown = []
    // retrieve the unique calues from the specified column
    const values = this.json_array.unique( col, ascending )

    var dropdown = []

    // push the values into the array formatted for the dropdown menu
    values.forEach( element => dropdown.push({
       key:  element, text: element, value: element
    }) )

    return dropdown
  }


  // returns a table formatted using the Semantic UI table Framework
  get table(){
    var table = this.json_array.react.table

    if( SemanticUI === undefined ) return table
    table.parameters.table = SemanticUI.Table
    table.parameters.th = SemanticUI.Table.HeaderCell
    table.parameters.thead = SemanticUI.Table.Header
    table.parameters.td = SemanticUI.Table.Cell
    table.parameters.tr = SemanticUI.Table.Row
    table.parameters.body = SemanticUI.Table.Body

    table.parameters.button = SemanticUI.Table.Button
    table.parameters.image = SemanticUI.Table.Image
    return table
  }

  // returns the excel reader using teh Semantic UI Framework for input controls
  excel(callback){

    var excel = this.json_array.react.excel(callback)
    if( SemanticUI === undefined ) return excel

    excel.parameters.button = SemanticUI.Button
    excel.parameters.buttonStyle = {margin:0}
    excel.parameters.buttonProps = {color: 'blue'}

    excel.parameters.input = SemanticUI.Input
    excel.parameters.inputStyle = {}
    excel.parameters.inputProps = {icon: 'file', placeholder: 'xlsx, csv, ...' }

    return excel
  }
}
