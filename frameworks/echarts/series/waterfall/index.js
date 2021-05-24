

export default function Waterfall( props ){

  var data = props.json_array

  // perform the forward difference required to generate the waterfall
  data = data.forward_diff(props.coly, 'waferfallDiff' )

  const diff = data.map(r => r.waferfallDiff)

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
          name: 'Gains',
          type: 'bar',
          stack: 'waferfall',
          data: pos,
          color: 'green',
      },

      {
          name: 'Losses',
          type: 'bar',
          stack: 'waferfall',
          data: neg,
          color: 'red',
      }
  ]

  return series



}
