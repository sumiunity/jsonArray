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

import moment from 'moment';



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

  json_array = json_array.label( row => row.VALUE > 0.0005, {output_col: 'TEST', value:'YES', default: 'NO'} )
  json_array = json_array.label( row => row.id === 126, {output_col: 'TEST', value:'MARKED'} )

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
  var json_array = new jsonArray( data );

  // ensure that the data contains the desired column
  expect(json_array.columns.includes('VALUE')).toBe(true);

  // drop and exure that the column was removed
  json_array = json_array.drop_columns( ['VALUE'] )
  expect(json_array.columns.includes('VALUE')).toBe(false);
});


test("jsonArray : rename columns", () => {
  var json_array = new jsonArray( data );

  // ensure that the data contains the desired column
  expect(json_array.columns.includes('VALUE')).toBe(true);

  // drop and exure that the column was removed
  json_array = json_array.rename( {VALUE:'RENAMED'} )
  expect(json_array.columns.includes('VALUE')).toBe(false);
  expect(json_array.columns.includes('RENAMED')).toBe(true);
});



test("jsonArray : copy columns", () => {
  var json_array = new jsonArray( data );

  // ensure that the data contains the desired column
  expect(json_array.columns.includes('AREA')).toBe(true);
  expect(json_array.columns.includes('NEW_COL')).toBe(false);

  // copy the column and validate the results
  json_array = json_array.copy_column( 'AREA', 'NEW_COL' )
  expect(json_array.columns.includes('VALUE')).toBe(true);
  expect(json_array.columns.includes('NEW_COL')).toBe(true);
});


test("jsonArray : replace ", () => {
  var json_array = new jsonArray( data );

  // ensure that the data contains the desired column
  expect(json_array.unique('CATEGORY1').includes('UP16009')).toBe(true);
  expect(json_array.unique('CATEGORY1').includes('NEW')).toBe(false);

  // replace the values and checkt he values
  json_array = json_array.replace( 'CATEGORY1', {UP16009: 'NEW'} )
  expect(json_array.unique('CATEGORY1').includes('UP16009')).toBe(false);
  expect(json_array.unique('CATEGORY1').includes('NEW')).toBe(true);

});


test("jsonArray : label : persisting ", () => {
  var json_array = new jsonArray( data );

  var json_array1 = json_array.label( row => row.id === 0, {value:'MARKED'} )

  // the original jsonArray should not be modified
  expect(json_array[0].label).toBe(undefined);

  // onlyt the returned jsonArray should contain the appropriate label
  expect(json_array1[0].label).toBe('MARKED');


  var json_array2 = json_array.label( row => row.id === 7, {value:'MARKED'} )

  // the original data should not have changed
  expect(json_array[0].label).toBe(undefined);
  expect(json_array[1].label).toBe(undefined);

  // only the new label should be changed, where the first label was not propogated
  expect(json_array2[0].label).toBe(false);
  expect(json_array2[1].label).toBe('MARKED');

});


test("jsonArray : dtype : persisting ", () => {
  var json_array = new jsonArray( data );
  json_array = json_array.strptime('TIME')

  // ensure that the dtype was changed for the time attribute
  expect(json_array[0].TIME instanceof moment).toBe(true);

  var json_array1 = json_array.label( row => row.id === 0, {value:'MARKED'} )

  // ensure that the dtype was propogated to the new jsonArray
  expect(json_array[0].TIME instanceof moment).toBe(true);
  expect(json_array1[0].TIME instanceof moment).toBe(true);

});


test("jsonArray : strptime", () => {
  var json_array = new jsonArray( data );
  var json_array1 = json_array.strptime('TIME')

  // ensure that the dtype was propogated to the new jsonArray
  expect(json_array[0].TIME instanceof moment).toBe(false);
  expect(json_array1[0].TIME instanceof moment).toBe(true);
});


test("jsonArray : strftime", () => {
  var json_array = new jsonArray( data );
  var json_array1 = json_array.strftime('TIME')

  // ensure that the dtype was propogated to the new jsonArray
  expect(json_array[0].TIME).toBe('2020-07-05T00:00:42');
  expect(json_array1[0].TIME).toBe('2020-07-05');
});
