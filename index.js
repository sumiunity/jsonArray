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


import {from_file} from './pluggins/fromCsv.js'
// from_csv( 'http://localhost:8001/media/test.csv' )

const fs = require('fs');
fs.readFile('src/tests/data.csv', 'utf8', function (err, file) {
  console.log( file )
  console.log(from_file(file) )

});

// from_file( )
// const fetch = require("node-fetch");
// const parser = require("papaparse");
//
// // fs.readFile('src/data.csv', 'utf8', function (err, data) {
// //   console.log( data )
// //   var parsed = parser.parse(
// //     data,
// //     {
// //       header: true,
// //       complete: function(results) {
// //           console.log("Finished:", results.data);
// //       }
// //     }
// //   )
// // });
//
// fs.readFile('src/data.csv', 'utf8', function (err, data) {
//   console.log( data )
//   var parsed = parser.parse(
//     data,
//     {
//       header: true,
//       complete: function(results) {
//           console.log("Finished:", results.data);
//       }
//     }
//   )
//
//   console.log( '----', parsed)
// });


// const file = await fs.readFile('src/data.csv', 'utf8')
//
// var parsed = parser.parse(
//   'src/data.csv',
//   {
//     header: true,
//     complete: function(results) {
//         console.log("Finished:", results.data);
//     }
//   }
// )

// function fetchCsv() {
//     fetch('http://localhost:8001/media/test.csv').then(function (response) {
//       let reader = response.body;
//       // let decoder = new TextDecoder('utf-8');
//
//       // var parsed = parser.parse(
//       //   response,
//       //   {
//       //     complete: function(results) {
//       //         console.log("Finished:", results.data);
//       //         done()
//       //     }
//       //   }
//       // )
//
//       console.log( 'fetch response', reader)
//         // let reader = response.body.getReader();
//         // let decoder = new TextDecoder('utf-8');
//         //
//         // return reader.read().then(function (result) {
//         //     return decoder.decode(result.value);
//         // });
//       return 'hello'
//     });
// }

// console.log( fetchCsv() )
// var parsed = parser.parse(
//   './tests/data.csv',
//   {
//     complete: function(results) {
//         console.log("Finished:", results.data);
//     }
//   }
// )

// const fs = require('fs')
// var parsed = parser.parse(
//   fs.createReadStream( './tests/data.csv' ),
//   {
//     complete: function(results) {
//         console.log("Finished:", results.data);
//         done()
//     }
//   }
// )
// console.log( parsed )
// console.log( parsed )
// console.log( 'array', typeof array )
// console.log( Object.getOwnPropertyNames(array[0]) )
// console.log( Object.keys(array[0]) )
//
// array[0]['test'] = array[0][0]
//
// delete array[0][0]
// array[0].splice[0]





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
