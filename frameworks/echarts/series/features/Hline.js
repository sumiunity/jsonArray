

import propsToSeries from '../propsToSeries'

// Adds a scatter point for the ends of the error bars
// and a line connecting the scatter poitns
export default function Hline( props ){

  var data
  if( props.data !== undefined ){
    data = props.data

  } else if( (props.colx!==undefined)&(props.coly !== undefined)&(props.colz !== undefined) ){
    data = props.json_array.map( r => {return [r[props.colx], r[props.coly], r[props.colz]]})

  } else {
    alert( 'insufficient attributes')
    return
  }

  var Series = [
    {
        type: 'custom',
        name: 'hLine',
        animation: false,
        legendHoverLink : false,
        silent: true,
        itemStyle: {
            normal: {
                borderWidth: 1.0
            }
        },
        renderItem: (params, api) => render(params, api, props),
        encode: {
            x: [1, 2],
            y: 0,
        },
        data: data,
        z: 100
    },

  ]

  Series = propsToSeries(props, Series)

  return Series
}



function render(params, api, props) {

    var yValue = api.value(0);
    var highPoint = api.coord([api.value(1), yValue]);
    var lowPoint = api.coord([api.value(2), yValue]);

    var Series = {
        type: 'group',
        children: [
        {
            type: 'line',
            transition: ['shape'],
            shape: {
                x1: highPoint[0], y1: highPoint[1],
                x2: lowPoint[0], y2: lowPoint[1]
            },
            style: api.style({
                stroke: api.visual('color'),
                fill: 'green'
            })
        },
      ]
    };

    if( props.color !== undefined ) Series.children[0].style.fill = props.color
    if( props.border !== undefined ) Series.children[0].style.stroke = props.border

    return Series
}
