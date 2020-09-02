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


test("Series : sub", () => {

  const series = new Series({index: testIndex, value: testValues})

  const expected = [
    -2,   5,  14,  26, 33, 41,
    49,  64,  69,  72, 81, 85,
    92, 104, 108, 124
  ]
  expect( series.sub(2).values.toString() ).toBe( expected.toString() );

  const expected2 = [
  0, 0, 0, 0, 0, 0,
  0, 0, 0, 0, 0, 0,
  0, 0, 0, 0
  ]
  expect( series.sub(series).values.toString() ).toBe( expected2.toString() );
});


test("Series : add", () => {

  const series = new Series({index: testIndex, value: testValues})

  const expected = [
     2,   9,  18,  30, 37, 45,
    53,  68,  73,  76, 85, 89,
    96, 108, 112, 128
  ]
  expect( series.add(2).values.toString() ).toBe( expected.toString() );

  const expected2 = [
    0,  14,  32,  56,  70,
     86, 102, 132, 142, 148,
    166, 174, 188, 212, 220,
    252
  ]
  expect( series.add(series).values.toString() ).toBe( expected2.toString() );
});

test("Series : multiply", () => {

  const series = new Series({index: testIndex, value: testValues})

  const expected = [
      0,  14,  32,  56,  70,
     86, 102, 132, 142, 148,
    166, 174, 188, 212, 220,
    252
  ]
  expect( series.multiply(2).values.toString() ).toBe( expected.toString() );

  const expected2 = [
       0,    49,   256,   784,
    1225,  1849,  2601,  4356,
    5041,  5476,  6889,  7569,
    8836, 11236, 12100, 15876
  ]
  expect( series.multiply(series).values.toString() ).toBe( expected2.toString() );
});


test("Series : divide", () => {

  const series = new Series({index: testIndex, value: testValues})

  const expected = [
       0,  3.5,  8,   14, 17.5,
    21.5, 25.5, 33, 35.5,   37,
    41.5, 43.5, 47,   53,   55,
      63
  ]
  expect( series.divide(2).values.toString() ).toBe( expected.toString() );

  const expected2 = [
    NaN, 1, 1, 1, 1, 1,
      1, 1, 1, 1, 1, 1,
      1, 1, 1, 1
  ]
  expect( series.divide(series).values.toString() ).toBe( expected2.toString() );
});



test("Series : from DataFrame", () => {

  var json_array = new jsonArray( data )
  var series = json_array.col('id')
  expect( series.values.toString() ).toBe( testValues.toString() );

});


test("Series : to DataFrame", () => {

  var json_array = new jsonArray( data )
  var series = json_array.col('id')

  // add 2 to the series and extend by 1 attribute
  series = series.add(2)
  series['16'] = 9999

  json_array = json_array.set_col( series )

  const expected = [
     2,   9,  18,  30, 37, 45,
    53,  68,  73,  76, 85, 89,
    96, 108, 112, 128, 9999
  ]

  expect( json_array.values('id').toString() ).toBe( expected.toString() );

});
