/**
 * echarts Options
 * =================
 *
 * Converts json arrays into echart option objects. This is
 * intended for customize plots
 *
 * :Author: Nik Sumikawa
 * :Date: July 7, 2020
 */


import jsonArray from '../../../jsonArray'
import echartsAxis from '../axis'
import echartsSeries from '../series'
import echartsTooltip from '../tooltips'
import moment from 'moment'





export default class echartsOptions extends Object {

  constructor(data) {
    super()


    this.json_array = data

    // cast the variable to a jsonArray type when it is a standard array
    if( (this.json_array instanceof jsonArray) === false ){
      this.json_array  = new jsonArray( this.json_array  )
    }

    // set the default plot parameters
    this.default()
  }


  // set the default plot parameters
  default(){

    // default animations to off for performance
    this.animation = false

    this.tooltip = new echartsTooltip()

    this.grid = {
        left: '10%',
        right: '10%',
        bottom: '15%'
    }

    this.series = []
  }



  /**
   *   returns an object for generating a heatmap, similar to
   *   the calendar example but with data from a jsonArray
   *   example: https://echarts.apache.org/examples/en/editor.html?c=calendar-heatmap
   *
   * @param  {string} colx  column 1 name, which will be used for the x_axis
   * @param  {string} coly  column 2 name, which will be used for the y_axis
   * @param  {string} value column name, which will be used for the cell value
   * @param  {string} tooltip string used in the tool tip
   * @return {Array}       Array of x/y cooridnates
   */
  heatmap( props ){
    const optionFunc = require('./heatmap').default
    return this.generate_options( optionFunc, props )
  }


  /**
   * Convert the json_array to a boxplot options object
   * @param  {string} colx  column x name
   * @param  {string} coly  column y name
   */
  boxplot( props ){
    const optionFunc = require('./boxplot').default
    return this.generate_options( optionFunc, props )
  }



  /**
   * Convert the json_array to a bar plot option object
   * @param  {string} colx  column x name
   * @param  {string} coly  column y name
   */
  scatter( props={} ){
    const optionFunc = require('./scatter').default
    return this.generate_options( optionFunc, props )
  }

  /**
   * Convert the json_array to a bar plot option object
   * @param  {string} colx  column x name
   * @param  {string} coly  column y name
   */
  bar( props={} ){
    const optionFunc = require('./bar').default
    return this.generate_options( optionFunc, props )
  }

  /**
   * Convert the json_array to a line plot option object
   * @param  {string} colx  column x name
   * @param  {string} coly  column y name
   */
  line( props={} ){
    const optionFunc = require('./line').default
    return this.generate_options( optionFunc, props )
  }



  // wrapper used to generate the options based on the provided function
  generate_options( func, props ){
    const options = func( this.json_array, props )

    this.local_variables( options )

    delete this.json_array

    return this
  }


  // create a local copy of each option variable
  local_variables( options ){
    const keys = Object.keys( options )
    for( var i=0; i < keys.length; i++ ){
      const key = keys[i]
      this[key] = options[key]
    }
  }

  // creates a horizontal line across the plotting area
  axhline( value, color='red' ){
    this.series = this.series.concat({
      name: 'limit',
      type: 'line',
      color: color,
      markLine: {
          symbol: "none",
          data: [{
            tooltip: {show:false},
            name: value.toExponential(3),
            yAxis: value,
            label: {
              formatter: value.toExponential(3),
              position: 'end'
            }
          }]
      }
    })

    return this
  }

  // creates a horizontal line across the plotting area
  axvline( value, color='red' ){
    this.series = this.series.concat({
      name: 'limit',
      type: 'line',
      color: color,
      markLine: {
          symbol: "none",
          data: [{
            tooltip: {show:false},
            name: value.toExponential(3),
            xAxis: value,
            label: {
              formatter: value.toExponential(3),
              position: 'end'
            }
          }]
      }
    })

    return this
  }


}
