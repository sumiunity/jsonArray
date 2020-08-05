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


import {color} from '../Colors'
import jsonArray from '../../jsonArray'

import { prepareBoxplotData } from 'echarts/extension/dataTool';

const debug = false


export default class echartsSeries extends Object {

  constructor(data) {
    super()

    this.json_array = data;

    // convert to a jsonArray type and groupby week attribute
    if( !this.json_array instanceof jsonArray ){
      this.json_array = new jsonArray( this.json_array )
    }

  }


  /**
   * echarts line plot data formatter
   * @param  {stringi} col  column name
   * @return {object}      echarts data series object
   */
  line( col, params={} ){

    const param_keys = Object.keys(params)

    // set defaults for missing parameter values
    if( !param_keys.includes('symbol') ) params['symbol'] = 'none'
    if( !param_keys.includes('color') ) params['color'] = 'red'
    if( !param_keys.includes('lw') ) params['lw'] = 1

    var y_axis = []
    for( var i=0; i < this.json_array.length; i++ ){
      const value = this.json_array[i][col]

      // catch undefines so we don't skip them when rendering None data
      if( (value === undefined)|(value === '' ) ){
        y_axis.push( undefined )
      }else{
        y_axis.push( value )
      }

    }

    this.data = y_axis
    this.type = 'line'
    this.symbol = params['symbol']
    this.smooth = true
    this.lineStyle= {
          color: params['color'],
          width: params['lw']
      }

    delete this.json_array

    return this
  }


  /**
   * echarts area plot data formatter
   * @param  {string} col  column name
   * @return {object}      echarts data series object
   */
  area( col ){

    var y_axis = []
    for( var i=0; i < this.json_array.length; i++ ){
      const value = this.json_array[i][col]
      if( (value === undefined)|(value === '' ) ){
        y_axis.push( undefined )
      }else{
        y_axis.push( value )
      }

    }

    this.data= y_axis
    this.type= 'line'
    this.areaStyle= {}

    delete this.json_array

    return this
  }

  /**
   * Convert the json_array to a list of x/y cooridnates
   * @param  {string} colx  column 1 name, when 'index' is provided, the index value will be used
   * @param  {string} coly  column 2 name
   * @param  {object} params parameters used to customize the plot
   * @return {Object}       local object contents
   */
  scatter( col1, col2, params={} ){

    const param_keys = Object.keys(params)

    // set defaults for missing parameter values
    if( !param_keys.includes('color') ) params['color'] = 'blue'
    if( !param_keys.includes('label') ) params['label'] = null

    // set default color scheme for specific label types
    if( params['label'] === true ) params['color'] = 'red'
    if( params['label'] === false ) params['color'] = 'blue'
    if( params['label'] === 'MARKED' ) params['color'] = 'green'


    // convert the json array to a list of lists containing data
    var coordinates = []
    for( var i=0; i < this.json_array.length; i++ ){
      var temp

      // if( col1 === 'index' ){
      //   // use the index values as the x-axis
      //   temp = [i+index, this.json_array[i][col2]]
      //
      // }else{
      //   // use the col1 value for the x-axis
      //   temp = [this.json_array[i][col1], this.json_array[i][col2]]
      // }

      temp = [this.json_array[i][col1], this.json_array[i][col2]]

      if( params['label'] !== null) temp.push( params['label'] )

      coordinates.push(temp)
    }

    this.name = 'scatter'
    this.type = 'scatter'
    this.color= params['color']
    this.data = coordinates

    // add tooltips when the label is provided
    if( params['label'] !== null){
      this.emphasis = {
        label: {
          formatter: function( params){
            return `${coordinates[params.dataIndex][2]}`
          },
          show: true,
          position: 'top',
          color: params['color'] ,
          fontSize: 16
        }
      }
    }

    delete this.json_array

    return this

  }

  /**
   * Returns a list of echarts scatter objects colored by the specified att
   *
   * @param  {string} col1  column 1 name, when 'index' is provided, the index value will be used
   * @param  {string} col1  column 2 name
   * @param  {string} by    color for grouping the samples
   * @return {Array}       Array of x/y cooridnates
   */
  scatter_by( col1, col2, by, params={} ){

    // group samples based on the specified column
    const group = this.json_array.groupby([by])

    var series = []

    for( var i=0; i < group.length; i++ ){

      // extract the color based on the index and format the data
      // from a json_array to a list of x/y coordinates
      const color_value = color( i, 100, 'entropy_8bit' )

      const echart_series = new echartsSeries( group[i].json_obj )

      // create a data structure for plotting the scatter plot
      series.push( echart_series.scatter(
        col1,
        col2,
        { color: color_value,
          label: group[i][by],
        }
      ))
    }

    return series
  }

  /**
   * Convert the json_array to a format for generating a boxplot
   * @param  {string} colx  column 1 name, when 'index' is provided, the index value will be used
   * @param  {string} coly  column 2 name
   * @param  {object} params parameters used to customize the plot
   * @return {Object}       local object contents
   */
  boxplot( colx, coly, params={} ){

    // extract the parameter keys
    const param_keys = Object.keys(params)

    // group the data based on the boxplot groups
    const keys = this.json_array.unique( colx )
    const groups = this.json_array.groupby([colx])

    // group the data based on the unique column values
    var group_values = []
    for( var i=0; i < groups.length; i++ ){
      group_values.push(
        groups[i].json_obj.map(row => row[coly])
      )
    }

    // // leverage the echarts function to generate the data
    const echartsData = prepareBoxplotData(group_values)

    // format the boxplot results as a series
    var series = [
        {
            name: 'boxplot',
            type: 'boxplot',
            data: echartsData.boxData,
        },
        {
            name: 'outlier',
            type: 'scatter',
            data: echartsData.outliers
        }
    ]

    // when specified, overlay a scatter plot that highlights
    // the location of all 'MARKED' samples in the specified
    // label column
    if( param_keys.includes('label') ){

      // create a mapping between the x column values and the integer
      // values used for the boxplot
      var mapping = {}
      // keys.forEach((element, i) => mapping[element] = echartsData.axisData[i])
      keys.forEach((element, i) => mapping[element] = i)
      this.json_array = this.json_array.copy_column( colx, 'boxplot_x' )
      this.json_array = this.json_array.replace('boxplot_x', mapping)

      const scatter = this.json_array.filter( row => row[params['label']] === 'MARKED')

      // create a scatter plot and add to the existing series
      const echart_series = new echartsSeries( scatter )
      series.push( echart_series.scatter(
        'boxplot_x',
        coly,
        {
          label: 'MARKED',
        }
      ))

    }

    return series
  }
}
