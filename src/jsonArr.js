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

// import echartsFormat from 'components/Plot/echarts/format'
// import echartsOptions from 'components/Plot/echarts/options'

const debug = false


export default class jsonArray extends Array{

  constructor(array) {
    super(...array);

    this.array = array
  }

  // TODO: search for all columns in the Array
  get columns(){ return Object.keys(this.array[0]) }

  // sorts the json array by the provided column
  sort_values( col, ascending=true ){

    //sort the table based on the ascending flag
    if( ascending === true ){
      this.array = this.array.sort((a, b) => a[col] > b[col] ? 1 : -1 )

    }else{
      this.array = this.array.sort((a, b) => a[col] < b[col] ? 1 : -1 )
    }

    // super(...this.array)
    return this.array
  }

  // filters the json array based on the column and the provided value.
  // The value can be either a single variable or an array
  filter_column( col, value ){

    if( Array.isArray(value) ){
      return this.array.filter(row => value.includes(row[col]) )
    }

    return this.array.filter(row => row[col] === value )
  }

  filter( func ){ return new jsonArray( this.array.filter(func) ) }
  map( func ){
    const array = this.array.map(func)
    console.log( 'mapping', array.length, array instanceof Array )
     return new jsonArray( array ) }

  groupby( col ){
    return new jsonArray( groupby( this.array, col ) )
  }

  // removes json ojects with the same values
  drop_duplicates(){
    return new jsonArray( dropDuplicates( this.array ) )
  }

  pivot( columns ){

    var pivot_table = []

    if( columns === undefined ) columns = this.columns

    for( var i=0; i < columns.length; i++ ){
      // initialize the row to contain the column name
      var temp = {column: columns[i]}

      // add the column value for each row
      for( var j=0; j < this.array.length; j++ ){
        temp[j] = this.array[j][columns[i]]
      }

      // add the results to the final pivot table
      pivot_table.push( temp )
    }

    return new jsonArray(pivot_table)
  }

  pivot_table( row, column, summaryType='count' ){

    var pivot_table = []

    const row_val = [...new Set(this.array.map( r => r[row]) )]
    const column_val = [...new Set(this.array.map( r => r[column]) )]


    for( var i=0; i < row_val.length; i++ ){
      // initialize the row to contain the column name
      var temp = {row: row_val[i]}

      const by_row = this.array.filter( r => r[row] === row_val[i] )

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

    for( var i=0; i < this.array.length; i++ ){
      this.array[i][col] = moment(this.array[i][col]).format(format)
    }

    return new jsonArray(this.array)
  }

  combine_columns( col1, col2, col_name, sep=' ' ){
    // creates a new column by merging the content of col 1 and 2 to
    // form a new column
    //
    for( var i=0; i < this.array.length; i++ ){
      this.array[i][col_name] = this.array[i][col1] + sep + this.array[i][col2]
    }

    return new jsonArray(this.array)
  }

  to_jsonObject( key, value ){
    // Converts the jsonArray into a jsonObject with following
    // columns for the key and values

    var object = {}
    for( var i=0; i < this.array.length; i++ ){
      object[this.array[i][key]] = this.array[i][value]
    }

    return new jsonObject( object )
  }

  unique( col, ordered=false ){
    // return all unique values for the specified column. When
    // ordered is set to true, these values are sorted.

    var unique_values = [...new Set(this.array.map(row => row[col] ))]


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
    if( this.array.length === 1 ) return this.array[0][col]
    return Math.max(...this.array.map(row => row[col])) }
  min(col){
    if( this.array.length === 1 ) return this.array[0][col]
    return Math.min(...this.array.map(row => row[col])) }
  sum(col){
    if( this.array.length === 1 ) return this.array[0][col]
    return this.array.map(row => row[col]).reduce((a,b) => a + b, 0) }
  mean(col){
    if( this.array.length === 1 ) return this.array[0][col]
    return this.sum(col) / this.array.length }
  //
  // /********************************************************************************
  // *  ECharts json array interface
  // *  ===============================
  // *  Interface that returns echarts series objects for plotting
  // ********************************************************************************/
  //
  // /**
  //  * echarts line plot data formatter
  //  * @param  {stringi} col  column name
  //  * @return {object}      echarts data series object
  //  */
  // line( col, symbol='none', color='red', lw=1 ){
  //   const echarts = new echartsFormat( this )
  //   return echarts.line( col, symbol, color, lw )
  // }
  //
  // /**
  //  * echarts area plot data formatter
  //  * @param  {string} col  column name
  //  * @return {object}      echarts data series object
  //  */
  // area( col ){
  //   const echarts = new echartsFormat( this )
  //   return echarts.area( col )
  // }
  //
  // /**
  //  * Convert the json_array to a list of x/y cooridnates
  //  * @param  {string} col1  column 1 name, when 'index' is provided, the index value will be used
  //  * @param  {string} col1  column 2 name
  //  * @param  {string} color hex or rgb color string
  //  * @return {Array}       Array of x/y cooridnates
  //  */
  // scatter( col1, col2, color, label, index=0 ){
  //   const echarts = new echartsFormat( this )
  //   return echarts.scatter( col1, col2, color, label, index )
  // }
  //
  // /**
  //  * Returns a list of echarts scatter objects colored by the specified att
  //  *
  //  * @param  {string} col1  column 1 name, when 'index' is provided, the index value will be used
  //  * @param  {string} col1  column 2 name
  //  * @param  {string} color hex or rgb color string
  //  * @return {Array}       Array of x/y cooridnates
  //  */
  // scatter_by( col1, col2, by, label ){
  //   const echarts = new echartsFormat( this )
  //   return echarts.scatter_by( col1, col2, by, label )
  // }
  //
  //
  // /**
  //  * Returns the echarts options for generating the heatmap plot
  //  *
  //  * @param  {string} col1  column 1 name, which will be used for the x_axis
  //  * @param  {string} col1  column 2 name, which will be used for the y_axis
  //  * @param  {string} value column name, which will be used for the cell value
  //  * @param  {string} tooltip string used in the tool tip
  //  * @return {Array}       Array of x/y cooridnates
  //  */
  // heatmap( col1, col2, value, label ){
  //   const echarts = new echartsOptions( this )
  //   return echarts.heatmap( this.array, col1, col2, value, label )
  // }
  //
  //
  // /**
  //  * Returns the echarts options for generating the Boxplot
  //  *
  //  * @param  {string} col1  column 1 name, which will be used for the x_axis
  //  * @param  {string} col1  column 2 name, which will be used for the y_axis
  //  * @param  {string} value column name, which will be used for the cell value
  //  * @param  {string} tooltip string used in the tool tip
  //  * @return {Array}       Array of x/y cooridnates
  //  */
  // boxplot( col, y_axis ){
  //   const echarts = new echartsOptions( this )
  //   return echarts.boxplot( col, y_axis )
  // }
}
