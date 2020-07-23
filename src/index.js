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



var json_array = new jsonArray( data.data )
json_array = json_array.groupby(['LOTID'])
// json_array = json_array.strptime('ENDTIME')
// var scatter = json_array.plot(
//   'heatmap',
//   {colx: 'TEST_PGM',
//     coly:'SBIN_NUM',
//     value: 'RATIO'
//   } )
//
console.log( json_array )
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
