
import propsToSeries from '../propsToSeries'

/**
 * Convert the json_array to a pie char
 * @param  {string} value  values for pie chart
 * @param  {string} label  name of each section
 */
export default function pie( props ){

  // format the data with and without a label (w/o is the default)
  var data = props.json_array.map(r => { return {value: r[props.value]}})
  if( props.label !== undefined ){
    data = props.json_array.map(r => {
      return {
        value: r[props.value],
        name: r[props.label]
      }
    })
  }


  var Series = {
    type: 'pie',
    avoidLabelOverlap: false,
    radius: ['40%', '70%'],
    labelLine: {
                show: false
            },
    data: data
  }

  if( props.label !== undefined ){
    Series['label'] = {
        show: false,
        position: 'center'
    }

    Series['emphasis'] = {
        label: {
            show: true,
            fontSize: '40',
            fontWeight: 'bold'
        }
    }
  }

  Series = propsToSeries(props, Series)

  return [Series]

}
