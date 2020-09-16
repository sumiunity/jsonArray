/**
 * React Components
 * ===================
 *
 * returns a class containing all available React components based
 * on the module availability
 *
 * @author: Nik Sumikawa
 * @date: Aug 15, 2020
 * @type {Object}
 */



import {enabledComponents, components} from './plugins/Plugins'



export default class ReactComponents extends Object{

  constructor(data) {
    super()

    this.data = data
  }

  get Table(){

    const Table = require('./table/Table').default
    return new Table(this.data).Table
  }


  get semanticUI(){
    if( enabledComponents.semanticUI === false ){
      alert( 'Semantic UI module not installed')
      return {}
    }

    return new components.semanticUI( this.data )
  }


  get Excel(){
    if( enabledComponents.excel === false ){
      alert( 'react-excel-renderer module not installed')
      return {}
    }

    return components.excel
  }

  // return a dictionary containing the various e-charts plotting routines
  get echarts(){

    if( enabledComponents.echarts === false ){
      alert('echarts module not installed. Install echarts and echarts-for-react')
      return {}
    }

    return new components.echarts( this.data )
  }





}
