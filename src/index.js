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

import {dev_data} from './devdata'

var json_array = new jsonArray( data)
const json_array1 = json_array.dtype('TIME', 'week')

console.log( json_array[0] );
console.log( json_array1[0] );



// var series = new echartsSeries( json_array )
// series = series.bar(['VALUE', 'id'], {stacked: true})
// console.log( series )
//
// var options = new echartsOptions( json_array )
// options.bar({colx: 'TIME', coly: ['VALUE', 'id'], stacked:true} )
// console.log( options )
