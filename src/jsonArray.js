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
import DataTypes from './data_types/dtypes'

import echartsFormat from './plot/echarts/format'
import echartsOptions from './plot/echarts/options'

const debug = false




export default class jsonArray extends Array{

  constructor(array) {

    var dtypes = {}

    // extract  local variables from existing jsonArray elements
    // This is needed for foramatting purposes (i.e. data types)
    if( array instanceof jsonArray ){
      dtypes = array.dtypes
    }

    // add an index column when the array is not empty
    if( array.length > 0 ){

      array = JSON.parse(JSON.stringify(array))

      const keys = Object.keys(array[0])

      // create an __index__ attribute when one doesn't exist
      if( !keys.includes('__index__') ){
        for( var i=0; i < array.length; i++ ){
          array[i]['__index__'] = i
        }
      }

      const data_types = new DataTypes( array )
      array = data_types.init(dtypes)

    }

    super(...array);

    // dictionary containing column data types
    this.dtypes = dtypes
  }


  // returns all columns in the jsonArray
  get columns(){
    var columns = []

    for( var i=0; i < this.length; i++ ){
      columns = columns.concat(Object.keys(this[i]))
    }

    return [...new Set(columns)]
  }

  // return all values for the specified column
  values( col ){
    return [...this].map(row => row[col])
  }


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


  // creates a pivot table based on the specified row and column.
  // The summary type is used to compute the value of the pivot.
  pivot_table( row, column, summaryType='count', value=undefined ){

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

        switch( summaryType ){
          // returns the number of rows for the current split
          case 'count':
            temp[column_val[j]] = by_col.length
            break;

          // returns the number of unique values for the current split
          case 'unique':
            // set defaults for missing parameter values
            if( value === undefined ) value = '__index__'

            const temp_json = new jsonArray( by_col )
            temp[column_val[j]] = temp_json.unique( value ).length
            break;


          default:
            temp[column_val[j]] = by_col.length
            break
        }

      }

      // add the results to the final pivot table
      pivot_table.push( temp )
    }

    return new jsonArray(pivot_table)
  }

  // General routine to modify the data type of a specific column
  dtype( col, data_type, params={} ){

    var array = this.__inplace__(params['inplace'])

    // convert to date time data type
    const data_types = new DataTypes( array )
    array = data_types.convert(col, data_type, params)

    // set the column data type
    switch( data_type ){
      case 'strftime':
        this.dtypes[col] = 'string';
        break;

      default:
        this.dtypes[col] = data_type
        break
    }

    return array
  }

  // converts the specified column into a date string
  strftime( col, format='YYYY-MM-DD', params={} ){
    params['format'] = format
    return this.dtype(col, 'strftime', params)
  }

  // converts the specified column into a
  strptime( col, params={} ){
    return this.dtype(col, 'datetime', params)
  }


  /**
   * Creates a new column by merging the content from the columns
   * specified in the columns attribute
   * @param  {array} columns  array of column names
   * @param  {String} col_name Name of the resulting column
   * @param  {String} [sep='   ']            string delimiter
   * @return {OBJECT}          jsonArray with the new column
   */
  combine( columns, col_name, sep=' ', params={} ){

    var array = this.__inplace__(params['inplace'])

    for( var i=0; i < this.length; i++ ){
      // seed the value with the value from the first column
      var temp = this[i][columns[0]]

      for( var j=1; j < columns.length; j++ ){
        temp = temp + sep + this[i][columns[j]]
      }

      array[i][col_name] = temp
    }

    return array
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

        // order string type
        if( typeof unique_values[0] === 'string' ){
          return unique_values.sort()
        }

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
  label( func, params={} ){

    const param_keys = Object.keys(params)

    // set defaults for missing parameter values
    if( !param_keys.includes('output_col') ) params['output_col'] = 'label'
    if( !param_keys.includes('value') ) params['value'] = true
    if( !param_keys.includes('default') ) params['default'] = false
    if( !param_keys.includes('inplace') ) params['inplace'] = false

    var array = this.__inplace__(params['inplace'])

    // identify all samples identified by the rule
    const sample_index = array.filter( func ).map( row => row.__index__ )

    // create a boolean label, where parts in the sample set are true
    for( var i=0; i < array.length; i ++ ){

      // extract a list of columns name for the given row
      const columns = Object.keys( array[i] )

      // the value is true when it is included in the sample set
      if( sample_index.includes( array[i].__index__ ) ){
        array[i][params['output_col']] = params['value']
        continue
      }

      // set the default value when no value exists
      if( !columns.includes(params['output_col']) ){
        array[i][params['output_col']] = params['default']
        continue
      }

    }

    return array
  }

  /**
   * Copies the content from one column to a new column. This is
   * non destructive, so if the column already exists, only the
   * missing data will be copied over
   * @param  {String} col     original column name
   * @param  {String} new_col new column name
   * @return {Object}         jsonArray with the new column added
   */
  copy_column( col, new_col, params={} ){

    // clone the local copy to avoid mutation
    var array = this.__inplace__(params['inplace'])

    // delete the specified column(s) from the DataFrame
    for( var i = 0; i < array.length; i++ ){
      const columns = Object.keys(array[i] )

      if(!columns.includes( new_col) ){
        array[i][new_col] = array[i][col]
      }
    }

    return new jsonArray( array )
  }


  /**
   * Drops columns from the DataFrame
   * @param  {String or Array} columns String or Array of column names
   * @return {OBJECT}         JsonArray without the specified columns
   */
  drop_columns( columns, params={} ){

    // clone the local copy to avoid mutation
    var array = this.__inplace__(params['inplace'])

    // delete the specified column(s) from the DataFrame
    for( var i = 0; i < array.length; i++ ){

      // delete the specified column when of string type
      if( typeof columns === 'string' ){
        delete array[columns]

      // when a list is provided, delete all columns in the string
      }else{

        for( var j=0; j < columns.length; j++ ){
          delete array[i][columns[j]]
        }
      }
    }

    return new jsonArray( array )
  }


  /**
   * renames columns
   * @param  {object} mapping object containing the existing column name and new column name
   * @return {object}         json array with the new column naming
   */
  rename( mapping, params={} ){

    // clone the local copy to avoid mutation
    var array = this.__inplace__(params['inplace'])

    const columns = Object.keys( mapping )

    // rename the specified columns
    for( var i = 0; i < array.length; i++ ){

      const ex_columns = Object.keys( array[i] )

      // create a new column based on the mapping and delete
      // the existing one (taht was replaced)
      for( var j=0; j < columns.length; j++ ){
        // only replace the column when data exists for that column
        if( ex_columns.includes(columns[j]) ){
          const new_col = mapping[columns[j]]
          array[i][new_col] = array[i][columns[j]]
          delete array[i][columns[j]]
        }
      }
    }

    return new jsonArray( array )
  }


  /**
   * replaces the values in the specified column with the given value
   * based on the mapping
   * @param  {String} col     original column name
   * @param  {Object} mapping Object containing the value mapping
   * @return {Object}         jsonArray with the new column added
   */
  replace( col, mapping={}, params={} ){

    // clone the local copy to avoid mutation
    var array = this.__inplace__(params['inplace'])

    const values = Object.keys( mapping )

    // delete the specified column(s) from the DataFrame
    for( var i = 0; i < array.length; i++ ){
      const columns = Object.keys(array[i] )

      // do not perform mapping when no data nor the mapping exists
      if(!columns.includes(col) ) continue
      if(!values.includes(array[i][col])) continue

      array[i][col] = mapping[array[i][col]]

    }

    return new jsonArray( array )
  }



  /**
   * returns the data object. When enable is true, the original
   * jsonArray is returned so the values are modified directly. Otherwise
   * the jsonArray is cloned to avoid mutation of the original object
   *
   * @param  {Boolean} [enable] when inplace is True, the data is not cloned. Defaults to returning a clone
   * @return {Object}             current jsonArray content
   */
  __inplace__( enable=false ){

    // clone the local copy to avoid mutation when inplace is disabled
    if( enable ) return this

    return new jsonArray( this )
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

      case 'bar':
        return echarts.bar( params )

      default:
        alert('unknown plot type: ' + plot_type)
    }
  }
}
