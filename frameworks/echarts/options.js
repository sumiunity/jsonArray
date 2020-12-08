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


import jsonArray from '../../jsonArray'
import echartsAxis from './axis'
import echartsSeries from './series'
import echartsTooltip from './tooltips'
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
  heatmap( params ){
    // returns an object for generating a heatmap, similar to
    // the calendar example but with data from a jsonArray
    // example: https://echarts.apache.org/examples/en/editor.html?c=calendar-heatmap


    // check to ensure the minimum set of parameters are available
    if( (params.colx === undefined)|(params.coly === undefined)|(params.value === undefined) ){
      alert( 'boxplot required att : colx, coly and value' )
    }

    // set the x axis values using the Axis class
    this.xAxis = new echartsAxis(params.colx)
    this.xAxis.to_category({values: this.json_array.unique(params.colx, true) })
    this.xAxis.label( params.colx )

    // set the y axis values using the Axis class
    this.yAxis = new echartsAxis(params.coly)
    this.yAxis.to_category({ values: this.json_array.unique(params.coly, true) })
    this.xAxis.label( params.coly )


    this.grid['backgroundColor'] = 'rgb(0, 128, 0)'

    this.visualMap = {
        min: Math.min(...this.json_array.unique(params.value))*100,
        max: Math.max(...this.json_array.unique(params.value))*100,
        calculable: true,
        orient: 'vertical',
        left: 'left',
        bottom: '10%',
        inRange: {
          color: ['green', 'yellow','orange', 'red']
        }
    }

    this.series = [{
        type: 'heatmap',
        data: this.json_array.map(function (item) {

          var value = Number(item[params.value])
          if( params.percentage === true ) value = (Number(item[params.value])*100).toFixed(2)

            return [
              item[params.colx],
              item[params.coly],
              value
            ]
          }),
        label: {
            show: true
        },
    }]

    delete this.json_array

    return this
  }


  /**
   * Convert the json_array to a boxplot options object
   * @param  {string} colx  column x name
   * @param  {string} coly  column y name
   */
  boxplot( params ){

    const boxplot = require('./series/boxplot').default

    // check to ensure the minimum set of parameters are available
    if( (params.colx === undefined)|(params.coly === undefined) ){
      alert( 'boxplot required att : colx and coly' )
    }

    const keys = this.json_array.unique( params.colx )

    // set the x axis values using the Axis class
    this.xAxis = new echartsAxis(params.colx)
    this.xAxis.to_category({ values: keys })
    this.xAxis.axisLabel = { formatter: '{value}' }
    // this.xAxis.boundaryGap = true
    // this.xAxis.nameGap = 30
    // this.xAxis.splitLine = {show: false }

    // set the y axis values using the Axis class
    this.yAxis = new echartsAxis(params.coly)
    this.yAxis.to_value()
    this.yAxis.dynamic_range(this.json_array)
    // this.yAxis.splitArea = {show: true}


    this.series = boxplot( {...params, ...{json_array: this.json_array}} )
    // const echart_series = new echartsSeries( this.json_array )
    // this.series = echart_series.boxplot(params.colx, params.coly, params )

    delete this.json_array

    return this

  }


  /**
   * Convert the json_array to a scatter plot option object
   * @param  {string} colx  column x name
   * @param  {string} coly  column y name
   */
  scatter( params={} ){

    const scatter = require('./series/scatter').default
    const scatter_by = require('./series/scatter/scatterBy').default

    // check to ensure the minimum set of parameters are available
    if( (params.colx === undefined)|(params.coly === undefined)){
      alert( 'scatter plot required att : colx and coly ')
    }

    // set the x axis values using the Axis class
    this.xAxis = new echartsAxis( params.colx, this.json_array )

    // set the y axis values using the Axis class
    this.yAxis = new echartsAxis( params.coly, this.json_array )


    // convert the x-axis to date type when of moment type
    if( this.json_array[0][params.colx] instanceof moment ){
      this.json_array = this.json_array.strftime(params.colx)
      this.xAxis.to_date()
    }


    // convert the x-axis to date type when of moment type
    if( this.json_array[0][params.coly] instanceof moment ){
      this.json_array = this.json_array.strftime(params.coly)
      this.yAxis.to_date()
    }


    var colorBy = params.colorBy
    if( colorBy === undefined) colorBy = params.label

    // const echart_series = new echartsSeries( this.json_array )
    if( (colorBy !== undefined)&(this.json_array.columns.includes(colorBy)) ){

      this.series = scatter_by({
        ...params,
        ...{
            json_array: this.json_array,
            colorBy: colorBy
          }
      })

    }else{
      this.series = scatter({
        ...params,
        ...{json_array: this.json_array}
      })

    }

    delete this.json_array

    return this

  }


  /**
   * Convert the json_array to a scatter plot option object
   * @param  {string} colx  column x name
   * @param  {string} coly  column y name
   */
  bar( params={} ){

    // check to ensure the minimum set of parameters are available
    if( (params.colx === undefined)|(params.coly === undefined) ){
      alert( 'bar plot required att : colx and coly ')
    }

    // set the x axis values using the Axis class
    this.xAxis = new echartsAxis(params.colx)
    this.xAxis.label(params.colx)
    this.xAxis.tick_values(this.json_array.values(params.colx))

    // set the y axis values using the Axis class
    this.yAxis = new echartsAxis(params.coly)

    const echart_series = new echartsSeries( this.json_array )
    this.series = echart_series.bar( params.coly, params)


    delete this.json_array

    return this

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
