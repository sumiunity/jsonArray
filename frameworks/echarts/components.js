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

 import echartsOptions from './options'




export default class eChartsComponents extends Object{

  constructor(data) {
    super()

    this.data = data
  }

  get options(){
    return new echartsOptions( this.data )
  }





}
