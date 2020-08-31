/**
 * Data Type Test
 * ================
 *
 * Test the functionality of the data type parser and formatter.
 * The purpose is to track the data type of reach column to enable
 * correct DataFrame processing
 *
 * :Author: Nik Sumikawa
 * :Date: Aug 12, 2020
 */

global.base_dir = './';

global.abs_path = function(path) {
  return base_dir + path;
}

global.include = function(file) {
  return require(abs_path('/' + file));
}

import jsonArray from '../jsonArray'
import DataTypes from '../data_types/dtypes'
import {data} from './data'


test("Dtypes : parsing", () => {

  const expected = {
    COUNT: 'int',
    AREA: 'string',
    VALUE: 'float',
    id: 'int',
    CATEGORY1: 'string',
    CATEGORY2: 'string',
    TIME: 'datetime',
    TYPE: 'string',
    NUMBER: 'string',
    workflow: 'array',
    __index__: 'int'
  }

  const data_types = new DataTypes( data )

  expect(data_types.parse(data).toString()).toBe(expected.toString());
});

test("Dtypes : jsonArray parsing", () => {

  const expected = {
    COUNT: 'int',
    AREA: 'string',
    VALUE: 'float',
    id: 'int',
    CATEGORY1: 'string',
    CATEGORY2: 'string',
    TIME: 'datetime',
    TYPE: 'string',
    NUMBER: 'string',
    workflow: 'array',
    __index__: 'int'
  }

  const json_array = new jsonArray( data )

  expect(json_array.dtypes.toString()).toBe(expected.toString());
});


test("dtypes : type parsing", () => {

  const data_types = new DataTypes()

  expect(data_types.data_type( 10 )).toBe('int');
  expect(data_types.data_type( '10' )).toBe('intString');
  expect(data_types.data_type( 10.1 )).toBe('float');
  expect(data_types.data_type( '10.1' )).toBe('floatString');
  expect(data_types.data_type( '.1' )).toBe('floatString');
  expect(data_types.data_type( true )).toBe('boolean');
  expect(data_types.data_type( false )).toBe('boolean');
  expect(data_types.data_type( 'true' )).toBe('booleanString');
  expect(data_types.data_type( 'false' )).toBe('booleanString');
  expect(data_types.data_type( 'String' )).toBe('string');

});
