/**
 * eCharts Boxplot
 * =================
 *
 * Converts json arrays into echart series objects. The intention
 * is to simplify the conversion from json array to plot
 *
 * :Author: Nik Sumikawa
 * :Date: April 21, 2020
 */


import jsonArray from '../../../../jsonArray'

import scatter_overlay from './scatter_overlay'

var prepareBoxplotData
try{
  prepareBoxplotData =  require( 'echarts/extension/dataTool').prepareBoxplotData
}catch{ console.log( 'echarts module not implemented')}


/**
 * Convert the json_array to a format for generating a boxplot
 * @param  {string} colx  column 1 name, when 'index' is provided, the index value will be used
 * @param  {string} coly  column 2 name
 * @param  {object} params parameters used to customize the plot
 * @return {Object}       local object contents
 */
export default function boxplot( props ){



  var json_array = props.json_array
  if( !(json_array instanceof jsonArray) ){
    json_array = new jsonArray(json_array)
  }


  json_array = json_array.sort_values(props.colx)

  // group the data based on the boxplot groups
  const groups = json_array.groupby([props.colx])

  // group the data based on the unique column values
  var group_values = []
  for( var i=0; i < groups.length; i++ ){
    group_values.push(
      groups[i].json_obj.map(row => row[props.coly])
    )
  }

  // // leverage the echarts function to generate the data
  const echartsData = prepareBoxplotData(group_values)

  // format the boxplot results as a series
  var series = [
    {
      name: 'boxplot',
      type: 'boxplot',
      data: echartsData.boxData,
    }
  ]


  // add the outlier samples. This is set by default and
  // can only be turned off by expicitly providing false
  if( (props.outliers !== false)&(props.allSample !== true) ){
    series.push({
      name: 'outlier',
      type: 'scatter',
      data: echartsData.outliers
      }
    )
  }

  if( (props.allSample === true)|(props.overlayFilter !== undefined) ){
    series = series.concat(
      scatter_overlay(props)
    )
  }


  return series
}
