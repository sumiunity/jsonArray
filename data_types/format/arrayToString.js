/**
 * Array To String
 * ====================
 *
 * Converts jsonArray to an array of strings
 *
 * @author Nik Sumikawa
 * @date Aug 31, 2020
 *
 */

import jsonArray from '../../jsonArray'
import valueToString from './valueToString'

export default class arrayToString{

  // defaults
  constructor(){

    // whitespace for each tab and the tabs between each column
    this.tab_count = 1
    this.tab_space = 4

    this.max_width = 20

    this.columns = undefined

  }


    // returns the length of the contents
    col_width( value ){

      return value.length
    }



    // determines the maximum width between columns
    col_spacing( json_array ){

      var max_length = {}

      const value_to_string = new valueToString()

      // extract the column names when they are not provided locally
      if( this.columns === undefined ) this.columns = ['__index__'].concat(json_array.columns)

      // determine the maximum string lenght of each column
      for( var i=0; i < this.columns.length; i++ ){

        var col = this.columns[i]

        // determine the length of the column name string
        max_length[col] = this.col_width(this.columns[i])

        // cap the length of the column name length. We can skip
        // processing because we are already at the max width
        if( max_length[col] > this.max_width ){
          max_length[col] = this.max_width
          continue
        }


        // determine the maximum string length of the column
        for( var j=0; j < json_array.length; j++ ){

          // do not consider non-existing values
          if( !Object.keys(json_array[j]).includes(col) ) continue

          const value = value_to_string.toString(
            json_array[j][col],
            json_array.dtypes[col]
          )

          if( value.length > max_length[col] ){
            max_length[col] = value.length
          }

          // We can skip processing because we are already at the max width
          if( max_length[col] > this.max_width ) break

        }

      }

      return max_length
    }



    /**
     * returns a list of column names in order with the proper
     * whitespace added for logging
     * @param  {Object} spacing maximum string length for the column
     * @return {Array}         array of column names with the appropriate whitespace
     */
    format_columns( spacing ){

      var row_array = []

      // add each column name with the appropriate white space added
      for( var j=0; j < this.columns.length; j++ ){

        const col = this.columns[j]
        const whitespace = spacing[col] - col.length
        row_array.push( new Array(whitespace + 1).join(' ') + col )
      }

      return row_array
    }


    /**
     * returns a formatted string of the formatted cell for each row
     * @param  {Array}  row     Object containing the values for each row
     * @param  {Object} dtypes  Object containing the maximum length for each column
     * @param  {Object} spacing maximum string length for the column
     * @return {Array}         array of values with the appropriate whitespace
     */
    format_row( row, dtypes, spacing ){

      const value_to_string = new valueToString()

      var row_array = []
      for( var j=0; j < this.columns.length; j++ ){

        const col = this.columns[j]
        var value = row[col]

        var whitespace
        if( value === undefined ){
          value = 'nan'
          whitespace = spacing[col] - 3
        } else {

          value = value_to_string.toString( value, dtypes[col] )
          whitespace = spacing[col] - value.length
        }

        try{
          row_array.push( new Array(whitespace + 1).join(' ') + value )
        }catch{row_array.push(value)}
      }

      return row_array
    }


    /**
     * Converts the array of strings int a single array where
     * each column is separated by whitespace based on the
     * local white space definition
     * @param  {Array} array  Array of strings
     * @return {String}       String containing each array element with the desired whitespace
     */
    format_array( array ){
      return new Array(...array).join(new Array(this.tab_space * this.tab_count).join(' '))
    }


    /**
     * Returns a matrix of strings that have been formated based on the data
     * type of each column
     * @param  {Array} array  jsonArray containing the matrix to convert
     * @return {String}        Matrix of strings formatted based on the column data type
     */
    toString( array ){

      // force the input array into a json array type
      var json_array = array
      if(!(json_array instanceof(jsonArray))){
        json_array = new jsonArray(array)
      }

      // extract the column names when they are not provided locally
      if( this.columns === undefined ) this.columns = ['__index__'].concat(json_array.columns)

      const spacing = this.col_spacing( json_array )

      // seed the formatted array with the column names
      var formatted = this.format_array( this.format_columns(spacing) ) + '\r\n'

      // format the data from each row
      for( var i=0; i < json_array.length; i++ ){
        formatted = formatted.concat(
          this.format_array( this.format_row(json_array[i], json_array.dtypes, spacing) ) + '\r\n'
        )
      }

      return formatted

    }


    toConsole( array ){

      const jsonArray_str = this.toString( array )
      console.log( jsonArray_str )
    }
}
