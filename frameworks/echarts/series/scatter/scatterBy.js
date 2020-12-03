/**
 * echarts Scatter by
 * ==================
 *
 * groups the data based on values in a given column
 * and creates a multicolored scatter plot
 *
 * :Author: Nik Sumikawa
 * :Date: April 21, 2020
 */


import {color} from '../../../colors/Colors'
import jsonArray from '../../../../jsonArray'

import scatter from './index'

/**
 * Returns a list of echarts scatter objects colored by the specified att
 *
 * @param  {string} colx  column 1 name, when 'index' is provided, the index value will be used
 * @param  {string} coly  column 2 name
 * @param  {string} colorBy    color for grouping the samples
 * @return {Array}       Array of x/y cooridnates
 */
export default function scatter_by( props ){

  var json_array = props.json_array
  if( !(json_array instanceof jsonArray) ){
    json_array = new jsonArray(json_array)
  }

  // group samples based on the specified column
  const group = json_array.groupby([props.colorBy])

  var series = []

  for( var i=0; i < group.length; i++ ){

    // extract the color based on the index and format the data
    // from a json_array to a list of x/y coordinates
    const color_value = color( i, 100, 'entropy_8bit' )

    // create a data structure for plotting the scatter plot
    series = series.concat( scatter({
      ...props,
      ...{
        json_array: group[i].json_obj,
        color: color_value,
        groupId: group[i][props.colorBy],
      }}
    ))
  }

  return series
}
