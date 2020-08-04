/**
 * Datetime Test
 * =============
 *
 * Test the functionality of the Datetime capabilities in
 * the datetime extension of the moment library and also
 * the integrated version within jsonObject
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
import jsonArray from './jsonArray'



test("jsonArray : groups similar rows based on the value of the specified column", () => {
  var json_array = new jsonArray( data.data )
  json_array = json_array.groupby(['LOTID'])
  expect(json_object.date.toString()).toBe('2020-07-29');


});

test("jsonArray : returns the eCharts plot object", () => {
  var json_array = new jsonArray( data.data )
  var scatter = json_array.plot(
    'heatmap',
    {colx: 'TEST_PGM',
      coly:'SBIN_NUM',
      value: 'RATIO'
    } )


  expect(json_object.date.toString()).toBe('2020-07-29');


});
