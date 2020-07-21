global.base_dir = './';

global.abs_path = function(path) {
  return base_dir + path;
}

global.include = function(file) {
  return require(abs_path('/' + file));
}

import {data} from './data'
import jsonArray from './jsonArray'
// import hello from './src/test'
// import hello from 'test'
// include( 'data.js')
//
// console.log( 'test123' )
// console.log( data)
//
//
var json_array = new jsonArray( data.data )

// var bin_array = json_array.filter( row => row.SBIN_NUM === '260')
console.log( json_array.test() )

// console.log( bin_array.boxplot('LOADBOARD', 'Bin Yield') )
console.log( 'finished' )
