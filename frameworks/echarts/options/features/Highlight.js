

// Adds a scatter point for the ends of the error bars
// and a line connecting the scatter poitns
export default function Highlight( options, props ){

  if( (props.colx === undefined)|(props.coly === undefined)|(props.value === undefined) ){
    alert( 'minimum attributes: colx, coly and value')
    return
  }

  // identify the index of the samples to highlight
  var index = props.value
  if( typeof props.value === 'string'){
    index = options.xAxis.data.indexOf( props.value )
  }

  // extend the first item in the series with the marked area
  options.series[0]['markArea'] = {
      data: [
        [{
          name: props.value,
          xAxis: index - 1
      }, {
          xAxis: index + 1
      }]
    ]
  }

  return options

}
