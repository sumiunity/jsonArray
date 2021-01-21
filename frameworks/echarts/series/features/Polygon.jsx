
import echarts from "echarts"


export default function Polygon( props ){

  return {
      type: 'custom',
      renderItem: (params, api) => renderItem(params, api, props),
      data: props.data
  }

}

function renderItem(params, api, props) {
    if (params.context.rendered) {
        return;
    }

    params.context.rendered = true;

    let points = [];
    for (let i = 0; i < props.data.length; i++) {
        points.push(api.coord(props.data[i]));
    }


    var Series = {
        type: 'polygon',
        shape: {
            points: echarts.graphic.clipPointsByRect(points, {
                x: params.coordSys.x,
                y: params.coordSys.y,
                width: params.coordSys.width,
                height: params.coordSys.height
            })
        },
        style: api.style({
            fill: 'transparent',
            stroke: 'red'
        })
    }

    // let color = api.visual('color');
    if( props.fill !== undefined ) Series.style.fill = props.color
    if( props.border !== undefined ) Series.style.stroke = props.border

    return Series
}
