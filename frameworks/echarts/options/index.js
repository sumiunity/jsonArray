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
import echartsTooltip from '../tooltips'


import * as features from './features'
import Line from './charts/line'
import Boxplot from './charts/boxplot'
import Heatmap from './charts/heatmap'
import Scatter from './charts/scatter'
import Bar from './charts/bar'

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


  heatmap( props ){ return this.generate_options( Heatmap, props ) }
  boxplot( props ){ return this.generate_options( Boxplot, props ) }
  scatter( props ){ return this.generate_options( Scatter, props ) }
  bar( props ){ return this.generate_options( Bar, props ) }
  line( props ){ return this.generate_options( Line, props ) }

  selection( props ){ return features.Selection( this, props ) }
  zoom( props ){ return features.DataZoom( this, props ) }
  highlight( props ){
    const options = features.Highlight( this, props )
    this.local_variables( options )
    delete this.json_array
    return this
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

  // appends the series
  append_series( series ){
    this.series = this.series.concat(series)
    return this
  }

  xtick_padding(padding){
    this.grid = {
      ...this.grid,
      ...{bottom: padding}
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
