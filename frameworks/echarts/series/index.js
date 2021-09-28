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


import jsonArray from '../../../jsonArray'

import scatter from './scatter'
import scatter_by from './scatter/scatterBy'
import boxplot from './boxplot'
import line from './line'
import bar from './bar'
import grid from './grid'
import pie from './pie'
import pieFromSeries from './pie/fromSeries'
import radar from './radar'
import waterfall from './waterfall'
import rollingAvg from './line/rollingAvg'

import ErrorBars from './features/ErrorBars'
import Circle from './features/Circle'
import Vline from './features/Vline'
import Hline from './features/Hline'



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
  pie( props ){ return pie({...props, ...{json_array:this.json_array}}) }
  pieFromSeries( props ){ return pieFromSeries({...props, ...{json_array:this.json_array}}) }
  rectGrid( props ){ return grid({...props, ...{json_array:this.json_array}}) }
  waterfall( props ){ return waterfall({...props, ...{json_array:this.json_array}}) }
  rollingAvg( props ){ return rollingAvg({...props, ...{json_array:this.json_array}}) }
  radar( props ){ return radar({...props, ...{json_array:this.json_array}}) }

  errorbars( props ){ return ErrorBars({...props, ...{json_array:this.json_array}}) }
  circle( props ){ return Circle({...props, ...{json_array:this.json_array}}) }
  vline( props ){ return Vline({...props, ...{json_array:this.json_array}}) }
  hline( props ){ return Hline({...props, ...{json_array:this.json_array}}) }
}
