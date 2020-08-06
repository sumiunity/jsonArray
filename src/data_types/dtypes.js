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



export default class DataTypes {

  constructor(array) {
    this.array = array

    // this.init()
  }

  // converts all data types based on the global dtypes definition
  // stored within the jsonArray variable
  init( dtypes={} ){

    // extract the column names based on the data type definition
    const columns = Object.keys(dtypes)

    // do nothing when no columns are specified
    if( columns.length === 0) return this.array

    for( var i=0; i < columns.length; i++ ){
      this.convert(columns[i], dtypes[columns[i]])

    }

    return this.array
  }


  /**
   * Convert the specified column based on the data type
   * @param  {string} col       column name
   * @param  {string} dtype     data type definition
   * @return {array}            array containing with the column mapped correctly
   */
  convert( col, dtype, params={} ){

    // convert the dtype for the specific column for all rows
    for( var i=0; i < this.array.length; i++ ){

      // do not process the row when data doesn't exist for the column
      const columns = Object.keys(this.array[i])
      if( !columns.includes( col) ) continue

      this.array[i][col] = this.apply(this.array[i][col], dtype, params )
    }

    return this.array
  }

  // logic to apply when converting a value to the correct data type
  apply(value, dtype, params={}){

    switch( dtype ){
      case 'datetime':
        return datetime(value)

      case 'strftime':
        const param_keys = Object.keys(params)
        if( !param_keys.includes('format') ) params['format'] = 'YYYY-MM-DD'

        return datetime(value).format(params['format'])

      default :
        return value
    }

  }

}
