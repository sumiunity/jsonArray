

import jsonArray from '../../../../jsonArray'

// Adds a scatter point for the ends of the error bars
// and a line connecting the scatter poitns
export default function ErrorBars( props ){

  if( (props.min === undefined)|(props.max === undefined) ){
    alert( 'minimum attributes: min and max')
    return
  }

  var json_array = props.json_array
  if( !(json_array instanceof jsonArray) ){
    json_array = new jsonArray(json_array)
  }


  var errorbars = json_array.map( r => {return [r.__index__, r[props.min], r[props.max]]})
  // console.log( props )
  // console.log( errorbars )

  var Series = [
    {
        type: 'custom',
        name: 'error',
        itemStyle: {
            normal: {
                borderWidth: 1.5
            }
        },
        renderItem: ErrorBar,
        encode: {
            x: 0,
            y: [1, 2]
        },
        data: errorbars,
        // z: 100
    },

    // scatter point for the minimum value
    json_array.echartsSeries.scatter({
      colx:'__index__',
      coly:props.min,
      symbol: 'triangle',
      color: 'green'
    })[0],

    // scatter point for the maximum value
    json_array.echartsSeries.scatter({
      colx:'__index__',
      coly:props.max,
      symbol: 'diamond',
      color: 'blue'
    })[0],
  ]


  // scatter point for the average value when available
  if( props.avg !== undefined ){
    Series.push(
      json_array.echartsSeries.scatter({
        colx:'__index__',
        coly:props.avg,
        symbol: 'square',
        color: 'red'
      })[0]
    )
  }

  return Series
}



function ErrorBar(params, api) {

    var xValue = api.value(0);
    var highPoint = api.coord([xValue, api.value(1)]);
    var lowPoint = api.coord([xValue, api.value(2)]);

    var style = api.style({
        stroke: api.visual('color'),
        fill: null
    });

    return {
        type: 'group',
        children: [
        {
            type: 'line',
            shape: {
                x1: highPoint[0], y1: highPoint[1],
                x2: lowPoint[0], y2: lowPoint[1]
            },
            style: style
        },
      ]
    };
}
