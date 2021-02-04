
// adds the ability to select data from the plot
export default function Selection( option, sliders=false ){

  option['brush'] = {
      toolbox: ['rect', 'polygon', 'lineX', 'lineY', 'keep', 'clear'],
      xAxisIndex: 0,
      outOfBrush: {
          colorAlpha: 0.8
      }
  }

  return option

}
