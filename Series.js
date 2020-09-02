/**
 * JSON Object
 * ===============
 *
 * Class that aggregates common functions performed
 * on json objects
 *
 * :Author: Nik Sumikawa
 * :Date: April 29, 2020
 */


import DataTypes from './data_types/dtypes';
import ReactComponents from './frameworks/react/ReactComponents'

import jsonArray from './jsonArray'



export default class Series extends Object {

  constructor(props={}) {
    super()

    const keys = Object.keys(props)

    if( keys.includes('index') & keys.includes('value') ){
      for( var i=0; i < props.value.length; i++ ){
        this[props.index[i]] = props.value[i]
      }
    }

    if( keys.includes('object') ){
      const keys = Object.keys(props.object)
      for( var i=0; i < keys.length; i++ ){
        this[keys[i]] = props.object[keys[i]]
      }
    }

    // allow for mixed datatype, referenced by the keys.
    // This is only applicable when the data types are provided.
    // Otherwise, it is assumed that the data is from a single
    // data type which will be parsed out
    if( props.dtypes !== undefined ){
      this.dtypes = props.dtypes
      this.dtype = 'mixed'

    }else{
      this.dtype = props.dtype

      // parse the data type from the data when one is not provided
      if( this.dtype === undefined ){
        this.dtype = new DataTypes().parse_series( this )
      }

    }

    this.name = props.name
    // this.dtype.parse_series( this )
  }

  get index(){
    return Object.keys(this.data)
  }

  get values(){
    return Object.values(this.data)
  }

  // copies the local data removes all metadata elements
  get data(){
    var data = {...this}
    delete data.dtype
    delete data.dtypes
    delete data.name

    return data
  }


  /**
   * Discretizes (bins) the values for a specific column
   * based on the users specifications
   * @param  {String} col         Column name
   * @param  {Object} [params={}] parameters to define the binning
   * @return {Object}             jsonArray containing the binning results
   */
  binning( params={} ){

    // placeholder for the bins
    var bins = [];

    // extract the parameters
    const param_keys = Object.keys(params)

    const min = this.min

    // set defaults when none are provided
    if( !param_keys.includes('bins') ) params['bins'] = 10
    if( !param_keys.includes('interval') ){
      const max = this.max
      params['interval'] = (max-min)/params['bins']
    }


    //Setup Bins
    for(var i = 0; i < params['bins']; i++ ){
      bins.push({
        binNum: i,
        minNum: min + i*params['interval'],
        maxNum: min + (i+1)*params['interval'],
        count: 0
      })
    }

    //Loop through data and add to bin's count
    for (i = 0; i < this.values.length; i++){
      var item = this.values[i];

      for (var j = 0; j < bins.length; j++){
        var bin = bins[j];
        if(item > bin.minNum && item <= bin.maxNum){
          bin.count++;
          break
        }
      }
    }

    return new jsonArray( bins )
  }


  /**
   * Counts the number of occurences for each unique value in the
   * specified column and returns a jsonArray of the statistics
   * @param  {String} col         Column name
   * @param  {Object} [params={}] parameters to define the binning
   * @return {Object}             jsonArray containing the binning results
   */
  get count(){

    // placeholder for the results
    var results = {};

    const unique_values = this.unique()

    // setup the results
    for(var i = 0; i < unique_values.length; i++ ){
      const value = unique_values[i]
      results[value] = this.values.filter(item => item === value).length
    }

    return new Series({object: results})

  }


  /**
   * Returns the number of occurences for each unique value
   * @param  {Boolean} [ordered=false] When True, the unique values are returned in sorted order
   * @return {Array}                   Array of unique values
   */
  unique( ordered=false ){
    // return all unique values for the specified column. When
    // ordered is set to true, these values are sorted.

    var unique_values = [...new Set([...this.values])]

    // When the column is an array type, concatinate all array values
    if( this.dtype === 'array'){
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
        if( this.dtype === 'string' ){
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


  /********************************************************************************
  *  Math Functions
  *  ===============================
  *  Interface for computing common statistical functions
  ********************************************************************************/
  get max(){
    if( this.values.length === 1 ) return this.values[0]
    return Math.max(...this.values)
  }

  get min(){
    if( this.values.length === 1 ) return this.values[0]
    return Math.min(...this.values)
  }

  get sum(){
    if( this.values.length === 1 ) return this.values[0]
    return this.values.reduce((a,b) => a + b, 0)
  }

  get mean(){
    if( this.values.length === 1 ) return this[0]
    return this.sum / this.values.length
  }



  /**
   * Applies the function using the variable and the local series
   * as inputs. this is intended for arithmetic Functions
   * @param  {mixed} variable variable or series
   * @param  {function} func     function to apply on the local and variable data
   * @return {Series}            Series containing the resuting data
   */
  compute(variable, func){

    var data = {...this}

    var obj = Number(variable)

    // apply the function on the objects sharing the same key
    if( isNaN(obj) ){

      for (var [key, value] of Object.entries(variable)) {
        var val = data[key]
        if( val === undefined ) val = 0
        data[key] = func( val, value)
      }

    // perform the function using the object value directly
    }else{
      for (var [key, value] of Object.entries(data)) {
        data[key] = func( value, obj)
      }
    }

    // return the data as a series
    return new Series({
      object: data,
      dtype: this.dtype,
      dtypes: this.dtypes,
      name: this.name,
    })
  }

  /**
   * Performs addition on the local Series with the variable
   * data. The variable can be an integer, string, or another
   * series object. When a Series is given, the data is added
   * based on the index
   * @param  {mixed} variable input data (supports mixed type)
   * @return {Series}         Series containing the results
   */
  add( variable ){
    return this.compute( variable, (x, y) => {return x + y} )
  }

  /**
   * Performs subtraction on the local Series with the variable
   * data. The variable can be an integer, string, or another
   * series object. When a Series is given, the data is added
   * based on the index
   * @param  {mixed} variable input data (supports mixed type)
   * @return {Series}         Series containing the results
   */
  sub( variable ){
    return this.compute( variable, (x, y) => {return x - y} )
  }

  /**
   * Performs multiplication on the local Series with the variable
   * data. The variable can be an integer, string, or another
   * series object. When a Series is given, the data is added
   * based on the index
   * @param  {mixed} variable input data (supports mixed type)
   * @return {Series}         Series containing the results
   */
  multiply( variable ){
    return this.compute( variable, (x, y) => {return x * y} )
  }

  /**
   * Performs division on the local Series with the variable
   * data. The variable can be an integer, string, or another
   * series object. When a Series is given, the data is added
   * based on the index
   * @param  {mixed} variable input data (supports mixed type)
   * @return {Series}         Series containing the results
   */
  divide( variable ){
    return this.compute( variable, (x, y) => {return x/y} )
  }

  get react(){ return new ReactComponents(this) }

}
