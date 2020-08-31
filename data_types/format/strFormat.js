/**
 * Format
 * =============
 * Routines to convert the jsonArray into a string for visualization
 * purposes
 *
 * @author Nik Sumikawa
 * @date Aug 31, 2020
 */


import arrayToString from './arrayToString'
import valueToString from './valueToString'

export default class strFormat{

  constructor( json_array ){
    this.json_array = json_array
  }


  /**
   * returns a string containing the jsonArray contents
   * where each column is formated based on the local data
   * types
   * @return {String} Formatted string containing the jsonArray contents
   */
  get table(){
    const format = new arrayToString()
    return format.toString( this.json_array )
  }

  row( index ){
    return 'not implemented'
  }

  column( col ){
    return 'not implemented'
  }

  /**
   * Returns the formatted data for the specified cell
   * @param  {int} row row number
   * @param  {String} col column name
   * @return {String}     formatted string representing the string value
   */
  value( row, col ){
    const format = new valueToString()
    return format.toString(
      this.json_array[row][col],
      this.json_array.dtypes[col]
    )
  }

}
