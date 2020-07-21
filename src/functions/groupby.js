/**
 * JSON Array Groupby
 * =====================
 *
 * groups json objects in an array based on an array of keys. A
 * JSON object is returned with values for each split and the
 * data placed in the 'json_obj' key
 *
 * :Author: Nik Sumikawa
 * :Date: Feb 4, 2020
 */

import jsonArray from '../jsonArray'

const debug = false

export default function groupby( json_obj, atts, keys ){

  // append the keys with the json object
  if( atts.length === 0 ){
    keys['json_obj'] = new jsonArray(json_obj)
    keys['count'] = json_obj.length
    return keys
  }

  // initial conditions for keys
  if( keys === undefined ){ keys = {} }

  var results = []

  if(debug) console.log( 'groupby----', atts[0], json_obj)

  const values = [...new Set(json_obj.map(row => row[atts[0]]))]
  for( var i=0; i < values.length; i++ ){
    const group = json_obj.filter( row => row[atts[0]] === values[i] )

    // deep copy the keys and append with the current key
    var temp_keys = Object.assign({}, keys)
    temp_keys[atts[0]] = values[i]

    results = results.concat( groupby(group, atts.slice(1),  temp_keys) )
  }

  return results
}
