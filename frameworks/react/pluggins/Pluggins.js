/**
 * Pluggin Managements
 * ======================
 *
 * Attemps to import various functionality that is dependent on
 * various modules. When the module is not available, the enable
 * flag is not set, rendering the function not available
 *
 * @author Nik Sumikawa
 * @date Aug 26, 2020
 *
 */

export var enabledComponents = {
  echarts: false,
  semanticUI: false,
  excel: false,
}

// attempt to import the react echarts component
export var components = {
  echarts: undefined,
  semanticUI: undefined,
  excel: undefined,
}


try{
  components.react = require('../plot/echarts/react').react_echarts
  enabledComponents.react = true
}catch{
  // console.log('failed to load echarts. module not installed')
}

try{
  components.semanticUI = require('../framework/SemanticUI')
  enabledComponents.semanticUI = true
}catch{
  // console.log('failed to load semanticUI. module not installed')
}

try{
  components.excel = require('../pluggins/Excel').default
  enabledComponents.excel = true
}catch{
  // console.log('failed to load semanticUI. module not installed')
}
