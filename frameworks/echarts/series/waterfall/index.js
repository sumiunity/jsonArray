
import CompletedWaferfall from './completed'

export default function Waterfall( props ){

  var data = props.json_array

  // redirect to the completed waferfall when colz is provided
  if( props.colz !== undefined ) return CompletedWaferfall(props )

  // perform the forward difference required to generate the waterfall
  data = data.forward_diff(props.coly, 'waferfallDiff' )


  var pos = []
  var neg = []
  var stack = []

  for( let i=0; i < data.length - 1; i++ ){
    const temp = data[i+1]['waferfallDiff']


    if(temp >= 0){
      pos.push(temp)
      neg.push('-')
      stack.push( data[i][props.coly] )

    }else{
      pos.push('-')
      neg.push(Math.abs(temp))
      stack.push( data[i+1][props.coly] )
    }

  }

  const series = [
      {
          type: 'bar',
          stack: 'waferfall',
          itemStyle: {
              barBorderColor: 'rgba(0,0,0,0)',
              color: 'rgba(0,0,0,0)'
          },
          emphasis: {
              itemStyle: {
                  barBorderColor: 'rgba(0,0,0,0)',
                  color: 'rgba(0,0,0,0)'
              }
          },
          data: stack
      },

      {
          name: 'Increase',
          type: 'bar',
          stack: 'waferfall',
          data: pos,
          color: (props.posColor === undefined) ? 'green' : props.posColor,
      },

      {
          name: 'Decrease',
          type: 'bar',
          stack: 'waferfall',
          data: neg,
          color: (props.negColor === undefined) ? 'red' : props.negColor,
      }
  ]

  return series



}
