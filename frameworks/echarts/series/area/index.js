
import jsonArray from '../../../../jsonArray'
import propsToSeries from '../propsToSeries'

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

  Series = propsToSeries(props, Series)

  return [Series]

}
