
import echartsAxis from '../../axis'
import moment from 'moment'

/**
 * Convert the json_array to a scatter plot option object
 * @param  {string} colx  column x name
 * @param  {string} coly  column y name
 */
export default function scatter( json_array, props={} ){

  const scatter = require('../../series/scatter').default
  const scatter_by = require('../../series/scatter/scatterBy').default

  // check to ensure the minimum set of parameters are available
  if( (props.colx === undefined)|(props.coly === undefined)){
    alert( 'scatter plot required att : colx and coly ')
  }

  // set the x axis values using the Axis class
  var xAxis = new echartsAxis( props.colx, json_array )

  // set the y axis values using the Axis class
  var yAxis = new echartsAxis( props.coly, json_array )


  // convert the x-axis to date type when of moment type
  if( json_array[0][props.colx] instanceof moment ){
    json_array = json_array.strftime(props.colx)
    xAxis.to_date()
  }


  // convert the x-axis to date type when of moment type
  if( json_array[0][props.coly] instanceof moment ){
    json_array = json_array.strftime(props.coly)
    yAxis.to_date()
  }



  var series

  if( (props.colorBy !== undefined)&(json_array.columns.includes(props.colorBy)) ){

    series = scatter_by({
      ...props,
      ...{
          json_array: json_array,
          colorBy: props.colorBy
        }
    })

  }else{
    series = scatter({
      ...props,
      ...{json_array: json_array}
    })

  }

  return {
    xAxis: [xAxis],
    yAxis: [yAxis],
    series: series
  }

}
