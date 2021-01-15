
import jsonArray from '../../../../jsonArray'

/**
 * echarts area plot data formatter
 * @param  {string} col  column name
 * @return {object}      echarts data series object
 */
export default function Bar( props ){

  var json_array = props.json_array
  if( !(json_array instanceof jsonArray) ){
    json_array = new jsonArray(json_array)
  }


  var Series = {
    name: 'bar',
    type: 'bar',
    data: json_array.map( row => row[props.col] )

  }

  if( props.name !== undefined ) Series['name'] = props.name
  if( props.stacked !== undefined ) Series['stack'] = props.stacked
  if( props.color !== undefined ) Series['color'] = props.color

  return Series
}
