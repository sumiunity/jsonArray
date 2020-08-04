global.base_dir = './';

global.abs_path = function(path) {
  return base_dir + path;
}

global.include = function(file) {
  return require(abs_path('/' + file));
}

import {data} from './data'
import jsonArray from './jsonArray'
import jsonObject from './jsonObject'

import moment from 'moment';
import datetime from './data_types/datetime'

import jsonSemanticUI from './framework/SemanticUI'
// import hello from './src/test'
// import hello from 'test'
// include( 'data.js')
//
// console.log( 'test123' )
// console.log( data)


//
// var json_array = new jsonArray( data.data )
// console.log( json_array.unique('TESTER', true) )

var semanticUI = new jsonSemanticUI( data.data )
semanticUI.dropdown('TESTER')


// json_array = json_array.filter( row => row.SBIN_NUM === '260' )
//
//
// json_array = json_array.label( row => row.RATIO > 0.0005 )
// console.log( json_array.filter(row => row.label === false).length )
// console.log( json_array.filter(row => row.label === true).length )

// json_array = json_array.strptime('ENDTIME')
// var scatter = json_array.plot(
//   'heatmap',
//   {colx: 'TEST_PGM',
//     coly:'SBIN_NUM',
//     value: 'RATIO'
//   } )



// console.log( json_array )
// console.log( json_array.scatter('ENDTIME', 'SBIN_NUM' ) )

//
// var bin_array = json_array.filter( row => row.SBIN_NUM === '260')
// // console.log(bin_array)
// // json_array.test()
// // console.log( json_array.map('TEST') )
// // console.log( json_array.map('TEST') instanceof jsonArray )
//
// // console.log( bin_array.boxplot('LOADBOARD', 'Bin Yield') )
// console.log( bin_array.combine( ['BIN_TYPE', 'SORT'], 'TESTCOL', '--' ))
// console.log( 'finished' )
