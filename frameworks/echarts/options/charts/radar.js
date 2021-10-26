
import RadarSeries from '../../series/radar'

/**
 * Convert the json_array to a radar plot option object
 * @param  {string} colx  column x name
 * @param  {string} coly  column y name
 */
export default function radar( json_array, props={} ){

  // check to ensure the minimum set of parameters are available
  if( (props.col === undefined)|(props.value === undefined) ){
    alert( 'radar plot required att : col and value ')
  }

  // generate the radar plot grid
  var indicator = []
  json_array.forEach( row => {
    var maxValue = json_array.max(props.value)
    if( props.maxValue !== undefined ) maxValue = props.maxValue[props.col]

    indicator.push({
      name: row[props.col],
      max: maxValue
    })
  })

  var series = RadarSeries( {
    ...props,
    ...{
      json_array: json_array,
    }} )


  return {
    radar: {indicator: indicator},
    series: series,
  }

}
