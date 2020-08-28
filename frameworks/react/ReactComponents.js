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


import jsonArray from '../../jsonArray'

import {enabledComponents, components} from './pluggins/Pluggins'



export default class ReactComponents extends Object{

  constructor(json_array) {
    super()

    this.json_array = json_array
    if( !(json_array instanceof jsonArray) ){
      this.json_array = new jsonArray( json_array )
    }

  }

  get Table(){

    const Table = require('./table/Table').default

    return new Table(this.json_array).Table
  }


  get semanticUI(){
    if( enabledComponents.semanticUI === false ){
      alert( 'Semantic UI module not installed')
      return {}
    }

    return new components.semanticUI( this.json_array )
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

    return new components.echarts( this.json_array )
  }





}
