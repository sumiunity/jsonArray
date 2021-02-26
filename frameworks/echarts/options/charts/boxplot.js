
import echartsAxis from '../../axis'

/**
 * Convert the json_array to a boxplot plot option object
 * @param  {string} colx  column x name
 * @param  {string} coly  column y name
 */
export default function boxplot( json_array, props={} ){

  const boxplot = require('../../series/boxplot').default

  // check to ensure the minimum set of parameters are available
  if( (props.colx === undefined)|(props.coly === undefined) ){
    alert( 'boxplot required att : colx and coly' )
  }

  const keys = json_array.unique( props.colx, true )

  // set the x axis values using the Axis class
  var xAxis = new echartsAxis(props.colx)
  xAxis.to_category({ values: keys })
  xAxis.axisLabel = { formatter: '{value}' }
  // xAxis.boundaryGap = true
  // xAxis.nameGap = 30
  // xAxis.splitLine = {show: false }

  // set the y axis values using the Axis class
  var yAxis = new echartsAxis(props.coly)
  yAxis.to_value()
  yAxis.dynamic_range(json_array)
  // yAxis.splitArea = {show: true}


  var series = boxplot( {...props, ...{json_array: json_array}} )
  // const echart_series = new echartsSeries( json_array )
  // series = echart_series.boxplot(props.colx, props.coly, props )


  return {
    xAxis: [xAxis],
    yAxis: [yAxis],
    series: series
  }

}
