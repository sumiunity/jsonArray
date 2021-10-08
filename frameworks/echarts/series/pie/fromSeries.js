

import pie from './index'
/**
 * @param  {string} col  column name
 */
export default function fromSeries( props ){

  const group = props.json_array.groupby([props.col])

  console.log( group )
  return pie({
      ...props,
      ...{
        json_array: group,
        value: 'count',
        __label__: props.col
        }
  })

}
