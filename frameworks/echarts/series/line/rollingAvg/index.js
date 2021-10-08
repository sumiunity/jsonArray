/**
 * echarts line
 * =================
 *
 * Converts json arrays into echart line series object
 *
 * :Author: Nik Sumikawa
 * :Date: April 21, 2020
 */


import propsToSeries from '../../propsToSeries'
import CenterWindow from './CenterWindow'
import TailingWindow from './TailingWindow'
import Standard from './Standard'

// returns the
export default function rollingAvg( props ){

  var json_array = props.json_array

  // define the average type
  var avgType = props.avgType
  if( avgType === undefined  ) avgType = 'center'


  if( !json_array.columns.includes(`${props.coly}_avg`) ){
    json_array = json_array.rolling_average(
      props.coly,
      props.window,
      avgType
    )
  }

  const data = json_array.map(r => r[`${props.coly}_avg`])

  var Series = []
  switch( avgType ){
    case 'center':
      Series = Standard(data, props.window)
      if( props.showUncertainty === true ) Series = CenterWindow(data, props.window)
      break

    case 'tailing':
      Series = Standard(data, props.window)
      if( props.showUncertainty === true ) Series = TailingWindow(data, props.window)
      break

    default:
      Series = Standard(data, props.window)

  }


  for( let i=0; i < Series.length; i++ ){
    Series[i] = propsToSeries(props, Series[i])
  }

  return Series

}
