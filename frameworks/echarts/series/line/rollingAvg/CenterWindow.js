
// returns a rolling average line where the average is
// computed based on the center of the window
export default function CenterWindow(data, window){


  var midStart = Math.floor(window/2) + 1
  var midEnd = data.length - Math.floor(window/2) - 1

  return [
    {
      type: 'line',
      data: data.slice(0,midStart),
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
      data: Array(midStart-1).concat(data.slice(midStart-1, midEnd+1)),
      smooth: true,
      showSymbol: false,
      lineStyle: {
          color: '#000000',
          width: 2,
          type: 'dashed'
      },
    },
    {
      type: 'line',
      data: Array(midEnd).concat(data.slice(midEnd, data.length)),
      smooth: true,
      showSymbol: false,
      lineStyle: {
          color: '#808080',
          width: 2,
          type: 'dotted'
      },
    }
  ]

}
