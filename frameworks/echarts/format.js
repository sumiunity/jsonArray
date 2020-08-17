/**
 * echarts Formatter
 * =================
 *
 * Converts json arrays into echart series objects. The intention
 * is to simplify the conversion from json array to plot
 *
 * :Author: Nik Sumikawa
 * :Date: April 21, 2020
 */


import {color} from '../colors/Colors'
import jsonArray from '../../jsonArray'

const debug = false


export default class echartsFormat {

  constructor(data) {
    this.data = data
  }


  /**
   * echarts line plot data formatter
   * @param  {stringi} col  column name
   * @return {object}      echarts data series object
   */
  line( col, symbol='none', color='red', lw=1 ){

    var y_axis = []
    for( var i=0; i < this.data.length; i++ ){
      const value = this.data[i][col]

      // catch undefines so we don't skip them when rendering None data
      if( (value === undefined)|(value === '' ) ){
        y_axis.push( undefined )
      }else{
        y_axis.push( value )
      }

    }

    return {
          data: y_axis,
          type: 'line',
          symbol: symbol,
          smooth: true,
          lineStyle: {
                color: color,
                width: lw
            },
      }
  }


  /**
   * echarts area plot data formatter
   * @param  {string} col  column name
   * @return {object}      echarts data series object
   */
  area( col ){

    var y_axis = []
    for( var i=0; i < this.data.length; i++ ){
      const value = this.data[i][col]
      if( (value === undefined)|(value === '' ) ){
        y_axis.push( undefined )
      }else{
        y_axis.push( value )
      }

    }

    return {
          data: y_axis,
          type: 'line',
          areaStyle: {}
      }
  }

  /**
   * Convert the json_array to a list of x/y cooridnates
   * @param  {string} col1  column 1 name, when 'index' is provided, the index value will be used
   * @param  {string} col1  column 2 name
   * @param  {string} color hex or rgb color string
   * @return {Array}       Array of x/y cooridnates
   */
  scatter( col1, col2, color, label, index=0 ){

    // convert the json array to a list of lists containing data
    var coordinates = []
    for( var i=0; i < this.data.length; i++ ){
      var temp

      if( col1 === 'index' ){
        // use the index values as the x-axis
        temp = [i+index, this.data[i][col2]]

      }else{
        // use the col1 value for the x-axis
        temp = [this.data[i][col1], this.data[i][col2]]
      }

      if( label !== undefined) temp.push( this.data[i][label] )

      coordinates.push(temp)
    }

    return {
          name: 'scatter',
          type: 'scatter',
          color: color,
          data: coordinates,
          emphasis: {
            label: {
                formatter: function( params){
                  return `${coordinates[params.dataIndex][2]}`
                },
                show: true,
                position: 'top',
                color: color,
                fontSize: 16
            }
          }
    }
  }

  /**
   * Returns a list of echarts scatter objects colored by the specified att
   *
   * @param  {string} col1  column 1 name, when 'index' is provided, the index value will be used
   * @param  {string} col1  column 2 name
   * @param  {string} color hex or rgb color string
   * @return {Array}       Array of x/y cooridnates
   */
  scatter_by( col1, col2, by, label ){

    // convert to a jsonArray type and groupby week attribute
    const json_array = new jsonArray( this.data )
    const group = json_array.groupby([by])

    var series = []
    var index = 0

    for( var i=0; i < group.length; i++ ){

      // extract the color based on the index and format the data
      // from a json_array to a list of x/y coordinates
      const color_value = color( i, 100, 'entropy_8bit' )

      var format, temp
      if( col1 === 'index' ){
        // use the index for the x-axis
        format = new echartsFormat( group[i].json_obj )
        temp = format.scatter( col1, col2, color_value, label, index )
        index = index + group[i].json_obj.length

      }else{

        // use the col1 value for the x-axis
        format = new echartsFormat( group[i].json_obj )
        temp = format.scatter( col1, col2, color_value, label, index )

      }

      // create a data structure for plotting the scatter plot
      series.push( temp )
    }

    return series
  }


}
