

// adds the ability to zoom into plots
export default function DataZoom( option, props ){

  if( option.dataZoom === undefined ) option['dataZoom'] = []


  var params = props
  if( params === undefined ){
    params = {
      scroll: true,
      xAxis: false,
      yAxis: false,
      sliders: {
        xAxis: true,
        yAxis: true,
      }
    }
  }

  if( params.scroll ){
    var scrollZoom = {
        type: 'inside',
        start: 0,
        end: 100
    }

    if( params.xAxis ) scrollZoom['orient'] = 'horizontal'
    if( params.yAxis ) scrollZoom['orient'] = 'vertical'

    option['dataZoom'] = option['dataZoom'].concat(scrollZoom)
  }

  if( params.sliders !== undefined ){
    const icon = 'M10.7,11.9H9.3c-4.9,0.3-8.8,4.4-8.8,9.4c0,5,3.9,9.1,8.8,9.4h1.3c4.9-0.3,8.8-4.4,8.8-9.4C19.5,16.3,15.6,12.2,10.7,11.9z M13.3,24.4H6.7v-1.2h6.6z M13.3,22H6.7v-1.2h6.6z M13.3,19.6H6.7v-1.2h6.6z'

    if( params.sliders.xAxis){
      option['dataZoom'] = option['dataZoom'].concat(
        {
          type: 'slider',
          show: true,
          xAxisIndex: 0,
          start: 0,
          end: 100,
          height: 7,
          bottom: 8,
          showDataShadow: false,
          handleSize: 15,
          handleIcon: icon,
        }
      )
    }

    if( params.sliders.yAxis){
      option['dataZoom'] = option['dataZoom'].concat(
        {
            type: 'slider',
            show: true,
            yAxisIndex: 0,
            start: 0,
            end: 100,
            width: 7,
            showDataShadow: false,
            handleSize: 15,
            handleIcon: icon
          }
      )
    }
  }

  // console.log( 'what is this', sliders)
  // console.log( 'soom', option)

    return option
}
