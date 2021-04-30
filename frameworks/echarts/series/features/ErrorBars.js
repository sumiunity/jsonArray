

import jsonArray from '../../../../jsonArray'
import Vline from './Vline'

// Adds a scatter point for the ends of the error bars
// and a line connecting the scatter poitns
export default function ErrorBars( props ){

  if( (props.min === undefined)|(props.max === undefined) ){
    alert( 'minimum attributes: min and max')
    return
  }

  var json_array = props.json_array
  if( !(json_array instanceof jsonArray) ){
    json_array = new jsonArray(json_array)
  }


  var Series = Vline({
    ...props,
    ...{
      colx: '__index__',
      coly: props.min,
      colz: props.max,
      zIndex: -1
    }
  })

  // scatter point for the minimum value
  Series.push(
    json_array.echartsSeries.scatter({
      colx:'__index__',
      coly:props.min,
      symbol: 'triangle',
      color: 'green'
    })[0]
  )

  // scatter point for the maximum value
  Series.push(
    json_array.echartsSeries.scatter({
      colx:'__index__',
      coly:props.max,
      symbol: 'diamond',
      color: 'blue'
    })[0],
  )


  // scatter point for the average value when available
  if( props.avg !== undefined ){
    Series.push(
      json_array.echartsSeries.scatter({
        colx:'__index__',
        coly:props.avg,
        symbol: 'square',
        color: 'red'
      })[0]
    )
  }

  return Series
}
