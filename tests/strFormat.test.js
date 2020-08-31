/**
 * Array To String Test
 * ========================
 *
 * Test the functionality of the array to string conversion components.
 * see data_types.arrayToString.js for component details
 *
 * :Author: Nik Sumikawa
 * :Date: Aug 31, 2020
 */


import jsonArray from '../jsonArray'
import arrayToString from '../data_types/format/arrayToString'
import {data} from './data'


test("arrayToString : column spacing", () => {

  const expected = {
    COUNT: 5,
    AREA: 9,
    VALUE: 5,
    id: 2,
    CATEGORY1: 15,
    CATEGORY2: 13,
    TIME: 19,
    TYPE: 4,
    NUMBER: 6,
    ARRAY: 5,
    image: 12
  }

  var json_array = new jsonArray( data )
  const array_to_string = new arrayToString()
  const spacing = array_to_string.col_spacing( json_array )

  expect(spacing.toString()).toBe(expected.toString());
});


test("strFormat : value", () => {
  var json_array = new jsonArray( data )
  expect(json_array.strFormat.value(0, 'VALUE')).toBe( '0.0006');
});

test("strFormat : percentage", () => {
  var json_array = new jsonArray( data )
  json_array = json_array.astype({VALUE: 'percentage'})
  expect(json_array.strFormat.value(0, 'VALUE')).toBe( '0.06%');
});
