

import pie from './index'
/**
 * @param  {string} col  column name
 */
export default function fromSeries( props ){

  const group = props.json_array.groupby([props.col])

  return pie({
      ...props,
      ...{
        json_array: group,
        col: 'count',
        name: props.col
        }
  })

}
