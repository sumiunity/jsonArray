

import propsToSeries from '../propsToSeries'
import pie from './index'
/**
 * @param  {string} col  column name
 */
export default function fromSeries( props ){

  const group = props.json_array.groupby([props.col])

  return pie({
    json_array: group,
    value: 'count',
    label: props.col
  })

}
