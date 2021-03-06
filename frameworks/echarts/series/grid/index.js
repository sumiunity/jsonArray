/**
 * echarts grid
 * =================
 *
 * Converts json arrays into echart grid series object
 *
 * :Author: Nik Sumikawa
 * :Date: March 5, 2021
 */


import jsonArray from '../../../../jsonArray'
import propsToSeries from '../propsToSeries'
import get_color from '../../../colors/Colors'

/**
 * Convert the json_array to a line plot
 * @param  {string} colx  column 1 name, when 'index' is provided, the index value will be used
 * @param  {string} coly  column 2 name
 * @param  {object} params parameters used to customize the plot
 * @return {Object}       local object contents
 */
export default function grid( props ){

  var json_array = props.json_array
  if( !(json_array instanceof jsonArray) ){
    json_array = new jsonArray(json_array)
  }

  // check to ensure the minimum set of parameters are available
  if( (props.colx === undefined)|(props.coly === undefined)|(props.value === undefined) ){
    alert( 'boxplot required att : colx, coly and value' )
    return []
  }

  var color_col = props.color
  if( props.color === undefined ){
    color_col = 'color'
    json_array = json_array.create_column( 'color', r => get_color(r[props.value]) )
  }


  var Series = {
    type: 'custom',
    // coordinateSystem: 'cartesian2d',
    renderItem: renderRectangle,
    animation: false,
    encode: {
        x: 0,
        y: 1
    },
    data: json_array.map(r => [
      r[props.colx],
      r[props.coly],
      r[props.value],
      r[color_col],
      r[props.lw],
    ])
  }

  if( props.label === true ){
    Series['label'] = {
        show: true,
        color: "black",
        fontSize:12,
        formatter: (element) => {
          return element.value[2]; // Use sum variable here
        },
    }
  }

  Series = propsToSeries(props, Series)

  return [Series]

}




function renderRectangle(params, api) {

    var xCoor = api.value(0);
    var yCoor = api.value(1);
    var color = api.value(3);
    var lw = api.value(4);

    if( (lw === undefined)|(isNaN(lw)) ) lw = 0.5

    const [x,y] = api.coord([xCoor, yCoor])
    const [w,h] = api.size([1, 1])

    return {
        type: 'rect',
        // color: COLORS[api.value(2)],
        // value: api.value(2),
        shape: {
            x: x,
            y: y,
            width: w,
            height: h
        },

        style: api.style({
            stroke: '#B0B0B0',
            fill: color,
            lineWidth: lw,
        }),
        // styleEmphasis: api.styleEmphasis()
    };
}
