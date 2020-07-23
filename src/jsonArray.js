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

import groupby from './functions/groupby'
import {dropDuplicates} from './functions/duplicates'
import moment from 'moment';
import jsonObject from './jsonObject'

import echartsFormat from './plot/echarts/format'
import echartsOptions from './plot/echarts/options'

const debug = false


export default class jsonArray extends Array{

  constructor(array) {
    super(...array);
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
    return new jsonArray( groupby( this, col ) )
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
   * Returns the echarts options for generating the heatmap plot
   *
   * @param  {string} col1  column 1 name, which will be used for the x_axis
   * @param  {string} col1  column 2 name, which will be used for the y_axis
   * @param  {string} value column name, which will be used for the cell value
   * @param  {string} tooltip string used in the tool tip
   * @return {Array}       Array of x/y cooridnates
   */
  heatmap( col1, col2, value, label ){
    const echarts = new echartsOptions( this )
    echarts.heatmap( this.array, col1, col2, value, label )

    console.log( echarts )
  }


  /**
   * Returns the echarts options for generating the Boxplot
   *
   * @param  {string} col1  column 1 name, which will be used for the x_axis
   * @param  {string} col1  column 2 name, which will be used for the y_axis
   * @param  {string} value column name, which will be used for the cell value
   * @param  {string} tooltip string used in the tool tip
   * @return {Array}       Array of x/y cooridnates
   */
  boxplot( col, y_axis ){
    const echarts = new echartsOptions( this )
    return echarts.boxplot( col, y_axis )
  }
}
