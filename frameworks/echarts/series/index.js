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

var prepareBoxplotData
try{
  prepareBoxplotData =  require( 'echarts/extension/dataTool').prepareBoxplotData
}catch{ console.log( 'echarts module not implemented')}


export default class echartsSeries extends Object {

  constructor(data) {
    super()

    this.json_array = data;

    // convert to a jsonArray type and groupby week attribute
    if( !this.json_array instanceof jsonArray ){
      this.json_array = new jsonArray( this.json_array )
    }

  }


}
