
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

  const colx = props.colx
  const coly = props.coly

  if( props.horizontal === true ){
    var xAxis = new echartsAxis(coly)

    var yAxis = new echartsAxis(colx)
    yAxis.label(colx)
    yAxis.tick_values(json_array.values(colx))

  }else{
    var xAxis = new echartsAxis(colx)
    xAxis.label(colx)
    xAxis.tick_values(json_array.values(colx))

    var yAxis = new echartsAxis(coly)
  }

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
