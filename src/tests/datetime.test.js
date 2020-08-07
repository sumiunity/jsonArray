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

import jsonObject from '../jsonObject'
import jsonArray from '../jsonArray'
import datetime from '../data_types/datetime'
import {data} from './data'


test("jsonObject : converts date object to string", () => {
    var json_object = new jsonObject({date:'2020-07-29'});
    json_object.strptime('date');
    expect(json_object.date.toString()).toBe('2020-07-29');
});


test("jsonObject : Adding a timedelta to the date", () => {
    var json_object = new jsonObject({date:'2020-07-29'});

    json_object.strptime('date');
    const extended_date = json_object.date.timedelta({days:2});

    expect(extended_date.toString()).toBe('2020-07-31');
});


test("datetime : converts date object to string", () => {
    var date =  datetime('2020-07-01');
    expect(date.toString()).toBe('2020-07-01');
});


test("datetime : Adding a timedelta to the date", () => {
    var date =  datetime('2020-07-01');
    const extended_date = date.timedelta({days:2});

    expect(extended_date.toString()).toBe('2020-07-03');
});

test("datetime : week converstion", () => {
  var json_array = new jsonArray( data)
  const json_array1 = json_array.dtype('TIME', 'week')
  expect(json_array[0].TIME).toBe('2020-07-05T00:00:42');
  expect(json_array1[0].TIME).toBe(27);

});
