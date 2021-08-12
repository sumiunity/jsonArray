// returns the rolling average line plot where the average
// is computed across the previous n samples
export default function TailingWindow(data, window){

  return [
    {
      type: 'line',
      data: data.slice(0,window),
      smooth: true,
      showSymbol: false,
      lineStyle: {
          color: '#808080',
          width: 2,
          type: 'dotted'
      },
    },
    {
      type: 'line',
      data: Array(window-1).concat(data.slice(window-1, data.length)),
      smooth: true,
      showSymbol: false,
      lineStyle: {
          color: '#000000',
          width: 2,
          type: 'dashed'
      },
    },
  ]

}
