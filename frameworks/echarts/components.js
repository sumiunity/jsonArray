/**
 * Echarts Components
 * ===================
 *
 * returns a class containing all available eCharts components based
 * on the module availability
 *
 * @author: Nik Sumikawa
 * @date: Aug 15, 2020
 * @type {Object}
 */

 import echartsFormat from './format'
 import echartsOptions from './options'




export default class eChartsComponents extends Object{

  constructor(data) {
    super()

    this.data = data
  }

  get format(){
    return new echartsFormat( this.data )
  }


  get options(){
    return new echartsOptions( this.data )
  }





}
