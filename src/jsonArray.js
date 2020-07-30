/**
 * JSON Array
 * ===============
 *
 * Extend the Array components to include various functions useful
 * for processing an array of JSON objects
 *
 * :Author: Nik Sumikawa
 * :Date: Feb 11, 2020
 */

 import moment from 'moment';
 import _ from 'lodash'


import jsonObject from './jsonObject'

import echartsFormat from './plot/echarts/format'
import echartsOptions from './plot/echarts/options'

const debug = false


export default class jsonArray extends Array{

  constructor(array) {

    // add an index column when the array is not empty
    if( array.length > 0 ){
      const keys = Object.keys(array[0])

      // create an __index__ attribute when one doesn't exist
      if( !keys.includes('__index__') ){
        for( var i=0; i < array.length; i++ ){
          array[i]['__index__'] = i
        }
      }
  }

    super(...array);
  }

  /**
   * Initialization routine by adding an index to the
   * json array to enable functions such as merge, join,
   * etc.
   * @param  {Array} array JsonArray
   * @return {Array}       Initialized arrray
   */
  __init__( array ){

    const keys = Object.keys(array[0])

    if( keys.includes('__index__') ){
      return array
    }

    return array
    // for( var i=0; i < array.length; i++ ){
    //
    // }
  }


  // TODO: search for all columns in the Array
  get columns(){ return Object.keys(this[0]) }



  // sorts the json array by the provided column
  sort_values( col, ascending=true){

    var array

    //sort the table based on the ascending flag
    if( ascending === true ){
      array = this.sort((a, b) => a[col] > b[col] ? 1 : -1 )

    }else{
      array = this.sort((a, b) => a[col] < b[col] ? 1 : -1 )
    }

    return new jsonArray( array )
  }

  // filters the json array based on the column and the provided value.
  // The value can be either a single variable or an array
  filter_column( col, value ){

    if( Array.isArray(value) ){
      return new jsonArray( [...this].filter(row => value.includes(row[col])) )
    }else{
      return new jsonArray( [...this].filter(row => row[col] === value ) )
    }
  }


  filter( func ){
    return new jsonArray( [...this].filter(func) )
  }

  map( func ){
    return [...this].map(func)
  }

  groupby( col ){
    return new jsonArray( this.__groupby__( this, col ) )
  }

  __groupby__( json_obj, atts, keys ){

    // append the keys with the json object
    if( atts.length === 0 ){
      keys['json_obj'] = new jsonArray(json_obj)
      keys['count'] = json_obj.length
      return keys
    }

    // initial conditions for keys
    if( keys === undefined ){ keys = {} }

    var results = []

    if(debug) console.log( 'groupby----', atts[0], json_obj)

    const values = [...new Set(json_obj.map(row => row[atts[0]]))]
    for( var i=0; i < values.length; i++ ){
      const group = json_obj.filter( row => row[atts[0]] === values[i] )

      // deep copy the keys and append with the current key
      var temp_keys = Object.assign({}, keys)
      temp_keys[atts[0]] = values[i]

      results = results.concat( this.__groupby__(group, atts.slice(1),  temp_keys) )
    }

    return results
  }


  // removes json ojects with the same values
  drop_duplicates(){

    var cleaned = [];
    [...this].forEach(function(itm) {
        var unique = true;
        cleaned.forEach(function(itm2) {
            if (_.isEqual(itm, itm2)) unique = false;
        });
        if (unique)  cleaned.push(itm);
    });

    return new jsonArray(cleaned)

  }

  pivot( columns ){

    var pivot_table = []

    if( columns === undefined ) columns = this.columns

    for( var i=0; i < columns.length; i++ ){
      // initialize the row to contain the column name
      var temp = {column: columns[i]}

      // add the column value for each row
      for( var j=0; j < this.length; j++ ){
        temp[j] = this[j][columns[i]]
      }

      // add the results to the final pivot table
      pivot_table.push( temp )
    }

    return new jsonArray(pivot_table)
  }

  pivot_table( row, column, summaryType='count' ){

    var pivot_table = []

    const row_val = this.unique( row )
    const column_val = this.unique( column )


    for( var i=0; i < row_val.length; i++ ){
      // initialize the row to contain the column name
      var temp = {row: row_val[i]}

      const by_row = this.filter( r => r[row] === row_val[i] )

      // add the column value for each row
      for( var j=0; j < column_val.length; j++ ){
        const by_col = by_row.filter( r => r[column] === column_val[j] )
        if( summaryType === 'count' ){ temp[column_val[j]] = by_col.length }

      }

      // add the results to the final pivot table
      pivot_table.push( temp )
    }

    return new jsonArray(pivot_table)
  }

  // converts the specified column into a date string
  strftime( col, format='YYYY-MM-DD' ){

    var array = this

    for( var i=0; i < this.length; i++ ){
      array[i][col] = moment(this[i][col]).format(format)
    }

    return new jsonArray(array)
  }

  // converts the specified column into a
  strptime( col ){

    var array = this

    for( var i=0; i < this.length; i++ ){
      array[i][col] = moment(this[i][col])
    }

    return new jsonArray(array)
  }


  /**
   * Creates a new column by merging the content from the columns
   * specified in the columns attribute
   * @param  {array} columns  array of column names
   * @param  {String} col_name Name of the resulting column
   * @param  {String} [sep='   ']            string delimiter
   * @return {OBJECT}          jsonArray with the new column
   */
  combine( columns, col_name, sep=' ' ){
    var array = this

    for( var i=0; i < this.length; i++ ){
      // seed the value with the value from the first column
      var temp = this[i][columns[0]]

      for( var j=1; j < columns.length; j++ ){
        temp = temp + sep + this[i][columns[j]]
      }

      array[i][col_name] = temp
    }

    return new jsonArray(array)
  }

  combine_columns( col1, col2, col_name, sep=' ' ){
    // creates a new column by merging the content of col 1 and 2 to
    // form a new column
    console.log( 'this function is deprecated: see combine')
    return this.combine([col1, col2], col_name, sep )
  }

  to_jsonObject( key, value ){
    // Converts the jsonArray into a jsonObject with following
    // columns for the key and values

    var object = {}
    for( var i=0; i < this.length; i++ ){
      object[this[i][key]] = this[i][value]
    }

    return new jsonArray( object )
  }

  unique( col, ordered=false ){
    // return all unique values for the specified column. When
    // ordered is set to true, these values are sorted.

    var unique_values = [...new Set([...this].map(row => row[col] ))]


    if( ordered === true ){
        // try to conver the values to numbers prior to sorting.
        // use a non standard sorting to get the values sorted properly
        try{
          unique_values = unique_values.map( x => +x)
          unique_values = unique_values.sort(function(a,b){return a - b})
        }catch{
          // default to the standard sort
          unique_values.sort()
        }
    }

    return unique_values
  }

  /**
   * Applies a threshold to the specified column
   * @param  {function} func     function used to partition dataset
   * @param  {string} res_col   column name containing the results
   * @return {Array}            jsonArray containing res_col
   */
  label( func, res_col='label' ){

    var array = this

    console.log( 'sample index', array.filter( func ) )

    // identify all samples identified by the rule
    const sample_index = array.filter( func ).map( row => row.__index__ )

    // create a boolean label, where parts in the sample set are true
    for( var i=0; i < array.length; i ++ ){
      // default the value to false
      var value = false

      // the value is true when it is included in the sample set
      if( sample_index.includes( array[i].__index__) ){
        value = true
      }

      array[i][res_col] = value
    }

    return new jsonArray( array )
  }



  /********************************************************************************
  *  Math Functions
  *  ===============================
  *  Interface for computing common statistical functions
  ********************************************************************************/
  max(col){
    if( this.length === 1 ) return this[0][col]
    return Math.max(...this.map(row => row[col])) }
  min(col){
    if( this.length === 1 ) return this[0][col]
    return Math.min(...this.map(row => row[col])) }
  sum(col){
    if( this.length === 1 ) return this[0][col]
    return this.map(row => row[col]).reduce((a,b) => a + b, 0) }
  mean(col){
    if( this.length === 1 ) return this[0][col]
    return this.sum(col) / this.length }

  /********************************************************************************
  *  ECharts json array interface
  *  ===============================
  *  Interface that returns echarts series objects for plotting
  ********************************************************************************/

  /**
   * echarts line plot data formatter
   * @param  {stringi} col  column name
   * @return {object}      echarts data series object
   */
  line( col, symbol='none', color='red', lw=1 ){
    const echarts = new echartsFormat( this )
    return echarts.line( col, symbol, color, lw )
  }

  /**
   * echarts area plot data formatter
   * @param  {string} col  column name
   * @return {object}      echarts data series object
   */
  area( col ){
    const echarts = new echartsFormat( this )
    return echarts.area( col )
  }

  /**
   * Convert the json_array to a list of x/y cooridnates
   * @param  {string} col1  column 1 name, when 'index' is provided, the index value will be used
   * @param  {string} col1  column 2 name
   * @param  {string} color hex or rgb color string
   * @return {Array}       Array of x/y cooridnates
   */
  scatter( col1, col2, color, label, index=0 ){
    const echarts = new echartsFormat( this )
    return echarts.scatter( col1, col2, color, label, index )
  }

  /**
   * Returns a list of echarts scatter objects colored by the specified att
   *
   * @param  {string} col1  column 1 name, when 'index' is provided, the index value will be used
   * @param  {string} col1  column 2 name
   * @param  {string} color hex or rgb color string
   * @return {Array}       Array of x/y cooridnates
   */
  scatter_by( col1, col2, by, label ){
    const echarts = new echartsFormat( this )
    return echarts.scatter_by( col1, col2, by, label )
  }

  /**
   * Returns the echarts options based on the specified plot type
   *
   * @param  {string} plot_type  plot type definition
   * @param  {object} params  Plot parameters
   * @return {Array}          Array of plot objects used to render echarts plots
   */
  plot( plot_type, params ){

    const echarts = new echartsOptions( this )

    // return the plot options based on the specified plot type
    switch( plot_type ){

      case 'heatmap':
        return echarts.heatmap( params )

      case 'boxplot':
        return echarts.boxplot( params )

      case 'scatter':
        return echarts.scatter( params )

      default:
        alert('unknown plot type: ' + plot_type)
    }
  }
}
