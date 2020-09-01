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

import moment from 'moment'

export default class echartsAxis extends Object {

  constructor( json_array=[], col='' ) {
    super()
    // super(...array)
    //
    this.initialize( json_array, col )
  }

  // default axis parameters
  default(){
    this.type = 'value'
    this.scale = true
  }

  /**
   * Initializes the axis based on the data type. this
   * attempts to define the axis automatically. It's
   * possible to overwrite this for custom plotting
   * @param  {Array} json_array  jsonArray
   * @param  {String} col       Column name
   * @return {null}             nothing is returned
   */
  initialize( json_array, col ){

    if( json_array === undefined ) return null
    if( json_array.length === 0 ) return null
    if( col === undefined ) return null
    if( col === '' ) return null

    // set the axis label
    this.name = col

    switch( json_array.dtypes[col] ){
      case 'string' :
        this.type = 'category'
        this.data = json_array.unique(col)
        break

      // format date columns
      case 'datetime':
      case 'strftime':
        this.type = 'time'
        this.axisLabel = {
          formatter: (function(value){
            return moment(value).format('YYYY-MM-DD')
          })
        }
        break;

      default:
        this.type = 'value'
        this.scale = true
    }
  }




  label( label ){
    if( label !== undefined ){
      this.name = label
    }
  }

  tick_values( values ){
    if( values !== undefined ){
      this.type = 'category'
      this.data = values
    }
  }

  // process the parameters object to configure the plot axis
  process_params( params ){

    // add the label to the axis configuration
    this.label( params.label )

    switch( params.type ){
      case 'category':
        this.tick_values( [...new Set(params.values)] )
        break;

      default:
        break;
    }
  }

  // formats the axis to display categories
  to_category( params={} ){
    this.type = 'category'
    this.splitArea ={
        show: true
    }

    params['type'] = 'category'

    // set the label when provided
    this.process_params( params )

  }

  // formats the axis to display values
  to_value( params={} ){
    this.type = 'value'

    // set the label when provided
    this.process_params( params )
  }


  // format the axis to display dates
  to_date( params={} ){

    var strftime = 'MM-DD'
    if( params.strftime !== undefined ) strftime = params.strftime

    this.type = 'time'
    this.axisLabel = {
      formatter: (function(value){
        return moment(value).format(strftime)
      })
    }

    // set the label when provided
    this.process_params( params )

  }

}
