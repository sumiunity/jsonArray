
import echartsAxis from '../../axis'

/**
 * Convert the json_array to a heatmap plot option object
 * @param  {string} colx  column x name
 * @param  {string} coly  column y name
 */
export default function heatmap( json_array, props={} ){

  // returns an object for generating a heatmap, similar to
  // the calendar example but with data from a jsonArray
  // example: https://echarts.apache.org/examples/en/editor.html?c=calendar-heatmap


  // check to ensure the minimum set of parameters are available
  if( (props.colx === undefined)|(props.coly === undefined)|(props.value === undefined) ){
    alert( 'boxplot required att : colx, coly and value' )
  }

  // set the x axis values using the Axis class
  var xAxis = new echartsAxis(props.colx)
  xAxis.to_category({values: json_array.unique(props.colx, true) })
  xAxis.label( props.colx )

  // set the y axis values using the Axis class
  var yAxis = new echartsAxis(props.coly)
  yAxis.to_category({ values: json_array.unique(props.coly, true) })
  xAxis.label( props.coly )


  var grid = {backgroundColor: 'rgb(0, 128, 0)'}

  var visualMap = {
      min: Math.min(...json_array.unique(props.value))*100,
      max: Math.max(...json_array.unique(props.value))*100,
      calculable: true,
      orient: 'vertical',
      left: 'left',
      bottom: '10%',
      inRange: {
        color: ['green', 'yellow','orange', 'red']
      }
  }

  var series = [{
      type: 'heatmap',
      data: json_array.map(function (item) {

        var value = Number(item[props.value])
        if( props.percentage === true ) value = (Number(item[props.value])*100).toFixed(2)

          return [
            item[props.colx],
            item[props.coly],
            value
          ]
        }),
      label: {
          show: true
      },
  }]

  return {
    xAxis: xAxis,
    yAxis: yAxis,
    series: series,
    grid: grid,
    visualMap: visualMap

  }

}
