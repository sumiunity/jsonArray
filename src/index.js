global.base_dir = './';

global.abs_path = function(path) {
  return base_dir + path;
}

global.include = function(file) {
  return require(abs_path('/' + file));
}

import {data} from './tests/data'
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


import echartsSeries from './plot/echarts/series'
import echartsOptions from './plot/echarts/options'

var json_array = new jsonArray( data )

console.log( json_array[0])

var json_array1 = json_array.strftime('TIME')

console.log( json_array[0].TIME instanceof moment  )
console.log( json_array[0])
console.log( json_array1[0].TIME instanceof moment  )
console.log( json_array1[0])
// // json_array.label( row => row.VALUE > 0.0005,  )
// console.log( 'label1')
// console.log( json_array[0] )
// var json_array1 = json_array.label( row => row.id === 0, {value:'MARKED'} )
// console.log( json_array[0] )
// console.log( json_array1[0] )
//
// //
// //
// var json_array1 = json_array.label( row => row.id === 7, {value:'MARKED'} )
// console.log( json_array[0] )
// console.log( json_array[1] )
// console.log( json_array1[0] )
// console.log( json_array1[1] )

// // console.log( 'label2')
// // json_array = json_array.label( row => row.VALUE > 0.0005 )
// // console.log( json_array[0] )
// // json_array = json_array.replace( 'CATEGORY1', {UP16009: 'NEW'} )
// // console.log( json_array )
//
// var options = new echartsOptions( json_array )
// // options.boxplot({colx: 'CATEGORY1', coly: 'id', label:'label'} )
// // console.log( options )
//
// options.scatter({colx: 'CATEGORY1', coly: 'id', label:'label'} )
// // console.log( options )
// //
//
//
// json_array = json_array.label( row => row.VALUE > 0.0005 )
// // console.log( json_array )
//
// // var series = new echartsSeries( json_array )
// // series = series.scatter_by('VALUE', 'id', 'label')
//
//


// var json_array = new jsonArray( data )
//
// console.log( json_array )
//
// json_array = json_array.drop_columns( ['VALUE'] )
// console.log( json_array.columns )
//   'MASK',
//   'WP_LOTID',
//   'SORT',
// 'PRODUCT',
// 'TEST_PGM',
// 'FACILITY',
// 'PACKAGE',
// 'LOTID',
// 'HANDLER'
// ])
//
// json_array = json_array.rename({
//   RATIO: 'VALUE',
//   __index__: 'id',
//   TESTER: 'CATEGORY1',
//   LOADBOARD: 'CATEGORY2',
//   ENDTIME: 'TIME',
//   BIN_TYPE: 'TYPE',
//   SBIN_NUM: 'NUMBER'
// })
// console.log( json_array )

// var semanticUI = new jsonSemanticUI( data.data )
// semanticUI.dropdown('TESTER')


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
