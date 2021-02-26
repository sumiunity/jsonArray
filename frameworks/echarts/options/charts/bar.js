
import echartsAxis from '../../axis'

/**
 * Convert the json_array to a scatter plot option object
 * @param  {string} colx  column x name
 * @param  {string} coly  column y name
 */
export default function bar( json_array, props={} ){

  const bar = require('../../series/bar').default

  // check to ensure the minimum set of parameters are available
  if( (props.colx === undefined)|(props.coly === undefined) ){
    alert( 'bar plot required att : colx and coly ')
  }

  // set the x axis values using the Axis class
  var xAxis = new echartsAxis(props.colx)
  xAxis.label(props.colx)
  xAxis.tick_values(json_array.values(props.colx))

  // set the y axis values using the Axis class
  var yAxis = new echartsAxis(props.coly)

  // const echart_series = new echartsSeries( json_array )
  // var series = echart_series.bar( props.coly, props)

  var series = bar( {
    ...props,
    ...{
      json_array: json_array,
      col: props.coly
    }} )

  return {
    xAxis: [xAxis],
    yAxis: [yAxis],
    series: series,
  }

}
