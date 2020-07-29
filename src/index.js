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


var json_object = new jsonObject({a: 1, b: 2, c: 3, date:'2020-07-29'})
// console.log( json_object )
// console.log( json_object.timedelta('date', {days:-10}).strftime('date') )
// json_object.strptime( 'date' )
// console.log( json_object )
json_object.strptime('date')
console.log("Original: " + json_object.date.toString());
console.log("Extended: " + json_object.date.timedelta({days:2}).toString());
console.log("Original: " + json_object.date.toString());




const test = datetime('2020-07-01')
console.log("Original: " + test.toString());
console.log("Extended: " + test.timedelta({days:2}).toString());
console.log("Original: " + test.toString());

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
