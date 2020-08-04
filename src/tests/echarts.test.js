/**
 * eCharts Test
 * =============
 *
 * Test the functionality of the eCharts formatter
 *
 * :Author: Nik Sumikawa
 * :Date: Aug 03, 2020

 */
global.base_dir = './';

global.abs_path = function(path) {
  return base_dir + path;
}

global.include = function(file) {
  return require(abs_path('/' + file));
}

import {data} from '../data'
import jsonArray from '../jsonArray'



// test("jsonArray : groups similar rows based on the value of the specified column", () => {
//   var json_array = new jsonArray( data.data )
//   json_array = json_array.groupby(['LOTID'])
//   expect(json_object.date.toString()).toBe('2020-07-29');
//
//
// });

//
// test("jsonArray : returns the eCharts plot object", () => {
//   var json_array = new jsonArray( data.data )
//   var scatter = json_array.plot(
//     'heatmap',
//     {colx: 'TEST_PGM',
//       coly:'SBIN_NUM',
//       value: 'RATIO'
//     } )
//
//
//   expect(json_object.date.toString()).toBe('2020-07-29');
//
//
// });


test("jsonArray : test filter functionality", () => {
  var json_array = new jsonArray( data.data );
  json_array = json_array.filter( row => row.SBIN_NUM === '260' );
  expect(json_array.length).toBe(16);
});



test("jsonArray : label when all in one class", () => {
  var json_array = new jsonArray( data.data );
  json_array = json_array.filter( row => row.SBIN_NUM === '260' );
  json_array = json_array.label( row => row.RATIO > 0.01 );
  expect(json_array.filter(row => row.label === false).length).toBe(16);
  expect(json_array.filter(row => row.label === true).length).toBe(0);
});


test("jsonArray : label when a split occurs", () => {
  var json_array = new jsonArray( data.data );
  json_array = json_array.filter( row => row.SBIN_NUM === '260' );
  json_array = json_array.label( row => row.RATIO > 0.0005 );
  expect(json_array.filter(row => row.label === false).length).toBe(6);
  expect(json_array.filter(row => row.label === true).length).toBe(10);
});


test("jsonArray : test unique ordering using string type", () => {

  const expected = [
    'UP16002',
    'UP16009',
    'UP16012',
    'ZMY02UFB1600-36',
    'ZMY02UFB1600-69'
  ]

  var json_array = new jsonArray( data.data );
  const values = json_array.unique( 'TESTER', true );
  expect(values.toString()).toBe(expected.toString());
});
