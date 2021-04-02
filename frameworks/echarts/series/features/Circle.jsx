

import propsToSeries from '../propsToSeries'

export default function Circle( props ){
  
  var Series = {
      type: 'custom',
      renderItem: (params, api) => renderItem(params, api, props),
      animation: false,
      legendHoverLink : false,
      silent: true,
      data: props.data,
      z: 0,
      zlevel: 0,
      encode: {
          x: 0,
          y: 1
      },
  }

  Series = propsToSeries(props, Series)

  return Series

}

function renderItem(params, api, props) {

    const [x,y] = api.coord([
      api.value(0),
      api.value(1)
    ])

    const radius = Math.max(...api.size([props.radius, props.radius]))

    var Series = {
        type: 'circle',
        shape: {
          cx: x,
          cy: y,
          r: radius,
        },
        z: 0,
        zlevel: 0,
        style: api.style({
            fill: 'red',
            stroke: 'red'
        })
    }

    if( props.color !== undefined ) Series.style.fill = props.color
    if( props.border !== undefined ) Series.style.stroke = props.border

    return Series
}
