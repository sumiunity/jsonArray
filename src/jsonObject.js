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

import jsonArray from './jsonArray'
const debug = false


export default class jsonObject {

  constructor(json_object) {

    this.json_object = json_object
  }

  // TODO: search for all columns in the Array
  get columns(){ return Object.keys(this.json_object) }

  // convert the json Object to a two dimensional json array
  to_jsonArray( key_name, value_name ){

    var array = []
    const keys = this.columns

    console.log('i got here...', key_name, value_name)
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
