/**
 * Series Test
 * ========================
 *
 * Tests various Series related functionality
 *
 * :Author: Nik Sumikawa
 * :Date: Sept 2, 2020
 */


import jsonArray from '../jsonArray'
import Series from '../Series'
import {data} from './data'

const testValues = [
   0,   7,  16,  28, 35, 43,
  51,  66,  71,  74, 83, 87,
  94, 106, 110, 126
]

const testIndex = [
  '0',  '1',     '2',
  '3',  '4',     '5',
  '6',  '7',     '8',
  '9',  '10',    '11',
  '12', '13',    '14',
  '15'
]

const testStrings = [
  'UP16002', 'ZMY02UFB1600-36',
  'UP16009', 'UP16009',
  'UP16009', 'UP16009',
  'UP16009', 'UP16009',
  'UP16009', 'UP16009',
  'UP16009', 'UP16009',
  'UP16012', 'UP16012',
  'UP16009', 'ZMY02UFB1600-69'
]

test("Series : index", () => {

  const series = new Series({index: testIndex, value: testValues})
  expect( series.index.toString() ).toBe(testIndex.toString());
  expect( Object.keys(series).includes('dtype') ).toBe(true);
});


test("Series : values", () => {

  const series = new Series({index: testIndex, value: testValues})
  expect( series.values.toString() ).toBe(testValues.toString());
  expect( Object.keys(series).includes('dtype') ).toBe(true);
});

test("Series : statistics", () => {

  const series = new Series({index: testIndex, value: testValues})
  expect( series.min ).toBe( 0 );
  expect( series.max ).toBe( 126 );
  expect( series.mean ).toBe( 62.3125 );
  expect( series.sum ).toBe( 997 );
  expect( series.dtype ).toBe( 'int' );
});


test("Series : unique", () => {

  const expected = [
    'UP16002',
    'ZMY02UFB1600-36',
    'UP16009',
    'UP16012',
    'ZMY02UFB1600-69'
  ]

  const series = new Series({index: testIndex, value: testStrings})
  expect( series.unique().toString() ).toBe( expected.toString() );
  expect( series.dtype ).toBe( 'string' );
});
