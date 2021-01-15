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


import {color} from '../../colors/Colors'
import jsonArray from '../../../jsonArray'

import scatter from './scatter'
import scatter_by from './scatter/scatterBy'

import boxplot from './boxplot'
import line from './line'
import bar from './bar'
import ErrorBars from './features/ErrorBars'



export {default as scatter} from './scatter'
export {default as scatter_by} from './scatter/scatterBy'


export default class echartsSeries extends Object {

  constructor(data) {
    super()

    this.json_array = data;

    // convert to a jsonArray type and groupby week attribute
    if( !this.json_array instanceof jsonArray ){
      this.json_array = new jsonArray( this.json_array )
    }

  }

  scatter( props ){ return scatter({...props, ...{json_array:this.json_array}}) }
  scatter_by( props ){ return scatter_by({...props, ...{json_array:this.json_array}}) }
  boxplot( props ){ return boxplot({...props, ...{json_array:this.json_array}}) }
  line( props ){ return line({...props, ...{json_array:this.json_array}}) }
  bar( props ){ return bar({...props, ...{json_array:this.json_array}}) }
  errorbars( props ){ return ErrorBars({...props, ...{json_array:this.json_array}}) }
}
