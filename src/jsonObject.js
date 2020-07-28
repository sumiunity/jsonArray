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


import moment from 'moment';

import jsonArray from './jsonArray'
const debug = false


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

    if( !(this[key] instanceof moment) ){
      this[key] = moment(this[key])
    }
    return this
  }

  // converts the datetime attribute to a the specified
  // date format. when the attribute is not a datetime
  // format, it is first convert before converting to
  // a string
  strftime( key, format='YYYY-MM-DD' ){

    // convert to moment datetime if not already done so
    this.strptime( key )

    this[key] = this[key].format(format)

    return this
  }

  // adds time to the date attribute. the key is converted
  // to moment type if it is not already
  timedelta( key, params={}){

    // convert to moment datetime if not already done so
    this.strptime( key )

    const param_keys = Object.keys( params )
    for( var i=0; i < param_keys.length; i++ ){
      const pkey = param_keys[i]
      this[key] = this[key].add(params[pkey], pkey)

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
