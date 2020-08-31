/**
 * Index
 * ================
 *
 * File used for development of js scripts hosted by nodejs
 *
 * :Author: Nik Sumikawa
 * :Date: Aug 31, 2020
 */

global.base_dir = './';

global.abs_path = function(path) {
  return base_dir + path;
}

global.include = function(file) {
  return require(abs_path('/' + file));
}

import jsonArray from './src/jsonArray'
import {data} from './src/tests/data'





console.log( 'boom working' )

var json_array = new jsonArray( data )

json_array = json_array.astype({VALUE: 'percentage'})
json_array = json_array.set_index('id')
// console.log( json_array.toString() )

console.log( json_array.strFormat.value(0, 'VALUE') )
