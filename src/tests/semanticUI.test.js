/**
 * Semantic UI Test
 * =====================
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
import jsonSemanticUI from '../framework/SemanticUI'


//
test("SemanticUI : test the dropdown functionality", () => {

  const expected = [
    { key: 'UP16002', text: 'UP16002', value: 'UP16002' },
    { key: 'UP16009', text: 'UP16009', value: 'UP16009' },
    { key: 'UP16012', text: 'UP16012', value: 'UP16012' },
    {
      key: 'ZMY02UFB1600-36',
      text: 'ZMY02UFB1600-36',
      value: 'ZMY02UFB1600-36'
    },
    {
      key: 'ZMY02UFB1600-69',
      text: 'ZMY02UFB1600-69',
      value: 'ZMY02UFB1600-69'
    }
  ]

  var semanticUI = new jsonSemanticUI( data )
  const dropdown = semanticUI.dropdown('CATEGORY1')
  expect(dropdown.toString()).toBe(expected.toString());
});
