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
import echartsAxis from '../axis'

import * as features from './features'
import Line from './charts/line'
import RollingAvg from './charts/rollingAvg'
import Boxplot from './charts/boxplot'
import Heatmap from './charts/heatmap'
import Scatter from './charts/scatter'
import Bar from './charts/bar'
import Pareto from './charts/pareto'
import Grid from './charts/grid'
import Pie from './charts/pie'
import PieFromSeries from './charts/pie/fromSeries'
import Radar from './charts/radar'
import Waterfall from './charts/waterfall'

import Toolbox from './format/Toolbox'
import legend from './format/legend'


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
  pareto( props ){ return this.generate_options( Pareto, props ) }
  line( props ){ return this.generate_options( Line, props ) }
  rollingAvg( props ){ return this.generate_options( RollingAvg, props ) }
  rectGrid( props ){ return this.generate_options( Grid, props ) }
  pie( props ){ return this.generate_options( Pie, props ) }
  pieFromSeries( props ){ return this.generate_options( PieFromSeries, props ) }
  radar( props ){ return this.generate_options( Radar, props ) }
  waterfall( props ){ return this.generate_options( Waterfall, props ) }



  toolbox( props ){ return Toolbox( this, props ) }
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

    // add the tooltip when provided as a parameter
    if( props.tooltip !== undefined ){
      this.tooltip.from_DataFrame(this.json_array, props.tooltip)
    }

    if( props.delete !== false ) delete this.json_array

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

  legend(position){
    this.legend = legend(position)
  }

  // add a secondary y axis
  secondary_axis( col ){
    this.yAxis.push(  new echartsAxis(col) )
    return this
  }

  // creates a horizontal line across the plotting area
  axhline( value, props={} ){
    const line = features.Axline( value, {
      ...props,
      ...{axis: 'yAxis'}
    })

    this.append_series(line)
    return this

  }

  // creates a horizontal line across the plotting area
  axvline( value, props={} ){

    const line = features.Axline( value, {
      ...props,
      ...{axis: 'xAxis'}
    })

    this.append_series(line)
    return this
  }


}
