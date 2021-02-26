

export default function Axline( value, props={} ){

  var val = value
  if( val/Math.pow(10,4-1) > 1 ) val = val.toExponential(3)

  var label = val
  if( props.label !== undefined) label = props.label

  var color = 'red'
  if( props.color !== undefined ) color = props.color

  var line = {
    name: 'limit',
    type: 'line',
    color: color,
    markLine: {
        symbol: "none",
        data: [{
          tooltip: {show:false},
          // name: val,
          label: {
            formatter: label,
            position: 'end'
          }
        }]
    }
  }

  if( props.axis === 'yAxis' ){
    line.markLine.data[0]['yAxis'] = value
  }else{
    line.markLine.data[0]['xAxis'] = value
  }

  return line
}
