/**
 * Scatter Overlay
 * ===================
 *
 * Overlays a scatter plot containing all samples
 * on top of an existing boxplot
 *
 * @author Nik Sumikawa
 * @date Dec 2, 2020
 *
 */


import jsonArray from '../../../../jsonArray'
import scatter from '../scatter'
import scatter_by from '../scatter/scatterBy'

 // when specified, overlay a scatter plot that highlights
 // the location of all 'MARKED' samples in the specified
 // label column
export default function scatter_overlay( props ){

  var json_array = props.json_array
  if( !(json_array instanceof jsonArray) ){
    json_array = new jsonArray(json_array)
  }


  // group the data based on the boxplot groups
  const keys = json_array.unique( props.colx )

  // create a mapping between the x column values and the integer
  // values used for the boxplot
  var mapping = {}
  // keys.forEach((element, i) => mapping[element] = echartsData.axisData[i])
  keys.forEach((element, i) => mapping[element] = i)
  json_array = json_array.copy_column( props.colx, 'boxplot_x' )
  json_array = json_array.replace('boxplot_x', mapping)
  json_array = json_array.astype({'boxplot_x': 'int'})


  if( props.overlayFilter ) json_array = json_array.filter( props.overlayFilter )

  // create multicolored scatter plot when colorBy attribute is provided
  var scatterFunc = scatter
  if( props.colorBy !== undefined ) scatterFunc = scatter_by


  return scatterFunc({
      ...props,
      ...{
        colx: 'boxplot_x',
        json_array: json_array,
      }}
    )

}
