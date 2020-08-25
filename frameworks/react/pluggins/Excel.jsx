/*!

*/


import React, {useState} from "react";

import {ExcelRenderer} from 'react-excel-renderer';

import {Button, Input} from '../framework/Components'

import jsonArray from '../../../jsonArray'

export default class Excel{


  constructor( props={} ) {

    this.props = props

    this.parameters = {
      tableName: 'excel',
      button: undefined,
      buttonProps: {},
      buttonStyle: {},
      input: undefined,
      inputProps: {},
      inputStyle: {},
    }


  }

  // returns the React components used to select the csv file for parsing
  // and to display the name of the file in an input component
  render(){

    var fileInputRef = React.createRef();

    // internal variable to tracke the sorted column and sort order
    const [filename, setFilename] = useState('')


    return (
      <>
        <Button
          {...this.parameters.buttonProps}
          Component= {this.parameters.button}
          style={this.parameters.buttonStyle}
          onClick={() => fileInputRef.current.click()}
          defaultValue='Upload'
          />

        <input
          type="file"
          hidden
          ref={fileInputRef}
          onChange={(event) => this.fileHandler(event, setFilename) }
          onClick={(event)=> { event.target.value = null }}
          style={{"padding":"10px"}} />


        <Input
          {...this.parameters.inputProps}
          Component= {this.parameters.input}
          style={this.parameters.inputStyle}
          type="text"
          className="form-control"
          value={filename}
          readOnly
          style={{"paddingTop":"0px"}}
          />
      </>
    )

  }

  // parses the selected file. An error is thrown when this
  // routine fails. Otherwise a jsonArray object is returned
  // via the callback function
  fileHandler( event, setFilename ){

    if(event.target.files.length){

      const fileObj = event.target.files[0];
      setFilename( fileObj.name )

      ExcelRenderer(fileObj, (err, response) => {

        if(err){
          alert('csv parsing error: ' + err);
        }
        else{

          var data = response.rows
          var columns

          // assume that the first row contains a header
          if( this.props.header !== false ){
              columns = data[0]
              data = data.splice(1)
          }

          // convert the data to a json array
          const json_array = new jsonArray(data)

          // set the column names when defined
          if( columns !== undefined ) json_array.columns = columns


          if( this.props.callback !== undefined ){
            this.props.callback( json_array )
          }
        }
      });
    }

  }


}
