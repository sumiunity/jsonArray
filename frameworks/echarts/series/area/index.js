
import jsonArray from '../../../../jsonArray'

/**
 * echarts area plot data formatter
 * @param  {string} col  column name
 * @return {object}      echarts data series object
 */
export default function area( props ){

  var json_array = props.json_array
  if( !(json_array instanceof jsonArray) ){
    json_array = new jsonArray(json_array)
  }

  json_array = json_array.filter(r => (r[props.col] !=='')&(r[props.col] !== undefined))


  var Series = {
    type: 'line',
    data: json_array.map(r => r[props.col]),
    areaStyle: {}
  }

  if( props.color !== undefined ) Series['color'] = props.color
  if( props.smooth !== undefined ) Series['smooth'] = props.smooth
  if( props.symbol !== undefined ) Series['symbol'] = props.symbol
  if( props.lineStyle !== undefined ) Series['lineStyle'] = props.lineStyle

  return [Series]

}
