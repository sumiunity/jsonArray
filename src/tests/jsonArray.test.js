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

import {data} from './data'
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
  var json_array = new jsonArray( data );
  json_array = json_array.filter( row => row.NUMBER === '260' );
  expect(json_array.length).toBe(16);
});



test("jsonArray : label when all in one class", () => {
  var json_array = new jsonArray( data );
  json_array = json_array.filter( row => row.NUMBER === '260' );
  json_array = json_array.label( row => row.VALUE > 0.01 );
  expect(json_array.filter(row => row.label === false).length).toBe(16);
  expect(json_array.filter(row => row.label === true).length).toBe(0);
});


test("jsonArray : label when a split occurs", () => {
  var json_array = new jsonArray( data );
  json_array = json_array.filter( row => row.NUMBER === '260' );
  json_array = json_array.label( row => row.VALUE > 0.0005 );
  expect(json_array.filter(row => row.label === false).length).toBe(6);
  expect(json_array.filter(row => row.label === true).length).toBe(10);
});


test("jsonArray : label when with 3 items and params", () => {
  var json_array = new jsonArray( data );

  json_array.label( row => row.VALUE > 0.0005, {output_col: 'TEST', value:'YES', default: 'NO'} )
  json_array.label( row => row.id === 126, {output_col: 'TEST', value:'MARKED'} )

  expect(json_array.filter(row => row.TEST === 'NO').length).toBe(6);
  expect(json_array.filter(row => row.TEST === 'MARKED').length).toBe(1);
  expect(json_array.filter(row => row.TEST === 'YES').length).toBe(9);
});


test("jsonArray : test unique ordering using string type", () => {

  const expected = [
    'UP16002',
    'UP16009',
    'UP16012',
    'ZMY02UFB1600-36',
    'ZMY02UFB1600-69'
  ]

  var json_array = new jsonArray( data );
  const values = json_array.unique( 'CATEGORY1', true );
  expect(values.toString()).toBe(expected.toString());
});


test("jsonArray : drop columns", () => {
  var json_array = new jsonArray( JSON.parse(JSON.stringify(data)) );

  // ensure that the data contains the desired column
  expect(json_array.columns.includes('VALUE')).toBe(true);

  // drop and exure that the column was removed
  json_array = json_array.drop_columns( ['VALUE'] )
  expect(json_array.columns.includes('VALUE')).toBe(false);
});


test("jsonArray : rename columns", () => {
  var json_array = new jsonArray( JSON.parse(JSON.stringify(data)) );

  // ensure that the data contains the desired column
  expect(json_array.columns.includes('VALUE')).toBe(true);

  // drop and exure that the column was removed
  json_array = json_array.rename( {VALUE:'RENAMED'} )
  expect(json_array.columns.includes('VALUE')).toBe(false);
  expect(json_array.columns.includes('RENAMED')).toBe(true);
});



test("jsonArray : copy columns", () => {
  var json_array = new jsonArray( JSON.parse(JSON.stringify(data)) );

  // ensure that the data contains the desired column
  expect(json_array.columns.includes('AREA')).toBe(true);
  expect(json_array.columns.includes('NEW_COL')).toBe(false);

  // copy the column and validate the results
  json_array = json_array.copy_column( 'AREA', 'NEW_COL' )
  expect(json_array.columns.includes('VALUE')).toBe(true);
  expect(json_array.columns.includes('NEW_COL')).toBe(true);
});


test("jsonArray : replace ", () => {
  var json_array = new jsonArray( JSON.parse(JSON.stringify(data)) );

  // ensure that the data contains the desired column
  expect(json_array.unique('CATEGORY1').includes('UP16009')).toBe(true);
  expect(json_array.unique('CATEGORY1').includes('NEW')).toBe(false);

  // replace the values and checkt he values
  json_array = json_array.replace( 'CATEGORY1', {UP16009: 'NEW'} )
  expect(json_array.unique('CATEGORY1').includes('UP16009')).toBe(false);
  expect(json_array.unique('CATEGORY1').includes('NEW')).toBe(true);

});
