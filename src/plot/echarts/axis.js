/**
 * Echarts Axis formatter
 * =========================
 *
 * Routines to automatically change the axis format based on
 * specifications. The purpose is to limit axis configuration
 * to simplify the plotting process. At the same time, It is
 * possible to extend the axis parameters as desired.
 *
 * :Author: Nik Sumikawa
 * :Date: July 22, 2020
 */


export default class echartsAxis extends Object {

  constructor() {
    super()
    // super(...array)
  }

  label( label ){
    if( label !== undefined ){
      this.name = label
    }
  }

  tick_values( values ){
    if( values !== undefined ){
      this.data = values
    }
  }

  // process the parameters object to configure the plot axis
  process_params( params ){

    // add the label to the axis configuration
    this.label( params.label )

    // add the tick values based on the plot type
    if( (params.label !== undefined)&(params.values !== undefined) ){
      switch( params.type ){
        case 'category':
          this.tick_values( [...new Set(params.values)] )
          break;

        default:
          break;
      }
    }
  }

  category( params ){
    this.type = 'category'
    this.splitArea ={
        show: true
    }

    params['type'] = 'category'

    // set the label when provided
    this.process_params( params )

  }

  // formats the axis to display values
  value( params ){
    this.type = 'value'

    // set the label when provided
    this.process_params( params )
  }


  date( params ){

    var strftime = 'MM-DD'
    if( params.strftime !== undefined ) strftime = params.strftime

    this.type = 'time'
    this.axisLabel = {
      formatter: (function(value){
        return moment( value.format(strftime))
      })
    }

    // set the label when provided
    this.process_params( params )

  }

}
