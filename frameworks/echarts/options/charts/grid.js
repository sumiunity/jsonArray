
import echartsAxis from '../../axis'
import grid from '../../series/grid'

/**
 * Convert the json_array to a heatmap plot option object
 * @param  {string} colx  column x name
 * @param  {string} coly  column y name
 */
export default function rectGrid( json_array, props={} ){

  // check to ensure the minimum set of parameters are available
  if( (props.colx === undefined)|(props.coly === undefined)|(props.value === undefined) ){
    alert( 'boxplot required att : colx, coly and value' )
  }


  // set the x axis values using the Axis class
  var xAxis = new echartsAxis(props.colx)
  xAxis.label( props.colx )
  xAxis.minValue()
  xAxis.maxValue()
  xAxis.hide()

  // set the y axis values using the Axis class
  var yAxis = new echartsAxis(props.coly)
  yAxis.label( props.coly )
  yAxis.minValue()
  yAxis.maxValue()
  yAxis.hide()


  var series = grid( {...props, ...{json_array: json_array}} )

  return {
    xAxis: [xAxis],
    yAxis: [yAxis],
    series: series

  }

}
