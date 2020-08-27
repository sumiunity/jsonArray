/*!

*/


import React from "react";

import {ExcelRenderer} from 'react-excel-renderer';

import {Button, Input} from '../framework/Components'

import jsonArray from '../../../jsonArray'

// export default function DefaultFunction(){ console.log('not implemented')}

export default class Excel extends React.Component{


  constructor( props ) {
    super(props)

    this.state = { name: 'excel', filename: '' }
  }

  // returns the React components used to select the csv file for parsing
  // and to display the name of the file in an input component
  render(){

    var fileInputRef = React.createRef();

    return (
      <>
        <Button
          {...this.props.buttonProps}
          component= {this.props.button}
          key={`${this.state.name}-Button`}
          style={this.props.buttonStyle}
          onClick={() => fileInputRef.current.click()}
          defaultValue='Upload'
          />

        <input
          key={`${this.state.name}-hidden-input`}
          type="file"
          hidden
          ref={fileInputRef}
          onChange={(event) => this.fileHandler(event) }
          onClick={(event)=> { event.target.value = null }}
          style={{"padding":"10px"}} />


        <Input
          {...this.props.inputProps}
          component= {this.props.input}
          style={this.props.inputStyle}
          key={`${this.state.name}-input`}
          type="text"
          className="form-control"
          value={this.state.filename}
          readOnly
          style={{"paddingTop":"0px"}}
          />
      </>
    )

  }

  // parses the selected file. An error is thrown when this
  // routine fails. Otherwise a jsonArray object is returned
  // via the callback function
  fileHandler( event ){

    if(event.target.files.length){

      const fileObj = event.target.files[0];
      this.setState( {filename: fileObj.name} )

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
