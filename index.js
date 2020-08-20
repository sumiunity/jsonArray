global.base_dir = './';

global.abs_path = function(path) {
  return base_dir + path;
}

global.include = function(file) {
  return require(abs_path('/' + file));
}

import {data, array} from './tests/data'
import jsonArray from './jsonArray'
import jsonObject from './jsonObject'

import moment from 'moment';
import datetime from './data_types/datetime'

import jsonSemanticUI from './frameworks/react/framework/SemanticUI'


// import {from_csv} from './pluggins/jsontocsv.js'
// from_csv( 'https://raw.githubusercontent.com/sumiunity/jsonArray/v0.0.0/tests/data.csv' )

// console.log( 'array', typeof array )
// console.log( Object.getOwnPropertyNames(array[0]) )
// console.log( Object.keys(array[0]) )
//
// array[0]['test'] = array[0][0]
//
// delete array[0][0]
// array[0].splice[0]

// var semanticUI = new jsonSemanticUI( data )
// console.log( new Object(array[0]) )
// var temp = JSON.parse(JSON.stringify(array))
// temp[0]['x'] = 1
// temp[0] = new Object({...temp[0]})
// console.log( temp[0] )
// temp = JSON.parse(JSON.stringify(temp))
// console.log( temp[0] )
// console.log( JSON.parse(JSON.stringify(array)) )
var json_array = new jsonArray( array )
console.log( json_array[0] )
//
console.log( 'json2')
const json_array2 = new jsonArray( json_array )
console.log( json_array2[0] )
// json_array = json_array.rename( {'0': 'A'})
json_array.columns = ['A', 'B']
console.log( json_array)
// json_array = json_array.rename({0:'col', 'AREA': 'area'})




// console.log( json_array[0][0] )
// json_array = json_array.strftime('TIME')
// var pivot = json_array.pivot_table( 'TIME', 'CATEGORY1', 'unique', 'CATEGORY2')
// console.log( pivot )
//
// //
// // json_array.strptime('TIME')
// // console.log( json_array.dtypes )
// //
// //
// // var json_array1 = new jsonArray( json_array )
// // console.log( json_array1.dtypes )
// // const json_array1 = json_array.dtype('TIME', 'week'
// //
// //
// //
// const data_types = new DataTypes( data )
// data_types.parse(data)
// console.log( data_types )

// var json_table = new jsonArrayTable( data )
// var header = json_table.table()
//
//



// var series = new echartsSeries( json_array )
// series = series.bar(['VALUE', 'id'], {stacked: true})
// console.log( series )
//
// var options = new echartsOptions( json_array )
// options.bar({colx: 'TIME', coly: ['VALUE', 'id'], stacked:true} )
// console.log( options )
