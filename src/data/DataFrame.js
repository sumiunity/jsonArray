
// import React from 'react';
import { jStat } from  'jstat'
import {random_array} from './random'

const DF = require('data-forge')



export class DataFrame extends DF.DataFrame{

  constructor( ...args ){

    // console.log( '-----------------------')
    // console.log( arguments[1] )
    // var test = args
    try {
      // console.log( 'this is the content')
      // console.log( arguments[0].getContent() )
      super( arguments[0].getContent() )
    } catch {

      super(...args)

      // initialize the index when it is not passed in
      if( !Object.keys(arguments[0]).includes('index') ){
        this.content.index = [...Array(this.count()).keys()]
      }
    }

    if( arguments[1] !== undefined ){
      if( Object.keys(arguments[1]).includes('col_metadata')){
        this.col_metadata = arguments[1].col_metadata
      }else{ this.col_metadata = this.profile() }
    }else{ this.col_metadata = this.profile() }

  }

  get columns(){
    return this.getColumnNames()
  }

  get values(){
    return this.toRows()
  }

  get index(){
    return this.getIndex().toArray()
  }

  get dfType(){
    return this.typeof( this )
  }


  set_index( col ){
    return new DataFrame( this.setIndex(col), this )
  }

  filter( arg ){
    return new DataFrame( this.where( arg ), this )
  }

  typeof( df ){
    if( df instanceof DataFrame ){ return "DataFrame" }
    if( df instanceof DF.DataFrame  ){ return "Data-Forge" }
    return "unknown"
  }
  /**
   * Returns a DataFrame with with specified columns
   * @param  {list} col_list list of column names
   * @return {DataFrame}     DataFrame containing the specified columns
   */
  get_columns( col_list ){

    var col_set = new Set(col_list)
    var drop_col = [...this.columns].filter(x => !col_set.has(x))

    return new DataFrame(this.dropSeries(drop_col), this)

  }

  /**
   * Joins the input DataFrame based on the index
   * @param  {DataFrame} df DataFrame to merge with the current DataFrame
   * @return {DataFrame}    Combined DataFrame
   */
  merge( df ){
    const merged_df = new DataFrame.merge([this, df])
    return new DataFrame(merged_df, this)
  }

  join( df, left_on, right_on, left_att, right_att ){

    console.log( 'complete this function' )
    const joined_df = df.join(df,
                              left => left[left_on],
                              right => right[right_on],
                              (left, right) => {
                                  return {
                                      first_name: left.subject_id,
                                      last_name: left['tens'],
                                      age: right.label,
                                  };
                              }
                          );

    return new DataFrame(joined_df)
  }
  /**
   * returns an Array of values paired based on the x and y attributes
   * This is intended for two dimensional plotting
   * @param  {String} att_x attribute 1 name
   * @param  {string} att_y attribute 2 name
   * @return {Array}       array of value pairs
   */
  get_pairs( att_x, att_y ){
    const x_values = this.series(att_x).values
    const y_values = this.series(att_y).values

    var value_pairs = []
    for( var i=0; i < x_values.length; i++ ){
      value_pairs.push( [x_values[i], y_values[i]] )
    }

    return value_pairs
  }

  series( col ){

    if( typeof col === "string" ){
      return new Series(this.getSeries(col))
    }

    if( typeof col === "object" ){
      var col_set = new Set(col)
      var drop_col = [...this.columns].filter(x => !col_set.has(x))

      return new DataFrame(this.dropSeries(drop_col), this)
    }
  }

  sort_values( by ){
    return new DataFrame( this.orderBy(row => row[by] ), this )
  }

  // /**
  //  * Split the DataFrame by unique values for the provided attribute.
  //  * Return an array consisting of a DataFrame for each unique value.
  //  * @param  {String } by Column name
  //  * @return {array}    Array of DataFrames, one for each unique value.
  //  */
  // groupby( by ){
  //
  //   const unique_val = this.series( by ).unique
  //
  //   // store the split DataFrame and lable into separate buffers
  //   // This needs to be done separately from storing directly into
  //   // a dictionary due to an unknown reason
  //   var groupby = []
  //   for( var i=0; i<unique_val.length; i++ ){
  //
  //     // filter the data based on the unique value
  //     const df = this.filter(row => row[by] === unique_val[i])
  //
  //     // store the results into a buffer to force deep copy
  //     var dict = {'label': unique_val[i], 'df': df }
  //     groupby.push( {...dict} )
  //   }
  //
  //   console.log( groupby[0].label )
  //   console.log( groupby[0].df )
  //   console.log( groupby[0][.df].toString() )
  //   return groupby
  //
  // }


  // rename a series in the DataFrame
  rename( col_map ){
    return new DataFrame( this.renameSeries( col_map ), this )
  }

  // add a series to the existing DataFrame
  add_series( name, array ){
    return new DataFrame( this.withSeries( name, array ), this )
  }

  /**
   * creates a training dataset based on the available data.
   * Currently, the only training sampling is implemented as
   * pure random WQMPLINT
   * @param  {float} ratio ratio of index to sample (i.e. 0.8 = 80%)
   * @return {DataFrame}    DataFrame after sampling
   */
  train( ratio ){

    // compute the total number of index to sample
    const total_samples = Math.floor( this.count() * ratio )

    // randomly sample the index
    const index =  random_array(this.index, total_samples )
    console.log( 'training --' + index.sort() )

    return this.ix( index.sort() )
  }

  /**
   * returns the data for all index not included in the training
   * DataFrame
   * @param  {DataFrame} train_df Training DataFrame
   * @return {DataFrame}          Validation DataFrame
   */
  validation( train_df ){

    const training_index = new Set(train_df.index)
    const validation_index = this.index.filter(x => !training_index.has(x))

    return this.ix( validation_index.sort() )
  }


  /**
   * Filters the DataFrame by the array of index
   * @param  {Array} array array of indicies
   * @return {DataFrame}       DataFrame containing the specified indicies
   */
  ix( array ){

    // create abuffer to hold the values at the desired index
    var values = []

    // extract the list of index in the Datframe
    const index_list = this.content.index

    // identify the index in the list and add the values at that
    // index to the buffer
    for( var idx=0; idx<index_list.length; idx++ ){
      if( array.includes(index_list[idx]) ){
        values.push( this.content.values[idx] )
      }
    }

    return new DataFrame( {index:array, values:values})
  }

  print( ){
    console.log( this.toString())
  }


  profile(){

    var profile = {}
    for( var i in this.columns ){
      var ser = this.getSeries(this.columns[i])

      // extract the data type from the Series
      const dataType = ser.detectTypes()
      if( dataType.length > 1 ){
        console.log( `Warning -- mixed types ${this.columns[i]}`)
      }
      const dtype = dataType.toArray()[0]['Type']

      // compute the number of unique values for the Series
      const unique = ser.distinct().toArray().length


      // determine the type based on the data type and the number
      // of unique values in the column
      var type = 'Other'
      if( (dtype === 'string')) type = 'Categorical'
      if( (dtype === 'number')&( unique <  10)) type = 'Categorical'
      if( (dtype === 'number')&( unique >= 10)) type = 'Numberical'



      profile[this.columns[i]] = {
        avg: ser.average(),
        std: ser.std(),
        min: ser.min(),
        max: ser.max(),
        dtype: dataType.toArray()['Type'],
        type: type,
        unique: unique,
      }

    }

    return profile

  }

  /**
   * Computes the correlation to a given column when provided. Defaults
   * to returning the correlation matrix
   * @param  {string} target column name
   * @return {object}        object containing the correlation matrix
   */
  corr( target ){

    var matrix = {}

    if( target === undefined ){
      console.log( 'correlation matrix is not implemented')
      for( var i=0; i<this.columns.length; i++ ){
        matrix[this.columns[i]] = this.col_corr( this.columns[i] )
      }
    }

    return this.col_corr( target )


  }

  // computes the correlation coefficient of all tests against the
  // target column
  col_corr( target ){

    var corr_coef = {}

    // compute the correlation coefficient of all columns against the target
    const columns = this.columns
    for( var i=0; i < columns.length; i++ ){

      corr_coef[columns[i]] = jStat.corrcoeff(this.series( target ).values,
                                              this.series(columns[i]).values
                                            )
    }

    return corr_coef

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

  constructor( ...args ){

    try {
      // console.log( 'this is the content')
      // console.log( arguments[0].getContent() )
      super( arguments[0].getContent() )
    } catch {

      super(...args)

      // initialize the index when it is not passed in
      if( !Object.keys(arguments[0]).includes('index') ){
        this.content.index = [...Array(this.count()).keys()]
      }
    }
  }

  get values(){
    return this.toArray()
  }

  // returns an array of index belonging to the DataFrame
  get index(){
    return this.getIndex().toArray()
  }

  // return a list of unique values
  get unique() {
    return this.distinct().toArray()
  }

  series( col ){
    return this.getSeries(col).toArray()
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
