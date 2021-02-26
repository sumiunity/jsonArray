/**
 * eCharts Test
 * =============
 *
 * Test the functionality of the eCharts formatter
 *
 * :Author: Nik Sumikawa
 * :Date: Aug 03, 2020

 */
import {data} from './data'
// import jsonArray from '../jsonArray'

import echartsSeries from '../frameworks/echarts/series'
import jsonArray from '../jsonArray'

global.base_dir = './';

global.abs_path = function(path) {
  return base_dir + path;
}

global.include = function(file) {
  return require(abs_path('/' + file));
}


// test("jsonArray : groups similar rows based on the value of the specified column", () => {
//   var json_array = new jsonArray( data.data )
//   json_array = json_array.groupby(['LOTID'])
//   expect(json_object.date.toString()).toBe('2020-07-29');
//
//
// });


test("eCharts : line plot test : default", () => {

  var series = new echartsSeries( data )
  series = series.line('VALUE')

  expect(series.type).toBe('line');
  expect(series.symbol).toBe('none');
  expect(series.lineStyle.color).toBe('red');

});


test("eCharts : line plot test : with params", () => {

  var series = new echartsSeries( data )
  series = series.line('VALUE', {color:'blue', lw:2})

  expect(series.type).toBe('line');
  expect(series.symbol).toBe('none');
  expect(series.lineStyle.color).toBe('blue');
  expect(series.lineStyle.width).toBe(2);

});


test("eCharts : area plot : default", () => {

  var series = new echartsSeries( data )
  series = series.area('VALUE' )

  expect(series.type).toBe('line');
  expect(series.areaStyle).toStrictEqual({});

});


test("eCharts : scatter plot : default", () => {

  var series = new echartsSeries( data )
  series = series.scatter('VALUE', 'id' )

  expect(series.name).toBe('scatter');
  expect(series.type).toBe('scatter');
  expect(series.color).toBe('blue');
  expect(series.emphasis === undefined).toBe(true);

});


test("eCharts : scatter plot : labeled true", () => {

  var series = new echartsSeries( data )
  series = series.scatter('VALUE', 'id', {label:true} )

  expect(series.name).toBe('scatter');
  expect(series.type).toBe('scatter');
  expect(series.color).toBe('red');
  expect(series.emphasis === undefined).toBe(false);

});


test("eCharts : scatter plot : labeled marked", () => {

  var series = new echartsSeries( data )
  series = series.scatter('VALUE', 'id', {label:'MARKED'} )

  expect(series.name).toBe('scatter');
  expect(series.type).toBe('scatter');
  expect(series.color).toBe('green');
  expect(series.emphasis === undefined).toBe(false);

});


test("eCharts : scatter by plot : labeled true/false", () => {

  var json_array = new jsonArray( data )
  json_array = json_array.label( row => row.VALUE > 0.0005 )

  var series = new echartsSeries( json_array )
  series = series.scatter_by('VALUE', 'id', 'label')

  expect(series[0].name).toBe('scatter');
  expect(series[0].type).toBe('scatter');
  expect(series[0].color).toBe('red');
  expect(series[0].data.length).toBe(10);


  expect(series[1].name).toBe('scatter');
  expect(series[1].type).toBe('scatter');
  expect(series[1].color).toBe('blue');
  expect(series[1].data.length).toBe(6);

});


test("eCharts : scatter by plot : labeled true/false/marked", () => {

  var json_array = new jsonArray( data )
  json_array = json_array.label( row => row.VALUE > 0.0005 )
  json_array = json_array.label( row => row.id === 126, {value:'MARKED'} )

  var series = new echartsSeries( json_array )
  series = series.scatter_by('VALUE', 'id', 'label')

  expect(series[0].name).toBe('scatter');
  expect(series[0].type).toBe('scatter');
  expect(series[0].color).toBe('red');
  expect(series[0].data.length).toBe(9);


  expect(series[1].name).toBe('scatter');
  expect(series[1].type).toBe('scatter');
  expect(series[1].color).toBe('blue');
  expect(series[1].data.length).toBe(6);


  expect(series[2].name).toBe('scatter');
  expect(series[2].type).toBe('scatter');
  expect(series[2].color).toBe('green');
  expect(series[2].data.length).toBe(1);
});

// 
// test("eCharts : boxplot : default", () => {
//
//   const json_array = new jsonArray( data )
//   var series = new echartsSeries( json_array )
//   series = series.boxplot('CATEGORY1', 'id')
//
//   expect(series[0].name).toBe('boxplot');
//   expect(series[0].type).toBe('boxplot');
//   expect(series[0].data.length).toBe(5);
//
//   expect(series[1].name).toBe('outlier');
//   expect(series[1].type).toBe('scatter');
//   expect(series[1].data.length).toBe(0);
//
// });
//
// test("eCharts : boxplot : marked", () => {
//
//   var json_array = new jsonArray( data )
//   json_array = json_array.label( row => row.id === 126, {value:'MARKED'} )
//
//   var series = new echartsSeries( json_array )
//   series = series.boxplot('CATEGORY1', 'id', {label:'label'} )
//
//   expect(series[0].name).toBe('boxplot');
//   expect(series[0].type).toBe('boxplot');
//   expect(series[0].data.length).toBe(5);
//
//   expect(series[1].name).toBe('outlier');
//   expect(series[1].type).toBe('scatter');
//   expect(series[1].data.length).toBe(0);
//
//   expect(series[2].name).toBe('scatter');
//   expect(series[2].type).toBe('scatter');
//   expect(series[2].color).toBe('green');
//   expect(series[2].data.length).toBe(1);
// });



test("eCharts : bar : single", () => {

  var json_array = new jsonArray( data )

  var series = new echartsSeries( json_array )
  series = series.bar('VALUE')

  expect(series[0].name).toBe('bar');
  expect(series[0].type).toBe('bar');
  expect(series[0].data.length).toBe(16);

});


test("eCharts : bar : internal", () => {

  var json_array = new jsonArray( data )

  var series = new echartsSeries( json_array )
  series = series.bar(['VALUE', 'id'], {stacked: true})

  expect(series[0].name).toBe('VALUE');
  expect(series[0].type).toBe('bar');
  expect(series[0].stack).toBe(true);
  expect(series[0].data.length).toBe(16);


  expect(series[1].name).toBe('id');
  expect(series[1].type).toBe('bar');
  expect(series[1].stack).toBe(true);
  expect(series[1].data.length).toBe(16);

});
