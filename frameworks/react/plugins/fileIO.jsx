/**
 * File Input/Output Interface
 * ==============================
 *
 * React component used to retrieve from and store to the user's
 * desktop
 *
 * :Author: Nik Sumikawa
 * :Date: Oct 7, 2020
 */


import React from 'react';
import ReactLibraryFramework from '../ReactLibraryFramework'

import {Button} from '../framework/Components'

const extract = require('../../fileIO/extract')



export default class FileIOLibrary extends ReactLibraryFramework{
  constructor(data, props={}){
    super(data, props)

    // must bind this to all internal functions or they will be
    // lost when rendering via react
    this.ToCsv = this.ToCsv.bind(this)


  }

  ToCsv( props ){
    return ToCsv( this.format_props(props) )
  }

}




/**
 * Returns a heatmap plotting component based on the contents of the
 * jsonArray DAtaFrame
 */
export function ToCsv( props ){

  // set defaults for the button label and filename and
  // overwrite the defaults when values are passed in
  var value = 'Download'
  if( props.value !== undefined ) value = props.value

  var filename = 'file.csv'
  if( props.filename !== undefined ) value = props.filename

  return(
    <Button
      {...props}
      style={{...{textAlign:'center'}, ...props.buttonStyle}}
      component={props.button}
      key={`toCSV Button`}
      defaultValue={value}
      onClick={() => extract.toCsv(props.data, filename )}
      />
  )
}
