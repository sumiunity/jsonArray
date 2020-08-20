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
import jsonArrayTable from './table/jsonArrayTable'

var enabledComponents = {
  echarts: false,
  semanticUI: false,
}

// attempt to import the react echarts component
var components = {
  echarts: undefined,
  semanticUI: undefined,
}


try{
  components.react = require('./plot/echarts/react').react_echarts
  enabledComponents.react = true
}catch{
  // console.log('failed to load echarts. module not installed')
}

try{
  components.semanticUI = require('./framework/SemanticUI').default
  enabledComponents.semanticUI = true
}catch{
  // console.log('failed to load semanticUI. module not installed')
}



export default class ReactComponents extends Object{

  constructor(json_array) {
    super()

    this.json_array = json_array
    if( !(json_array instanceof jsonArray) ){
      this.json_array = new jsonArray( json_array )
    }

  }

  get table(){ return new jsonArrayTable(this.json_array) }

  get semanticUI(){
    if( enabledComponents.semanticUI === false ){
      alert( 'Semantic UI module not installed')
      return
    }

    return new components.semanticUI( this.json_array )
  }



  plot( plot_type, params={} ){

    if( this.echarts === false ){
      alert('echarts module not installed. Install echarts and echarts-for-react')
      return
    }

    var plotOptions
    const echarts = this.json_array.echartsOptions()

      // return the plot options based on the specified plot type
      switch( plot_type ){

        case 'heatmap':
          plotOptions = echarts.heatmap( params )

        case 'boxplot':
          plotOptions = echarts.boxplot( params )

        case 'scatter':
          plotOptions = echarts.scatter( params )

        case 'bar':
          plotOptions = echarts.bar( params )

        default:
          alert('unknown plot type: ' + plot_type)
      }

    return components.echart(
      plotOptions,
      params
    )
  }


}
