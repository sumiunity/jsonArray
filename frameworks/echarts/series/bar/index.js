
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

  const col = (props.col === undefined) ? props.coly : props.col

  // return a single boxplot when the column is a string
  if( typeof col === 'string' ){
    return [Bar({
      ...props,
      ...{
        col: col,
        json_array: json_array,
      }
    })]
  }

  var series = []
  for( var i=0; i < col.length; i++ ){

    var color = (props.color === undefined) ? [] : props.color
    if( typeof color === 'string' ) color = []

    // create a data structure for plotting the scatter plot
    series.push( Bar({
      ...props,
      ...{
        col: col[i],
        name: col[i],
        json_array: json_array,
        color: (i < color.length) ? color[i] : undefined,
        // barGap: (i === 0 ) ? 0 : .1,
        emphasis: (props.emphasis === true) ? { focus: 'series' } : undefined,
      }
    }) )

  }

  return series



}
