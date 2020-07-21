
import React from 'react';
const DF = require('data-forge')

export function DataFrame( args ){

  //instantiate the DataFrame object
  var df = new DataFrameWrapper( args )

  // create indicies
  df = new DataFrameWrapper( df.withIndex([...Array(df.count()).keys()]) )
  df.index_valid = true

  return df
}

class DataFrameWrapper extends DF.DataFrame{

  get columns(){
    return this.getColumnNames()
  }

  get values(){
    return this.toRows()
  }

  // returns an array of index belonging to the DataFrame
  get index(){

    if( this.index_valid === true ){
      console.log( 'do i get here?')
      return this.getIndex().toArray()

    } else {
      return [...Array(this.count()).keys()]
    }

  }

  /**
   * In order to achieve backwards compatiblity with the original
   * DataFrame, we need to wrap all of the original DataFrame calls.
   * This will be fixed by modifying the source directly
   * @param  {DataFrame} df [description]
   * @return {DataFrame}    [description]
   */
  wrap_module( df ){

    // wrap the DataFrame and set the index and valid flag
    // This is needed to ensure that this wrapper is included
    // as part of the returned object and the index valid flag
    // is set for future operations that require pulling the index
    var new_df = new DataFrameWrapper( df )
    new_df = new DataFrameWrapper( new_df.withIndex( df.index ) )
    new_df.index_valid = true

    return new_df

  }

  /**
   * Returns a DataFrame with with specified columns
   * @param  {list} col_list list of column names
   * @return {DataFrame}     DataFrame containing the specified columns
   */
  get_columns( col_list ){

    var col_set = new Set(col_list)
    var drop_col = [...this.columns].filter(x => !col_set.has(x))

    return this.wrap_module(this.dropSeries(drop_col))

  }

  series( col ){

    if( typeof col === "string" ){
      return new Series(this.getSeries(col))
    }

    if( typeof col === "object" ){
      var col_set = new Set(col)
      var drop_col = [...this.columns].filter(x => !col_set.has(x))

      return this.wrap_module(this.dropSeries(drop_col))
    }
  }

  sort_values( by ){
    return this.wrap_module( this.orderBy(row => row[by] ) )
  }

  set_index( col ){
    return this.wrap_module( this.setIndex(col) )
  }

  // rename a series in the DataFrame
  rename( col_map ){
    return this.wrap_module( this.renameSeries( col_map ) )
  }

  // add a series to the existing DataFrame
  add_series( name, array ){
    return this.wrap_module( this.withSeries( name, array ) )
  }

  filter( arg ){
    return this.wrap_module( this.where( arg ) )
  }

  /**
   * Filters the DataFrame by the array of index
   * @param  {Array} array array of indicies
   * @return {DataFrame}       DataFrame containing the specified indicies
   */
  ix( array ){
    return this.wrap_module( this.withIndex( array ) )
  }

  print( ){
    console.log( this.toString())
  }


  profile(){
    var columns = this.columns

    var values = []
    for( var i in this.columns ){
      var ser = this.getSeries(this.columns[i])

      // extract the data type from the Series
      const dataType = ser.detectTypes()
      if( dataType.length > 1 ){
        console.log( `Warning -- mixed types ${this.columns[i]}`)
      }

      // compute the number of unique values for the Series
      const unique = ser.distinct().toArray().length

      values.push( [this.columns[i],
                    ser.average(),
                    ser.std(),
                    ser.min(),
                    ser.max(),
                    unique,
                    dataType.toArray()['type'],
                  ]
                )
    }

    this._profile = DataFrame({
      columnNames: ['column','mean','std','min','max','unique','type'],
      rows : values
    })

    return this._profile

  }
  //   const summary = df.summarize({ // Summarize using pre-defined functions.
  //      Column1: Series.sum,
  //      Column2: Series.average,
  //      Column3: Series.count,
  // });
  // console.log(summary);
  //
  // const short = data.where(row => row.ones >= 7)
  // const double_oh = new DF.Series([100, 200, 300])
  // const withHundreds = data.withSeries({hundreds: double_oh})

  // const sumsAndProducts = data.generateSeries({
  // sum: row => row.ones + row.tens,
  // product: row => row.ones * row.tens
  //   })
}





export class Series extends DF.Series{


  get values(){
    return this.toArray()
  }

  // returns an array of index belonging to the DataFrame
  get index(){
    return this.getIndex().toArray()
  }

  series( col ){
    return this.getSeries(col).toArray()
  }

  wrap_module( ser ){

    var index
    if( ser.index_valid === true ){
      index = ser.index
    } else {
      index = [...Array(ser.count).keys()]
    }

    return new Series( index=index, ser )
  }

  // sort_values( by ){
  //   return new DataFrame( this.orderBy(row => row[by] ) )
  // }

  set_index( col ){
    return new Series( this.setIndex(col) )
  }



  filter( arg ){
    return new Series( this.where( arg ) )
  }

  /**
   * Filters the Series by the array of index
   * @param  {Array} array array of indicies
   * @return {Series}       Series containing the specified indicies
   */
  ix( array ){
    return new Series( this.withIndex( array ) )
  }

  print( ){
    console.log( this.toString())
  }

}
