/**
 * echarts Scatter
 * =================
 *
 * Converts json arrays into echart scatter series object
 *
 * :Author: Nik Sumikawa
 * :Date: April 21, 2020
 */


import jsonArray from '../../../../jsonArray'

/**
 * Convert the json_array to a list of x/y cooridnates
 * @param  {string} colx  column 1 name, when 'index' is provided, the index value will be used
 * @param  {string} coly  column 2 name
 * @param  {object} params parameters used to customize the plot
 * @return {Object}       local object contents
 */
export default function scatter( props ){

  var json_array = props.json_array
  if( !(json_array instanceof jsonArray) ){
    json_array = new jsonArray(json_array)
  }

  // set default color scheme for specific label types
  var color = props.color
  switch( props.groupId ){
    case true:
      color = 'red'
      break

    case false:
      color = 'blue'
      break

    case 'MARKED':
      color = 'green'
      break

    default:
      if( color === undefined ) color = 'blue'
      break
  }


  // convert the json array to a list of lists containing data
  var coordinates = []
  for( var i=0; i < json_array.length; i++ ){
    var temp

    // the dataframe index was pushed into the plot data in addition to the
    // data used for plotting. This was used to locate the part by index
    // number after splitting it for visualization purposes
    temp = [
      json_array[i][props.colx],
      json_array[i][props.coly],
      json_array[i]['__index__']]

    if( props.colorBy !== undefined) temp.push(props.colorBy)

    coordinates.push(temp)
  }

  var Series = {
    name: 'scatter',
    type: 'scatter',
    color: color,
    data: coordinates
  }

  if( props.symbol !== undefined ) Series['symbol'] = props.symbol

  // add tooltips when the label is provided
  if( props.colorBy !== undefined ){
    Series['emphasis'] = {
      label: {
        formatter: function( params){
          return `${coordinates[params.dataIndex][2]}`
        },
        show: true,
        position: 'top',
        color: color ,
        fontSize: 16
      }
    }
  }

  return [Series]

}
