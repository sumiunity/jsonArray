
// Standardize method to map prop variables to series to
// avoid multiple changes in multiple files
export default function propsToSeries(props, Series){

    if( props.name !== undefined ) Series['name'] = props.name
    if( props.stacked !== undefined ) Series['stack'] = props.stacked
    if( props.color !== undefined ) Series['color'] = props.color
    if( props.smooth !== undefined ) Series['smooth'] = props.smooth
    if( props.symbol !== undefined ) Series['symbol'] = props.symbol
    if( props.symbolSize !== undefined ) Series['symbolSize'] = props.symbolSize
    if( props.lineStyle !== undefined ) Series['lineStyle'] = props.lineStyle
    if( props.axis !== undefined ) Series['yAxisIndex'] = props.axis
    if( props.z !== undefined ) Series['z'] = props.z
    if( props.zIndex !== undefined ) Series['zlevel'] = props.zIndex
    if( props.emphasis !== undefined ) Series['emphasis'] = props.emphasis

    // barplot props
    if( props.barGap !== undefined ) Series['barGap'] = props.barGap

    if( props.label !== undefined ){
      Series['label'] = {
        show: true,
        position: 'top',
        formatter: props.label
      }
      Series['showSymbol'] = true
    }
    if( props.lw !== undefined ) Series['itemStyle'] = {normal: {borderWidth:props.lw}}

    return Series
}
