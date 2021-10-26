

export default function CompletedWaferfall( props ){

  var data = props.json_array

  // perform the forward difference required to generate the waterfall
  data = data.forward_diff(props.coly, 'waferfallDiff' )

  var pos = []
  var neg = []
  var pos_c = []
  var neg_c = []
  var stack = []

  for( let i=0; i < data.length - 1; i++ ){
    const temp = data[i+1]['waferfallDiff']

    const tempComplete = temp * data[i+1][props.colz]
    const tempIncompete = temp * (1 - data[i+1][props.colz])

    if(temp >= 0){
      pos.push(tempIncompete )
      pos_c.push(tempComplete )
      neg.push('-')
      neg_c.push('-')
      stack.push( data[i][props.coly] )

    }else{
      pos.push('-')
      pos_c.push('-')
      neg.push(Math.abs(tempIncompete))
      neg_c.push(Math.abs(tempComplete))
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
        name: 'Increase-complete',
        type: 'bar',
        stack: 'waferfall',
        data: pos_c,
        color: (props.posColorComplete === undefined) ? '#028a00' : props.posColorComplete,
      },
      {
        name: 'Increase-Incomplete',
        type: 'bar',
        stack: 'waferfall',
        data: pos,
        color: (props.posColorIncomplete === undefined) ? '#1dff1a' : props.posColorIncomplete,
      },

      {
        name: 'Decrease-complete',
        type: 'bar',
        stack: 'waferfall',
        data: neg_c,
        color: (props.negColorComplete === undefined) ? '#8a0000' : props.negColorComplete,
      },
      {
        name: 'Decrease-Incomplete',
        type: 'bar',
        stack: 'waferfall',
        data: neg,
        color: (props.negColorIncomplete === undefined) ? '#fa0000' : props.negColorIncomplete,
      },
  ]

  return series



}
