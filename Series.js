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
import eChartsComponents from './frameworks/echarts/components'
import echartsOptions from './frameworks/echarts/options'
import echartsSeries from './frameworks/echarts/series'

import jsonArray from './jsonArray'



export default class Series extends Array {

  constructor(props={}) {
    super()

    const keys = Object.keys(props)

    var array = []


    this.name = props.name
    if( this.name === undefined ) this.name = 'value'


    if( keys.includes('index') & keys.includes('value') ){
      for( var i=0; i < props.value.length; i++ ){
        array.push( {__index__: props.index[i],  value: props.value[i]} )
      }
    }

    if( keys.includes('object') ){
      const keys = Object.keys(props.object)
      for( i=0; i < keys.length; i++ ){
        array.push( {__index__: keys[i],  value: props.object[keys[i]]} )
      }
    }

    if( keys.includes('Series') ){
      const ser = props.Series
      props.Series.forEach(obj => {
        this.push( {__index__: obj.__index__,  value: obj['value']} )
      })
    }

    if( keys.includes('DataFrame') ){
      props.DataFrame.forEach(obj => {
        this.push( {__index__: obj.__index__,  [props.name]: obj[props.name]} )
      })
      this.name = props.name
    }

    // allow for mixed datatype, referenced by the keys.
    // This is only applicable when the data types are provided.
    // Otherwise, it is assumed that the data is from a single
    // data type which will be parsed out
    if( props.dtype !== undefined ){
      this.dtype = props.dtype
      this.dtype = 'mixed'

    }else{
      this.dtype = props.dtype

      // parse the data type from the data when one is not provided
      if( this.dtype === undefined ){
        this.dtype = new DataTypes(array)
        this.dtype.init(array)
      }

    }

    array.map( row => this.push(row))



  }

  /**
   * returns an array of index values in order
   * @return {Array} index values in order
   */
  get index(){
    return this.map(r => r.__index__)
  }

  /**
   * returns an array of values in order
   * @return {Array} values in order
   */
  get values(){
    return this.map(r => r['value'])
  }

  /**
   * Overwrites the index with the provided array
   * @param  {Array} values Array of index values
   */
  set index( values ){
    this.insert( values, '__index__')
  }

  /**
   * Overwrites the index with the provided array
   * @param  {Array} values Array of index values
   */
  set values( values ){
    this.insert( values, 'value')
  }

  /**
   * Replaces the Series values with the
   * @param  {Array} values Array of index values
   */
  insert( values, col='value' ){
    for( let i=0; i < values.length; i++ ){
      this[i][col] = values[i]
    }

    return this
  }


  /**
   * replaces the index based on values in the mapping object
   * @param  {Object} mapping Object containing the value mapping
   * @return {Object}         Series with the mapped index
   */
  replace_index( mapping, params={}){
    return this.replace(mapping, '__index__', params)
  }

  /**
   * replaces the values based on values in the mapping object
   * @param  {String} col     original column name
   * @param  {Object} mapping Object containing the value mapping
   * @return {Object}         Series with the mapped values
   */
  replace( mapping={}, col='value', params={} ){

    // clone the local copy to avoid mutation
    var ser = this.__inplace__(params['inplace'])

    const keys = Object.keys( mapping )

    for( let i = 0; i < ser.length; i++ ){
      const value = ser[i][col].toString()

      // replace the value based on the mapping when it exists
      if( keys.includes(value) ){
        ser[i][col] = mapping[value]
      }
    }

    return ser
  }

  /**
   * converts the Series data into an objects
   * @return {Object} Object containing the series data
   */
  toObject(){
    var obj = {}
    this.forEach(r=> obj[r.__index__] = r.value)

    return obj
  }

  /**
   * applies the provided function to each row
   * @param  {function} func  function to apply to the column
   */
  apply( func, params={}){

    // clone the local copy to avoid mutation
    var ser = this.__inplace__(params['inplace'])

    for( var i=0; i < ser.length; i++ ){
      ser[i] = func(ser[i])
    }

    return ser
  }
  //
  // // copies the local data removes all metadata elements
  // get data(){
  //   var data = {...this}
  //   delete data.dtype
  //   delete data.dtypes
  //   delete data.name
  //
  //   return data
  // }
  //
  //
  // /**
  //  * Discretizes (bins) the values for a specific column
  //  * based on the users specifications
  //  * @param  {String} col         Column name
  //  * @param  {Object} [params={}] parameters to define the binning
  //  * @return {Object}             jsonArray containing the binning results
  //  */
  // binning( params={} ){
  //
  //   // placeholder for the bins
  //   var bins = [];
  //
  //   // extract the parameters
  //   const param_keys = Object.keys(params)
  //
  //   const min = this.min
  //
  //   // set defaults when none are provided
  //   if( !param_keys.includes('bins') ) params['bins'] = 10
  //   if( !param_keys.includes('interval') ){
  //     const max = this.max
  //     params['interval'] = (max-min)/params['bins']
  //   }
  //
  //
  //   //Setup Bins
  //   for(var i = 0; i < params['bins']; i++ ){
  //     bins.push({
  //       binNum: i,
  //       value: min + i*params['interval'],
  //       max: min + (i+1)*params['interval'],
  //       count: 0
  //     })
  //   }
  //
  //   //Loop through data and add to bin's count
  //   for (i = 0; i < this.values.length; i++){
  //     var item = this.values[i];
  //
  //     for (var j = 0; j < bins.length; j++){
  //       var bin = bins[j];
  //
  //       // condition logic to account for the first step
  //       // to include the minimum value
  //       var logic = item > bin.value && item <= bin.max
  //       if( j === 0) logic = item >= bin.value && item <= bin.max
  //
  //       if(logic){
  //         bin.count++;
  //         break
  //       }
  //     }
  //   }
  //
  //   return new jsonArray( bins )
  // }
  //


  // sorts the json array by the provided column
  sort_values( ascending=true, params={}){

    var ser = this.__inplace__(params['inplace'])

    //sort the table based on the ascending flag
    if( ascending === true ){
      ser = this.sort((a, b) => a['value'] > b['value'] ? 1 : -1 )

    }else{
      ser = this.sort((a, b) => a['value'] < b['value'] ? 1 : -1 )
    }

    return ser
  }


  /**
   * Counts the number of occurences for each unique value in the
   * specified column and returns a jsonArray of the statistics
   * @param  {String} col         Column name
   * @param  {Object} [params={}] parameters to define the binning
   * @return {Object}             jsonArray containing the binning results
   */
  get value_counts(){

    // placeholder for the results
    var pareto = {};

    // loop through each value and count the occurances
    this.forEach( row => {
      const value = row['value']

      // create a buffer for the split attribute when one does not exist
      if( !Object.keys(pareto).includes(value) ) pareto[value] = 0

      // increment the pareto value
      pareto[value] = pareto[value] + 1

    })

    return new Series({object: pareto})

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

  /**
   * Crops a pareto by removing the last entries and adding an other
   * entry to represent the removed values
   * @param  {Integer}  count            Number of samples to include in the pareto
   * @param  {Boolean} [ascending=true] When true, the pareto is sorted in ascending order
   * @param  {Object}  [params={}]      Additional parameters
   * @return {Series}                   Cropped Series
   */
  pareto_crop( count, ascending=false, params={}){

    // order the values in the pareto
    var array = this.sort_values(ascending)

    // compute the sum of all samples cropped out
    var other = array.slice(count, array.length)
      .map(r => r['value'])
      .reduce((a,b) => a + b, 0)

    var pareto = array.slice(0,count).concat({__index__: 'other', value: other})

    return new Series({Series:pareto, name: this.name})
  }




  /**
   * returns the Series object. When enable is true, the original
   * Series is returned so the values are mutatable. Otherwise
   * the Series is cloned to avoid mutation of the original object
   *
   * @param  {Boolean} [enable] when inplace is True, the data is not cloned. Defaults to returning a clone
   * @return {Object}             current jsonArray content
   */
  __inplace__( enable=false ){

    // clone the local copy to avoid mutation when inplace is disabled
    if( enable === true ) return this

    return new Series({Series:this, name: this.name})
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

  //
  //
  // /**
  //  * Applies the function using the variable and the local series
  //  * as inputs. this is intended for arithmetic Functions
  //  * @param  {mixed} variable variable or series
  //  * @param  {function} func     function to apply on the local and variable data
  //  * @return {Series}            Series containing the resuting data
  //  */
  // compute(variable, func){
  //
  //   var data = {...this}
  //
  //   var obj = Number(variable)
  //
  //   var key, value
  //
  //   // apply the function on the objects sharing the same key
  //   if( isNaN(obj) ){
  //
  //     for ([key, value] of Object.entries(variable)) {
  //       var val = data[key]
  //       if( val === undefined ) val = 0
  //       data[key] = func( val, value)
  //     }
  //
  //   // perform the function using the object value directly
  //   }else{
  //     for ([key, value] of Object.entries(data)) {
  //       data[key] = func( value, obj)
  //     }
  //   }
  //
  //   // return the data as a series
  //   return new Series({
  //     object: data,
  //     dtype: this.dtype,
  //     dtypes: this.dtypes,
  //     name: this.name,
  //   })
  // }
  //
  // /**
  //  * Performs addition on the local Series with the variable
  //  * data. The variable can be an integer, string, or another
  //  * series object. When a Series is given, the data is added
  //  * based on the index
  //  * @param  {mixed} variable input data (supports mixed type)
  //  * @return {Series}         Series containing the results
  //  */
  // add( variable ){
  //   return this.compute( variable, (x, y) => {return x + y} )
  // }
  //
  // /**
  //  * Performs subtraction on the local Series with the variable
  //  * data. The variable can be an integer, string, or another
  //  * series object. When a Series is given, the data is added
  //  * based on the index
  //  * @param  {mixed} variable input data (supports mixed type)
  //  * @return {Series}         Series containing the results
  //  */
  // sub( variable ){
  //   return this.compute( variable, (x, y) => {return x - y} )
  // }
  //
  // /**
  //  * Performs multiplication on the local Series with the variable
  //  * data. The variable can be an integer, string, or another
  //  * series object. When a Series is given, the data is added
  //  * based on the index
  //  * @param  {mixed} variable input data (supports mixed type)
  //  * @return {Series}         Series containing the results
  //  */
  // multiply( variable ){
  //   return this.compute( variable, (x, y) => {return x * y} )
  // }
  //
  // /**
  //  * Performs division on the local Series with the variable
  //  * data. The variable can be an integer, string, or another
  //  * series object. When a Series is given, the data is added
  //  * based on the index
  //  * @param  {mixed} variable input data (supports mixed type)
  //  * @return {Series}         Series containing the results
  //  */
  // divide( variable ){
  //   return this.compute( variable, (x, y) => {return x/y} )
  // }
  //
  // get react(){ return new ReactComponents(this) }

  // /**
  //  * echarts line plot data formatter
  //  * @param  {stringi} col  column name
  //  * @return {object}      echarts data series object
  //  */
  get echartsOptions( ){ return new echartsOptions( this ) }
  get echartsSeries( ){ return new echartsSeries( this ) }
  get echarts( ){ return new eChartsComponents( this ) }

  get react(){
    const props = {colx: '__index__', name: '__index__', coly: 'value', col: 'value' }
    return new ReactComponents(this, props) }

}
