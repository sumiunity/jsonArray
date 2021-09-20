
import propsToSeries from '../propsToSeries'

/**
 * echarts area plot data formatter
 * @param  {string} col  column name
 * @return {object}      echarts data series object
 */
export default function area( props ){

  var json_array = props.json_array

  // pivot the table
  const pivot = json_array.pivot_table(
    props.coly,
    props.colx,
    (props.type === undefined) ? 'count' : props.type,
    props.colz
  )

  // extract the column names to ensure each column is considered
  const columns = pivot.columns.filter(r => r !== 'row')

  var Series = []

  // combine the data for each row including data for columns with missing data
  for( let i=0; i < pivot.length; i++ ){
    var row = []
    var id = pivot[i]['row']

    for( let j=0; j < columns.length; j++ ){
      row.push(pivot[i][columns[j]])
    }

    // set the data in the expected format
    var ser =  seriesFormat(id, row)

    // convert the props to series parameters
    ser = propsToSeries(props, ser)

    // add to the Series array
    Series.push( seriesFormat(id, row) )
  }
  
  return Series

}


function seriesFormat( id, data ){
  return {
      name: id,
      type: 'line',
      stack: 'stack',
      smooth: true,
      lineStyle: {
          width: 0
      },
      showSymbol: false,
      areaStyle: {
          opacity: 0.8,
      //     color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [{
      //         offset: 0,
      //         color: 'rgba(128, 255, 165)'
      //     }, {
      //         offset: 1,
      //         color: 'rgba(1, 191, 236)'
      //     }])
      },
      emphasis: {
          focus: 'series'
      },
      data: data
  }

}
