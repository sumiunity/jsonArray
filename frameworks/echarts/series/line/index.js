/**
 * echarts line
 * =================
 *
 * Converts json arrays into echart line series object
 *
 * :Author: Nik Sumikawa
 * :Date: April 21, 2020
 */


import propsToSeries from '../propsToSeries'

/**
 * Convert the json_array to a line plot
 * @param  {string} colx  column 1 name, when 'index' is provided, the index value will be used
 * @param  {string} coly  column 2 name
 * @param  {object} params parameters used to customize the plot
 * @return {Object}       local object contents
 */
export default function line( props ){

  var json_array = props.json_array

  var Series = {
    type: 'line',
    data: json_array.map(r => r[props.coly])
  }

  Series = propsToSeries(props, Series)

  return [Series]

}
