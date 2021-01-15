/**
 * echarts line
 * =================
 *
 * Converts json arrays into echart line series object
 *
 * :Author: Nik Sumikawa
 * :Date: April 21, 2020
 */


import jsonArray from '../../../../jsonArray'

/**
 * Convert the json_array to a line plot
 * @param  {string} colx  column 1 name, when 'index' is provided, the index value will be used
 * @param  {string} coly  column 2 name
 * @param  {object} params parameters used to customize the plot
 * @return {Object}       local object contents
 */
export default function line( props ){

  var json_array = props.json_array
  if( !(json_array instanceof jsonArray) ){
    json_array = new jsonArray(json_array)
  }


  var Series = {
    type: 'line',
    data: json_array.map(r => r[props.coly])
  }

  if( props.color !== undefined ) Series['color'] = props.color
  if( props.smooth !== undefined ) Series['smooth'] = props.smooth
  if( props.symbol !== undefined ) Series['symbol'] = props.symbol
  if( props.lineStyle !== undefined ) Series['lineStyle'] = props.lineStyle


    // this.data = y_axis
    // this.type = 'line'
    // this.symbol = params['symbol']
    // this.smooth = true
    // this.lineStyle= {
    //       color: params['color'],
    //       width: params['lw']
    //   }
  return [Series]

}
