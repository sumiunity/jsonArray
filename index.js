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
import echartsSeries from './plot/echarts/series'
import echartsOptions from './plot/echarts/options'

import DataTypes from './data_types/dtypes'
import {dev_data} from './devdata'

import jsonArrayTable from './table/table'



// var json_array = new jsonArray( data );
// json_array = json_array.unique('ARRAY')
// console.log(json_array)

var semantic = new jsonSemanticUI( data )
var dropdown = semantic.dropdown('ARRAY')
console.log( dropdown )


//
// var json_array = new jsonArray( data)
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
