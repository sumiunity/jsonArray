/**
 * dtype
 * =======================
 *
 * Extends the jsonArray functionality to allow for data type
 * formatting. This includes extracting data types for specific
 * columns and also converting to known data types
 *
 * :Author: Nik Sumikawa
 * :Date: Aug 4, 2020
 */


import jsonArray from '../jsonArray'

import datetime from './datetime'



export default class DataTypes extends Object{

  constructor(array) {
    super()

    // set default dtypes. Ideally, extract them from the jsonArray when available
    if( array instanceof jsonArray ){
      this.set_dtypes( array.dtypes )
    }
  }

  // returns all columns in the jsonArray
  columns( array ){
    var columns = []

    var max_length = array.length
    if( max_length > 50 ) max_length = 50

    for( var i=0; i < max_length; i++ ){
      columns = columns.concat(Object.keys(array[i]))
    }

    return [...new Set(columns.filter(x => !['__index__'].includes(x)))]
  }

  // converts all data types based on the global dtypes definition
  // stored within the jsonArray variable
  init( array ){

    const {performance} = require('perf_hooks');

    // extract the column names based on the data type definition
    const dtype_col = Object.keys(this)

    for( var i=0; i < dtype_col.length; i++ ){
      // convert the column to the specified type
      array = this.convert(array, dtype_col[i], this[dtype_col[i]])
    }

    this.max_length = array.length
    if( this.max_length > 50 ) this.max_length = 50

    var t0 = performance.now()
    this.parse(array)


    // converting all numeric Strings to their proper non-string type
    const columns = this.columns(array)
    for( i=0; i < columns.length; i++ ){


      const col = columns[i]
      if(this[col] === 'intString') array = this.convert( array, col, 'int' )
      if(this[col] === 'floatString') array = this.convert( array, col, 'float' )
      if(this[col] === 'booleanString') array = this.convert( array, col, 'boolean' )

    }

    delete this.max_length
    return array
  }

  /**
   * sets the internal data type definition based on the provided objects
   * @param {object} dtypes object containing the data type definition
   */
  set_dtypes( dtypes ){

    // extract the column names based on the data type definition
    const columns = Object.keys(dtypes)

    for( var i=0; i < columns.length; i++ ){
      this[columns[i]] = dtypes[columns[i]]
    }

    return this
  }

  // returns the data type for the given value
  data_type( value ){

    if( value instanceof Array ) return 'array'
    if( value instanceof Object ) return 'object'


    if( (Number(value) === value)&(value % 1 === 0) ) return 'int'
    if( (Number(value) === value)&(value % 1 !== 0) ) return 'float'

    // attempt to convert the value to a number
    const numeric = Number( value )

    // determine the proper type when successfully converted to a number
    if( numeric !== undefined & !isNaN(numeric) ){
      if( value === true | value === false ) return 'boolean'
      if( value % 1 === 0 ) return 'intString'
      if( value % 1 !== 0 ) return 'floatString'
    }

    if(value === 'true' | value === 'false') return 'booleanString'
    if(typeof value === 'string' || value instanceof String) return 'string'

    return 'unknown'
  }

  /**
   * returns True when the data type is numeric. Otherwise False
   * @param  {String}  dtype Data type string
   * @return {Boolean}       True when the data type is numeric, otherwise false
   */
  isNumeric( dtype ){
    switch( dtype ){
      case 'float' : return true
      case 'int': return true
      case 'percentage': return true
      default : return false
    }
  }

  /**
   * Convert the specified column based on the data type
   * @param  {string} col       column name
   * @param  {string} dtype     data type definition
   * @return {array}            array containing with the column mapped correctly
   */
  convert( array, col, dtype, params={} ){

    // convert the dtype for the specific column for all rows
    for( var i=0; i < array.length; i++ ){

      // do not process the row when data doesn't exist for the column
      // const columns = Object.keys(array[i])
      // if( !columns.includes( col) ) continue
      if( array[i][col] === undefined ) continue

      array[i][col] = this.apply(array[i][col], dtype, params )
    }

    // create an internal variable with the data type of the column
    this.set_label( col, dtype )

    return array
  }

  // logic to apply when converting a value to the correct data type
  apply(value, dtype, params={}){

    switch( dtype ){
      case 'datetime':
        return datetime(value)

      case 'week':
        return datetime(value).week()

      case 'strftime':
        const param_keys = Object.keys(params)
        if( !param_keys.includes('format') ) params['format'] = 'YYYY-MM-DD'

        return datetime(value).format(params['format'])

      case 'int' :
        return Number( value )

      case 'float' :
        return Number( value )

      case 'boolean' :
        if( value === 'true' ) return true
        if( value === 'false' ) return false
        if( value === false | value === true ) return value
        return Number( value )

      case 'array':
        if( typeof value !== 'string' ) return value
        return value
          .replace(/\[/gi, '')
          .replace(/\]/gi, '')
          .replace(/'/gi, '')
          .replace(/, /gi, ',')
          .split(',');

      default :
        return value
    }

  }

  // sets the internal data type label
  set_label( col, data_type ){

    // set the column data type
    switch( data_type ){
      case 'strftime':
        this[col] = 'string';
        break;

      default:
        this[col] = data_type
        break
    }

    return this[col]
  }



  // compares two data types and returns the one with the
  // highest priority to avoid type conflict
  dtypePriority( dtype1, dtype2 ){
     const priority = [
       'object',
       'array',
       'string',
       'float',
       'int',
       'boolean',
     ]

     for( var i=0; i < priority.length; i++ ){
       if( dtype1 === priority[i] ) return priority[i]
       if( dtype2 === priority[i] ) return priority[i]
     }

     return 'unknown'
  }

  // set a data type for the specified column
  parse_column( array, col ){

    var dtype
    for( var i=0; i < this.max_length; i++ ){
      if( array[i][col] !== undefined ){
        // extract the datatype for the current cell
        var temp_dtype = this.data_type( array[i][col] )

        // set the dtype during the first pass when it's not set
        if( dtype === undefined ){
          dtype = temp_dtype
          continue
        }

        // set the dtype based on the priority when the cell dtype
        // differs from the global definition
        if( dtype !== temp_dtype ){
          temp_dtype = this.dtypePriority( dtype, temp_dtype)
        }

        dtype = temp_dtype
      }
    }

    return dtype
  }

  // returns an object containing the dtypes for each column
  parse( array ){

    // parse a unique set of column names from the array of objects
    var columns = []
    for( var i=0; i < this.max_length; i++ ){
      columns = columns.concat( Object.keys(array[i]))
    }
    columns = [...new Set(columns)]

    // parse the data types for each column
    const existing = Object.keys(this)
    for( i=0; i < columns.length; i++ ){
      // do no overwrite existing datatypes
      if( existing.includes(columns[i]) ) continue

      //parse undefined datatypes
      this[columns[i]] = this.parse_column(array, columns[i])
    }

    return this
  }


  /**
   * Returns the data type for the provided series
   * @param  {Object} series Series object
   * @return {String}        Data type string
   */
  parse_series( series ){

    var dtype
    for( var i=0; i < series.values.length; i++ ){

      const value = series.values[i]

      if( value !== undefined ){
        // extract the datatype for the current cell
        var temp_dtype = this.data_type( value )

        // set the dtype during the first pass when it's not set
        if( dtype === undefined ){
          dtype = temp_dtype
          continue
        }

        // set the dtype based on the priority when the cell dtype
        // differs from the global definition
        if( dtype !== temp_dtype ){
          temp_dtype = this.dtypePriority( dtype, temp_dtype)
        }

        dtype = temp_dtype
      }
    }

    return dtype
  }

}
