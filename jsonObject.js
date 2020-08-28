/**
 * JSON Object
 * ===============
 *
 * Class that aggregates common functions performed
 * on json objects
 *
 * :Author: Nik Sumikawa
 * :Date: April 29, 2020
 */


import datetime from './data_types/datetime';

import jsonArray from './jsonArray'


export default class jsonObject extends Object {

  constructor(data) {
    super()


    const keys = Object.keys(data)

    // copy over the content from the input data
    for( var index in keys ){
      const key = keys[index]
      this[key] = data[key]
    }

  }

  // TODO: search for all columns in the Array
  get columns(){ return Object.keys(this) }
  get keys(){ return Object.keys(this) }

  // converts the specified key to a datetime attribute
  strptime( key ){

    if( !(this[key] instanceof datetime) ){
      this[key] = datetime(this[key])
    }
    return this
  }


  // convert the json Object to a two dimensional json array
  to_jsonArray( key_name, value_name ){

    var array = []
    const keys = this.columns

    // set defaults for the key and value attributes
    if( key_name === undefined ) key_name = 'key'
    if( value_name === undefined ) value_name = 'value'

    // convert the json object into a json array
    for( var i=0; i < keys.length; i++ ){
      array.push( {
        [key_name]: keys[i],
        [value_name]: this.json_object[keys[i]]
      })
    }

    return new jsonArray(array)

  }


}
