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

import echartsFormat from './frameworks/echarts/format'
import echartsOptions from './frameworks/echarts/options'

import ReactComponents from './frameworks/react/ReactComponents'

const debug = false




export default class jsonArray extends Array{

  constructor(array=[], inplace=false) {

    var dtypes = new DataTypes( array )


    // add an index column when the array is not empty
    if( (array.length > 0)&(inplace===false) ){

      array = JSON.parse(JSON.stringify(array))

      // when the Array is passed in as an array of arrays, covert
      // it to an array of objects
      if( array[0].hasOwnProperty('length') ){
        for( var i=0; i < array.length; i++ ){
          array[i] = new Object({... array[i]})
        }
      }

      const columns = Object.keys(array[0])

      // create an internal index attribute when one doesn't exist
      if( !columns.includes('__index__') ){
        for( var i=0; i < array.length; i++ ){
          array[i]['__index__'] = i
        }
      }


      // initialize the array based on the data type of the uncloned DataFrame
      array = dtypes.init(array)
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

    return [...new Set(columns.filter(x => !['__index__'].includes(x)))]
  }

  /**
   * Replace the column names with those provided by the column array
   * @param  {Array} columns array of column names
   * @return {Array}         jsonArray with new column names
   */
  set columns( columns ){
      const keys = this.columns

      // define a mapping between the current and new column names
      var mapping = {}
      for( var i=0; i < Math.min(keys.length, columns.length); i++ ){
        mapping[keys[i]] =columns[i]
      }

      // return a json array with the new mapping applied
      return this.rename( mapping, {inplace: true} )
  }


  // return all values for the specified column
  values( col ){
    return [...this].map(row => row[col])
  }

  // returns the values of the data at the specified index
  loc( idx ){
    return Object.values([...this].filter(row => row.__index__ == idx))

  }

  // return the values of the data at the relative row number
  iloc( idx ){
    return Object.values(this[idx])
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


  merge( json_array, on  ){


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

  /**
   * convert the column data type based on the mapping
   * @param  {Object} [columns={}] object containing the mapping between columns and data type
   * @param  {Object} [params={}]  parameter object
   * @return {Array}              jsonArray containing the mapped columns
   */
  astype( columns={}, params={} ){
    var array = this.__inplace__(params['inplace'])

    // convert all columns based on the specified data types
    const col_names = Object.keys(columns)
    for( var i=0; i < col_names.length; i++ ){
      const col = col_names[i]
      array = array.dtypes.convert(array, col, columns[col], params)
    }

    return array
  }

  // converts the specified column into a date string
  strftime( col, format='YYYY-MM-DD', params={} ){
    var array = this.__inplace__(params['inplace'])
    return array.dtypes.convert(array, col, 'strftime', params)
  }

  // converts the specified column into a
  strptime( col, params={} ){
    var array = this.__inplace__(params['inplace'])
    return array.dtypes.convert(array, col, 'datetime', params)
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

    // When the column is an array type, concatinate all array values
    if( this.dtypes[col] === 'array'){
      var temp = []
      for( var i=0; i < unique_values.length; i++ ){
        if(unique_values[i] === undefined) continue
        temp = temp.concat(unique_values[i])
      }

      // overwrite the unique values with the concatinated values
      unique_values = [...new Set(temp)]
    }

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

          // console.log( columns[j], typeof columns[j], typeof columns[j] instanceof 'string' )
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

  // /**
  //  * echarts line plot data formatter
  //  * @param  {stringi} col  column name
  //  * @return {object}      echarts data series object
  //  */
  get echartsFormat( ){ return new echartsFormat( this ) }
  get echartsOptions( ){ return new echartsOptions( this ) }
  // get reactComponents(){ return new ReactComponents(this) }
  get react(){ return new ReactComponents(this) }

}




/**
 * Return an array where each entry has a corresponding
 * key value that does not correspond to an array location
 * @param  {Array} array Array of objects
 * @return {Array}       Array of objects with valid keys
 */
function validate_columns( array ){

  const columns = Object.keys(array[0])
  // search for columns that are integer values. These occur when
  // objects are inserted as an array i.e. without a key
  var invalid_col = []
  for( i = 0; i < columns.length; i++ ){
    if( !isNaN(columns[i]) ) invalid_col.push( columns[i])
  }

  if( invalid_col.length === 0) return array

  // map all invalid column names
  for( var i = 0; i < array.length; i++ ){
    const keys = Object.keys( array[i] )

    // duplicate the content of the invalid column to a valid column name.
    // We cannot delete the invalid column because of the dependency of
    // array position
    for( var j = 0; j < invalid_col.length; j++ ){
      if( keys.includes( invalid_col[j]) ){
        array[i][`col-${invalid_col[j]}`] = array[i][invalid_col[j]]
      }
    }

    // remove the invalid columns
    for( j = 0; j < invalid_col.length; j++ ){
      if( keys.includes( invalid_col[j]) ){
        array[i].splice(invalid_col[j])
      }
    }
  }

  return array
}
