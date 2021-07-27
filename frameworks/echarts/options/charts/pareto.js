
import bar from './bar'

/**
 * Convert the json_array to a scatter plot option object
 * @param  {string} colx  column x name
 * @param  {string} coly  column y name
 */
export default function Pareto( json_array, props={} ){

  // check to ensure the minimum set of parameters are available
  if( (props.col === undefined) ){
    alert( 'pareto plot required att : col ')
  }

  var data = json_array.filter(r => r[props.col] !== '')
  var pareto = data.groupby([props.col])



  var att = 'count'
  if( props.ratio === true ) att = 'ratio'

  pareto = pareto.sort_values('count', false)

  const total = pareto.sum('count')
  var cumsum = 0

  // creat the cumsum and hold ratio
  pareto = pareto.row_apply(r => {
      cumsum = cumsum + r.count
      r['cumsum'] = cumsum/total
      r['ratio'] = r.count/total

      return r
  })

  // generate the bar chart for the pareto 
  var option = bar(pareto, {colx: props.col, coly: att})

  // add a lineplot for the cusum when specified
  if( props.cumsum === true ){
    option.series = option.series.concat(
      pareto.echartsSeries.line({
        colx: props.col,
        coly: 'cumsum',
      })
    )
  }


  // return the bar plot options using the pareto data
  return option


}
