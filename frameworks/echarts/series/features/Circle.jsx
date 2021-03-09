


export default function Circle( props ){

  console.log( 'do we create a Circle' ,props.data)
  return {
      type: 'custom',
      renderItem: (params, api) => renderItem(params, api, props),
      data: props.data,
      encode: {
          x: 0,
          y: 1
      },
  }

}

function renderItem(params, api, props) {

    console.log('item rendered')
    var xCoor = api.value(0);
    var yCoor = api.value(1);
    var xRadius = api.value(2);
    var yRadius = api.value(3);

    console.log( 'api', props)

    const [x,y] = api.coord([xCoor, yCoor])
    const [w,h] = api.size([2, 2])

    var Series = {
        type: 'circle',
        shape: {
          cx: x,
          cy: y,
          r: props.radius,
        },
        z2: -1,
        style: api.style({
            fill: 'transparent',
            stroke: 'red'
        })
    }

    console.log( 'was the circle created', x, y, props.radius)
    // let color = api.visual('color');
    if( props.fill !== undefined ) Series.style.fill = props.color
    if( props.border !== undefined ) Series.style.stroke = props.border

    return Series
}
