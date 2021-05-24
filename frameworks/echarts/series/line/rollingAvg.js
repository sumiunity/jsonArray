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

// returns the
export default function rollingAvg( props ){

  var json_array = props.json_array

  if( !json_array.columns.includes(`${props.coly}_avg`) ){
    json_array = json_array.rolling_average(props.coly, props.window)
  }

  var Series = {
    type: 'line',
    data: json_array.map(r => r[`${props.coly}_avg`]),
    smooth: true,
    showSymbol: false,
    lineStyle: {
        color: '#000000',
        width: 2,
        type: 'dashed'
    },
  }

  Series = propsToSeries(props, Series)

  return [Series]

}
