
import jsonArray from '../../../../jsonArray'
import Bar from './bar'
/**
 * echarts area plot data formatter
 * @param  {string} col  column name
 * @return {object}      echarts data series object
 */
export default function BarPlot( props ){

  var json_array = props.json_array
  if( !(json_array instanceof jsonArray) ){
    json_array = new jsonArray(json_array)
  }


  // return a single boxplot when the column is a string
  if( typeof props.col === 'string' ){
    return [Bar({
      ...props,
      ...{
        col: props.col,
        json_array: json_array,
      }
    })]
  }

  var series = []
  for( var i=0; i < props.col.length; i++ ){

    // create a data structure for plotting the scatter plot
    series.push( Bar({
      ...props,
      ...{
        col: props.col[i],
        name: props.col[i],
        json_array: json_array,
      }
    }) )

  }

  return series



}
