
// Standardize method to map prop variables to series to
// avoid multiple changes in multiple files
export default function propsToSeries(props, Series){

    if( props.name !== undefined ) Series['name'] = props.name
    if( props.stacked !== undefined ) Series['stack'] = props.stacked
    if( props.color !== undefined ) Series['color'] = props.color
    if( props.smooth !== undefined ) Series['smooth'] = props.smooth
    if( props.symbol !== undefined ) Series['symbol'] = props.symbol
    if( props.lineStyle !== undefined ) Series['lineStyle'] = props.lineStyle
    if( props.axis !== undefined ) Series['yAxisIndex'] = props.axis

    return Series
}
