
// returns a rolling average line where the average is
// computed based on the center of the window
export default function CenterWindow(data, window){



  return [
    {
      type: 'line',
      data: data,
      smooth: true,
      showSymbol: false,
      lineStyle: {
          color: '#000000',
          width: 2,
          type: 'dashed'
      },
    }
  ]

}
