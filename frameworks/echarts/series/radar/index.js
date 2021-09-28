
import propsToSeries from '../propsToSeries'

/**
 * Convert the json_array to a Radar char
 * @param  {string} col  column used to generate the radar values
 */
export default function radar( props ){


  var Series = {
    // name: 'Budget vs spending',
    type: 'radar',
    data: [
      {
        value: props.json_array.map(r => r[props.value]),
        name: props.col
      }
    ]
  }

  Series = propsToSeries(props, Series)

  return [Series]

}
