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



 // import _ from 'lodash'
import jsonObject from './jsonObject'

import Series from './Series'
import DataTypes from './data_types/dtypes'
import strFormat from './data_types/format/strFormat'

import eChartsComponents from './frameworks/echarts/components'
import echartsOptions from './frameworks/echarts/options'
import echartsSeries from './frameworks/echarts/series'
import datetime from './frameworks/datetime'

import toCsv from './frameworks/fileIO/extract'

import ReactComponents from './frameworks/react/ReactComponents'

import * as stats from './statistics/matrix'



export default class jsonArray extends Array{

  constructor(array=[], inplace, dtypes) {

    // var dtypes = dtypes
    if( dtypes === undefined ) dtypes = new DataTypes( array )
    // console.log( dtypes )

    const indexName = (array.indexName === undefined) ? '__index__' : array.indexName

    // add an index column when the array is not empty
    if( (array.length > 0)&(inplace!==true) ){

      var cloned = JSON.parse(JSON.stringify(array))

      // when the Array is passed in as an array of arrays, covert
      // it to an array of objects
      if( array[0].hasOwnProperty('length') ){
        for( var i=0; i < cloned.length; i++ ){
          cloned[i] = {...cloned[i]}
        }
      }

      const columns = Object.keys(cloned[0])

      // create an internal index attribute when one doesn't exist
      if( !columns.includes(indexName) ){
        for( i=0; i < cloned.length; i++ ){
          cloned[i][indexName] = i
        }
      }


      // initialize the array based on the data type of the uncloned DataFrame
      cloned = dtypes.init(cloned)

      array = cloned
    }

    super()

    // to avoid max recursion depth, we push each row separately
    array.map( row => this.push(row))

    // console.log( dtypes )
    // dictionary containing column data types
    this.dtypes = dtypes
    this.indexName = indexName
  }


  // returns all columns in the jsonArray
  get columns(){
    var columns = []

    var max_length = this.length
    if( max_length > 50 ) max_length = 50

    for( var i=0; i < max_length; i++ ){
      columns = columns.concat(Object.keys(this[i]))
    }

    return [...new Set(columns.filter(x => ![this.indexName].includes(x)))]
  }

  /**
   * Replace the column names with those provided by the column array
   * @param  {Array} columns array of column names
   * @return {Array}         jsonArray with new column names
   */
  set columns( columns ){
      const keys = this.columns

      // define a mapping between the current and new column names
      var mapping = {}
      for( var i=0; i < Math.min(keys.length, columns.length); i++ ){
        mapping[keys[i]] =columns[i]
      }

      // return a json array with the new mapping applied
      return this.rename( mapping, {inplace: true} )
  }

  // resets the index value
  reset_index(props={}){

    // duplicate the array to avoid mutation
    var array = this.__inplace__(props['inplace'])

    // extract the index name and rename when the default
    var indexName = this.indexName
    if( indexName === '__index__') indexName = 'index'

    for( var i=0; i < array.length; i++ ){
      array[i][indexName] = array[i][this.indexName]
      array[i]['__index__'] = i
    }

    array.indexName = '__index__'

    return array
  }


  // return all values for the specified column
  values( col ){
    return [...this].map(row => row[col])
  }

  /**
   * Returns an array of index values
   * @return {Array} Array of index values
   */
  get index(){
    return [...this].map(row => row[this.indexName])
  }

  /**
   * Returns a Series containing the data for the specified column
   * @param  {string} col column name
   * @return {Series}     Series containing the column data
   */
  col( col ){
    const index = this.index
    const value = [...this].map(row => row[col])
    return new Series({
      index: index,
      value: value,
      dtype: this.dtypes[col],
      name: col
    })
  }

  /**
   * Combines the column series with the local DataFrame
   * @param {Series} series Series containing data for a single column
   */
  set_col( series, params={} ){
    // duplicate the jsonArray
    var array = this.__inplace__(params['inplace'])

    // retrieve index and convert to string type to match the
    // index from the Series
    var index = this.index.map( row => row.toString() )

    for (var [key, value] of Object.entries(series.data)) {
      var id = index.indexOf(key)

      // extend the DataFrame with a new row containing the
      // sample with an unmatched id
      if( id === -1 ){
        array.push({
          [series.name]: value,
          __index__: key
        })
        continue
      }

      // overwrite existing or create new entries for the value
      array[id][series.name] = value
    }

    return array
  }

  /// returns a jsonArray with the specified columns
  selectColumns( columns ){
    var subset = []
    this.forEach( r => {
      var row = {}
      columns.forEach(s => row[s] = r[s])
      subset.push(row)
    })
    return new jsonArray(subset)
  }

  /**
   * Standard js Slice that returns the data as a jsonArrayDocs
   * @param  {Integer} first       first index
   * @param  {Integer} last        Last index
   * @param  {Object} [params={}] Additional Parameters
   * @return {Array}             Sliced jsonArray
   */
  slice(first, last, params={} ){
    var array = [...this].slice(first, last)
    return new jsonArray(array)
  }

  // duplication of conact but with pandas syntax
  append( df ){
    return this.concat(df)
  }

  /**
   * appends the existing DataFrame with the provided DataFrame
   * @param  {Array} df jsonArray
   * @return {Array}    jsonArray with appended bojects
   */
  concat( df ){
    return new jsonArray([...this].concat(df))
  }


  /**
   * inserts an object into the array based on the specified
   * position
   * @param  {Object} obj           object to insert
   * @param  {Number} [position=0] array position
   * @param  {Object} [params={}]  parameters
   * @return {jsonArray}           jsonArray with the added object
   */
  insert( obj, position=0, params={} ){
    // duplicate the jsonArray
    var array = [...this]

    // insert at the beginning of the array
    if( position === 0 ){
      array.unshift( obj)
      return new jsonArray(array)
    }

    // insert at the end of the array
    if( position >= array.length ){
      array.push( obj)
      return new jsonArray(array)
    }

    // insert in the middle of the array
    const pos1 = array.slice(0, position)
    const pos2 = array.slice(position, array.length)

    return new jsonArray( pos1.concat([obj]).concat(pos2) )
  }


  /**
   * Applies a given function to a column and returns a DataFrame
   * with the results. The results can be written inplace or a nedw
   * column created when specified as a parameter
   * @param  {string} col     column name
   * @param  {function} func  function to apply to the column
   * @param  {string} newCol  when provided a new column is produced
   * @return {[type]}      [description]
   */
  apply( col, func, newCol ){

    if( newCol === undefined ) newCol = col

    for( var i=0; i < this.length; i++ ){
      this[i][newCol] = func(this[i][col])
    }

    return this
  }

  /**
   * cretes a new column by applying the provided function to each row
   * @param  {string} col     name of the column to create
   * @param  {function} func  function to apply to the column
   */
   create_column( col, func){

    for( var i=0; i < this.length; i++ ){
      this[i][col] = func(this[i])
    }

    return this
  }


  /**
   * applies the provided function to each row
   * @param  {function} func  function to apply to the column
   */
   row_apply( func){

    for( var i=0; i < this.length; i++ ){
      this[i] = func(this[i])
    }

    return this
  }



  // returns the values of the data at the specified index
  loc( idx, props={Series:true} ){

    // return a DataFrame when a list of index are proived
    if( typeof idx == "object" ){
      return  new jsonArray([...this].filter(row => idx.includes(row.__index__) ))
    }

    // return the row after it has been converted to a series
    if( props.Series === true ){
      const index = this.columns
      const value = Object.values([...this].filter(row => row.__index__ === idx))
      return new Series({index: index, value: value, dtypes: this.dtypes})
    }


      return [...this].filter(row => row.__index__ === idx )
  }

  // return the values of the data at the relative row number
  iloc( idx, props={Series:true} ){

    // return a DataFrame when a list of index are proived
    if( Array.isArray(idx) ){
      var array = []
      for( var i=0; i < idx.length; i++ ){
        array.push( this[idx[i]] )
      }
      return new jsonArray(array)
    }

    if( props.Series === true ){
      const index = Object.keys(this[idx])
      const value = Object.values(this[idx])
      return new Series({index: index, value: value, dtypes: this.dtypes})
    }

    return this[idx]
  }

  /**
   * overwrites the local index column with the provided column
   * @param {String} col Column name
   */
  set_index( col, params={} ){
    var array = this.__inplace__(params['inplace'])

    // delete the current index
    for( var i=0; i < array.length; i ++ ){
      delete array[i][array.indexName]
    }

    // replace the index name with the given column
    array.indexName = col

    return array
  }

  /**
   * Returns a single column as a Series Object
   * @param  {String} col         Column name
   * @param  {Object} [params={}] additional parameters
   * @return {[type]}             [description]
   */
  toSeries( col, params={}  ){
    return new Series({DataFrame: this, name: col})
  }

  /**
   * duplicate of pandas count values with the ability to pass in a
   * single or multiple columns
   * @type {strFormat}
   */
  value_counts( columns, params={} ){

    var array = this.__inplace__(params['inplace'])

    // ensure that the columns are provided as an array
    if(typeof columns === 'string') columns = [columns]

    // initialize the pareto array
    var pareto = {}
    columns.forEach(att => pareto[att] ={})

    // loop through each value and count the occurances
    array.forEach( row => {
      columns.forEach( att => {

        // create a buffer for the split attribute when one does not exist
        if( !Object.keys(pareto[att]).includes(row[att]) ){
          pareto[att][row[att]] = 0
        }

        // increment the pareto value
        pareto[att][row[att]] = pareto[att][row[att]] + 1

      })
    })

    // convert the pareto(s) to series
    var  paretoSeries = {}
    for (const [key, value] of Object.entries(pareto)) {
      paretoSeries[key] = new Series({object:value, name:key})
    }

    return paretoSeries


  }


  /**
   * Converts the contents of the jsonArray into a formatted string
   * where the columns are equally spaced apart and the values are
   * formatted based on the internal data type
   * @return {String} jsonArray contents formatted as a string
   */
  to_string(){
    const format = new strFormat(this)
    return format.table
  }

  /**
   * returns the strFormat class used to format matrix components into
   * strings such as single columns, rows, values, etc.
   * @return {class} strFormat class with the current jsonArray contents
   */
  get strFormat(){
    return new strFormat(this)
  }

  // sorts the DataFrame based on the values in the index array
  sort_index( indexArray, props={} ){

    // duplicate the array to avoid mutation
    var array = this.__inplace__(props['inplace'])

    var temp = array.create_column('__temp__', r => {
      var idx = indexArray.indexOf(r[array.indexName])
      // put missing entries at the end
      if( idx === -1 ) return array.length
      return idx
    })

    temp = temp.sort_values('__temp__')

    return temp.drop_columns(['__temp__'], {inplace:true})

  }


  // sorts the json array by the provided column
  sort_values( col, ascending=true){

    var array

    // sort the jsonArray based on the column array in order of occurance
    if( col instanceof Array ){
      for( let i=0; i < col.length; i++ ){
        array = this.sort_values(col[i])
      }
      return new jsonArray( array )
    }

    //sort the table based on the ascending flag
    if( ascending === true ){
      array = this.sort((a, b) => a[col] > b[col] ? 1 : -1 )

    }else{
      array = this.sort((a, b) => a[col] < b[col] ? 1 : -1 )
    }

    return new jsonArray( array )
  }

  /**
   * Merge two DataFrames together
   * @param  {Array} json_array           DataFrame to be merged
   * @param  {Object} [params={how:'left'] how the DataFrames should be merged
   * @param  {string} on                   index (col) to use for merging
   * @return {Array}                      DataFrame containing the merged columns
   */
  merge( json_array, params={how:'left', on:'__index__'}  ){

    var array = []
    var df1, df2, index, a, b
    // var primary_col, secondary_col, value

    var col_left, col_right

    // determine the columns to use for merging the left/right
    // DataFrames based on the specified parameters
    if( params.on !== undefined ){
      col_left = params.on
      col_right = params.on
    }
    if( params.on_right !== undefined ) col_right = params.on_right
    if( params.on_left !== undefined ) col_left = params.on_left


    // determine the merging criteria
    switch( params.how ){
      case 'left':
        df1 = [...this]
        df2 = [...json_array]
        // primary_col = col_left
        // secondary_col = col_right
        index = this.unique(col_left)
        break;

      case 'right':
        df1 = [...json_array]
        df2 = [...this]
        // primary_col = col_right
        // secondary_col = col_left
        index = json_array.unique(col_right)
        break;

      // default to merge on left
      default:
        df1 = [...this]
        df2 = [...json_array]
        // primary_col = col_left
        // secondary_col = col_right
        index = this.unique(col_left)
        break;
    }

    // var lookup = {}
    // for( a = 0; a < df2.length; a++ ){
    //   value = df2[a][secondary_col]
    //
    //   const keys = Object.keys(lookup)
    //   if( keys.includes(value) ){
    //     lookup[value].push( df2[a] )
    //   }else{
    //     lookup[value] = [df2[a]]
    //   }
    // }
    //
    // // pull the rows corresponding to the provided index value
    // for( var a=0; a < df1.length; a++ ){
    //   value = df1[a][secondary_col]
    //
    //   const lookupVal = lookup[value ]
    //
    //   // merge rows with similar index values (intersection). Create
    //   // multiple rows when duplicate index values are present
    //   if( lookupVal.length > 0 ){
    //     for( b=0; b < lookupVal.length; b++ ){
    //       array.push({...lookupVal[b], ...df1[a]})
    //     }
    //   }
    //
    //   // add the rows that have no overlap
    //   if( lookupVal.length === 0  ){
    //     array.push(df1[a])
    //   }
    //
    // }

    // pull the rows corresponding to the provided index value
    for( var i=0; i < index.length; i++ ){
      const value = index[i]
      const df1_rows = df1.filter(r => r[col_left] === value)
      const df2_rows = df2.filter(r => r[col_right] === value)

      // merge rows with similar index values (intersection). Create
      // multiple rows when duplicate index values are present
      if( (df1_rows.length > 0)&(df2_rows.length > 0) ){
        for( a=0; a < df1_rows.length; a++ ){
          for( b=0; b < df2_rows.length; b++ ){
            array.push({...df2_rows[b], ...df1_rows[a]})
          }
        }
      }

      // add the rows that have no overlap
      if( (df1_rows.length > 0)&(df2_rows.length === 0) ){
        for( a=0; a < df1_rows.length; a++ ){
            array.push(df1_rows[a])
        }
      }

    }

    return new jsonArray( array, true )

  }

  /**
   * Replaces undefined data with a given value. The values
   * can be assigned globally or by column
   * @param  {Object} [params={}] When a value is provided, it is assigned to all columns.
   *                              Values can be assigne by column, by providing a value
   *                              per colum in the parameter dictionary
   * @return {Array}             DataFrame with missing values replaed
   */
  fillna( params={} ){

    // duplicate the array to avoid mutation
    var array = this.__inplace__(params['inplace'])

    var i, j, columns, col, val

    // fill missing values with unique values per column
    // This assumes that the input is an object with a
    // value for each column name
    if( typeof params === 'object'){
      columns = Object.keys(params)

      // nothing to do when no inputs are provided
      if( columns.length === 0) return array

      for( i=0; i < array.length; i ++ ){
        for( j=0; j < columns.length; j++ ){
          col = columns[j]
          val = params[col]
          if( array[i][col] === undefined ) array[i][col] = val
          if( array[i][col] === null ) array[i][col] = val
          if( array[i][col] === '' ) array[i][col] = val
          // if( isNaN(array[i][col]) ) array[i][col] = val
        }
      }

    }else{

      // fill all missing values with the same value
      columns = array.columns

      for( i=0; i < array.length; i ++ ){
        for( j=0; j < columns.length; j++ ){
          col = columns[j]
          if( array[i][col] === undefined ) array[i][col] = params
          if( array[i][col] === null ) array[i][col] = params
          // if( isNaN(array[i][col]) ) array[i][col] = params
        }
      }
    }

    return array
  }




  // filters the json array based on the column and the provided value.
  // The value can be either a single variable or an array
  filter_column( col, value ){

    if( Array.isArray(value) ){
      return new jsonArray(
        [...this].filter(row => value.includes(row[col])),
        false,
        this.dtypes
       )
    }else{
      return new jsonArray(
        [...this].filter(row => row[col] === value ),
        false,
        this.dtypes
      )
    }
  }

  concat( array ){ return new jsonArray( [...this].concat(array)) }

  filter( func ){
    return new jsonArray( [...this].filter(func), false, this.dtypes )
  }

  map( func ){
    return [...this].map(func)
  }

  groupby( col ){
    var dtypes = this.dtypes
    dtypes['json_obj'] = 'jsonArray'

    return new jsonArray( this.__groupby__( this, col ), true, dtypes )
  }


  __groupby__( json_obj, atts, keys ){

    // append the keys with the json object
    if( atts.length === 0 ){
      keys['json_obj'] = new jsonArray(json_obj)
      keys['count'] = json_obj.length
      return keys
    }

    // initial conditions for keys
    if( keys === undefined ){ keys = {} }

    var results = []

    // const values = [...new Set(json_obj.map(row => row[atts[0]]))]
    const values = json_obj.unique(atts[0], true)
    for( var i=0; i < values.length; i++ ){
      const val = values[i]
      const group = json_obj.filter( row => row[atts[0]] === val )

      // deep copy the keys and append with the current key
      var temp_keys = Object.assign({}, keys)
      temp_keys[atts[0]] = values[i]

      results = results.concat( this.__groupby__(group, atts.slice(1),  temp_keys) )
    }

    return results
  }


  // Drops duplicates based on the specified column names. Only
  // the first occurance is kept. Other duplicate management must
  // be implemented
  count_values( columns=[]){

    if( columns.length === 0 ) columns = this.columns

    const values = this.map(r => columns.map(s => r[s]).toString())

    // create a buffer to hold the unique values
    // and the rows corresponding to the unique values
    var unique = []
    var counts = []

    // track the unique values and only add the row to
    // the buffer when it's value is unique
    for( var i=0; i < values.length; i++ ){
      const val = values[i]
      if( !unique.includes(val) ){
        unique.push(val)
        counts[val] = 0
      }
      counts[val]++
    }

    // map the unique object count back to a flat object
    var buffer = []
    for( i=0; i < unique.length; i++ ){
      const split_val = unique[i].split(',')

      //
      const obj = {count: counts[unique[i]]}
      for( var j=0; j < split_val.length; j++ ){
        obj[columns[j]] = split_val[j]
      }

      buffer.push( obj )
    }

    return new jsonArray( buffer, true  )
  }




  // Drops duplicates based on the specified column names. Only
  // the first occurance is kept. Other duplicate management must
  // be implemented
  drop_duplicates( columns=[]){

    if( columns.length === 0 ) columns = this.columns

    const values = this.map(r => columns.map(s => r[s]).toString())

    // create a buffer to hold the unique values
    // and the rows corresponding to the unique values
    var unique = []
    var buffer = []

    // track the unique values and only add the row to
    // the buffer when it's value is unique
    for( var i=0; i < values.length; i++ ){
      if( !unique.includes(values[i]) ){
          unique.push( values[i] )
          buffer.push( this[i] )
      }
    }

    return new jsonArray( buffer, true  )
  }


  /**
   * Transpose Alias
   * @param  {Object} [props={}] user provided parameters
   * @return {Object}            jsonArray containing the tranposed DataFrame
   */
  T(props={}){
    return this.transpose(props)
  }


  /**
   * Tranposes DataFrame i.e. converts the columns to rows and vice-versa
   * @param  {Object} [props={}] user provided parameters
   * @return {Object}            jsonArray containing the tranposed DataFrame
   */
  transpose(props={}){

    const columns = this.columns
    const index = this.index

    // loop through each column and row and store the
    // transposed results into a dictionary
    var temp = {}
    for( let i=0; i < this.length; i++){
      columns.forEach(col => {
        const id = index[i]
        const value = this[i][col]

        if( col !== this.indexName ){
          if( temp[col] === undefined ) temp[col] = {'__index__': col}
          temp[col][id] = value
        }

      })
    }

    // convert the object with transposed data into a jsonArray
    var array = []
    Object.values(temp).forEach(row => array.push(row))

    return new jsonArray( array )

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

    return new jsonArray(pivot_table, true )
  }


  // converts a matrix into a flatten table (opposite of pivot table)
  flatten( id_att = '__index__' ){

    // extract a list of column names
    const columns = this.columns

    var table = []

    for( var i=0; i < this.length; i++ ){
      const row = this[i]

      for( var j=0; j < columns.length; j++ ){
        const col = columns[j]

        // avoid a duplicate entry as the id attribute
        if( col === id_att ) continue

        table.push({
          column: col,
          row: row[id_att],
          value:  row[col]
        })
      }
    }

    return new jsonArray( table, true )

  }

  // creates a pivot table based on the specified row and column.
  // The summary type is used to compute the value of the pivot.
  pivot_table( row, column, summaryType='count', value=undefined ){

    var pivot_table = []

    const row_val = this.unique( row )
    const column_val = this.unique( column )


    for( var i=0; i < row_val.length; i++ ){
      // initialize the row to contain the column name
      var temp = {row: row_val[i]}

      const rval = row_val[i]
      // const by_row = this.filter( r => r[row] === rval )
      const by_row = [...this].filter( r => r[row] === rval )

      // add the column value for each row
      for( var j=0; j < column_val.length; j++ ){

        const cval = column_val[j]
        // const by_col = by_row.filter( r => r[column] === cval )
        const by_col = [...by_row].filter( r => r[column] === cval )
        // const by_col = [...this].filter( r => (r[row] === rval)&(r[column] === cval) )
        // console.log( by_col )

        var temp_json
        switch( summaryType ){
          // returns the number of rows for the current split
          case 'count':
            temp[column_val[j]] = by_col.length
            break;

          // returns the number of unique values for the current split
          case 'unique':
            // set defaults for missing parameter values
            if( value === undefined ) value = '__index__'

            temp_json = new jsonArray( by_col )
            temp[column_val[j]] = temp_json.unique( value ).length
            break;

          case 'sum':
            temp[column_val[j]] = stats.sum( by_col, value)
            break;

          case 'mean':
            temp[column_val[j]] = stats.mean( by_col, value)
            break;

          case 'func':
            temp_json = new jsonArray( by_col )
            temp[column_val[j]] = value( temp_json )
            break;

          default:
            temp[column_val[j]] = by_col.length
            break
        }

      }

      // add the results to the final pivot table
      pivot_table.push( temp )
    }

    return new jsonArray(pivot_table, true )
  }

  /**
   * convert the column data type based on the mapping
   * @param  {Object} [columns={}] object containing the mapping between columns and data type
   * @param  {Object} [params={}]  parameter object
   * @return {Array}              jsonArray containing the mapped columns
   */
  astype( columns={}, params={} ){

    var inplace = true
    if( params.inplace !== undefined ) inplace = params.inplace

    var array = this.__inplace__(inplace)

    // convert all columns based on the specified data types
    const col_names = Object.keys(columns)
    for( var i=0; i < col_names.length; i++ ){
      const col = col_names[i]
      array = array.dtypes.convert(array, col, columns[col], params)
    }

    return array
  }

  // converts the specified column into a date string
  strftime( col, format='YYYY-MM-DD', params={} ){
    var array = this.__inplace__(params['inplace'])
    return array.dtypes.convert(array, col, 'strftime', params)
  }

  // converts the specified column into a
  strptime( col, params={} ){
    var array = this.__inplace__(params['inplace'])
    return array.dtypes.convert(array, col, 'datetime', params)
  }


  /**
   * Creates a new column by merging the content from the columns
   * specified in the columns attribute
   * @param  {array} columns  array of column names
   * @param  {String} col_name Name of the resulting column
   * @param  {String} [sep='   ']            string delimiter
   * @return {OBJECT}          jsonArray with the new column
   */
  combine( columns, col_name, sep=' ', params={} ){

    var array = this.__inplace__(params['inplace'])

    for( var i=0; i < this.length; i++ ){
      // seed the value with the value from the first column
      var temp = this[i][columns[0]]

      for( var j=1; j < columns.length; j++ ){
        temp = temp + sep + this[i][columns[j]]
      }

      array[i][col_name] = temp
    }

    array.dtypes[col_name] = 'string'
    return array
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

    return new jsonObject( object )
  }

  /**
   * creates a single column with the hex color string based
   * on the RGB color values taken from separate columns
   * @param  {string} rcol red color column
   * @param  {string} gcol green color column
   * @param  {string} bcol blue color column
   * @return {[type]}      [description]
   */
  to_rgb( rcol, gcol, bcol, colorCol='rgb'){
    const toHex = require('./frameworks/colors/Colors').rgbToHex

    for( var i=0; i < this.length; i++ ){
      this[i][colorCol] = toHex( this[i][rcol], this[i][gcol], this[i][bcol])
    }

    this.dtypes[colorCol] = 'hexcolor'
    return this
  }


  /**
   * converts the column value into a color
   * @param  {string} col color column
   * @param  {string} colorType color label
   */
  to_color( col, colorType='entropy_8bit'){
    const get_color = require('./frameworks/colors/Colors').get_color

    for( var i=0; i < this.length; i++ ){
      this[i]['color'] = get_color( this[i][col], colorType)
    }

    this.dtypes['color'] = 'hexcolor'
    return this
  }


  unique( col, ordered=false ){
    // return all unique values for the specified column. When
    // ordered is set to true, these values are sorted.

    // filter the undefined values from unique
    var values = [...this]
      .map(row => row[col])
      .filter(row => row !== undefined)

    // remove duplicates by forcing to a set
    var unique_values = [...new Set(values)]

    // When the column is an array type, concatinate all array values
    if( this.dtypes[col] === 'array'){
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

        switch( typeof unique_values[0] ){
          case "string":
            return unique_values.sort()

          case "boolean":
            return unique_values.sort()

          default :
            try{
              unique_values = unique_values.map( x => +x)
              unique_values = unique_values.sort(function(a,b){return a - b})
            }catch{
              // default to the standard sort
              unique_values.sort()
            }
        }

    }

    return unique_values
  }




  /**
   * Applies a threshold to the specified column
   * @param  {function} func     function used to partition dataset
   * @param  {string} res_col   column name containing the results
   * @return {Array}            jsonArray containing res_col
   */
  label( func, params={} ){

    const param_keys = Object.keys(params)

    // set defaults for missing parameter values
    if( !param_keys.includes('output_col') ) params['output_col'] = 'label'
    if( !param_keys.includes('value') ) params['value'] = true
    if( !param_keys.includes('default') ) params['default'] = false
    if( !param_keys.includes('inplace') ) params['inplace'] = false

    var array = this.__inplace__(params['inplace'])


    // identify all samples identified by the rule
    const sample_index = array.filter( func ).map( row => row.__index__ )

    // create a boolean label, where parts in the sample set are true
    for( var i=0; i < array.length; i ++ ){

      // extract a list of columns name for the given row
      const columns = Object.keys( array[i] )

      // the value is true when it is included in the sample set
      if( sample_index.includes( array[i].__index__ ) ){
        array[i][params['output_col']] = params['value']
        continue
      }

      // set the default value when no value exists
      if( !columns.includes(params['output_col']) ){
        array[i][params['output_col']] = params['default']
        continue
      }

    }

    return array
  }

  /**
   * Copies the content from one column to a new column. This is
   * non destructive, so if the column already exists, only the
   * missing data will be copied over
   * @param  {String} col     original column name
   * @param  {String} new_col new column name
   * @return {Object}         jsonArray with the new column added
   */
  copy_column( col, new_col, params={} ){

    // clone the local copy to avoid mutation
    var array = this.__inplace__(params['inplace'])

    // delete the specified column(s) from the DataFrame
    for( var i = 0; i < array.length; i++ ){
      const columns = Object.keys(array[i] )

      if(!columns.includes( new_col) ){
        array[i][new_col] = array[i][col]
      }
    }

    return new jsonArray( array )
  }


  /**
   * Returns a DataFrame containing only the specified column
   * and the index
   * @param  {array} columns array of column names
   * @return {array}         json array containing the specified columns
   */
  select_columns( columns ){

    var array = []

    // delete the specified column(s) from the DataFrame
    for( var i = 0; i < this.length; i++ ){

      var row = {__index__: this[i].__index__}
      // copy the specified columns for each row
      for( var j=0; j < columns.length; j++ ){
        const col = columns[j]
        row[col] = this[i][col]
      }

      array.push( row )
    }

    return new jsonArray( array )
  }

  /**
   * Drops columns from the DataFrame
   * @param  {String or Array} columns String or Array of column names
   * @return {OBJECT}         JsonArray without the specified columns
   */
  drop_columns( columns, params={} ){

    // clone the local copy to avoid mutation
    var array = this.__inplace__(params['inplace'])

    // delete the specified column(s) from the DataFrame
    for( var i = 0; i < array.length; i++ ){

      // delete the specified column when of string type
      if( typeof columns === 'string' ){
        delete array[columns]

      // when a list is provided, delete all columns in the string
      }else{

        for( var j=0; j < columns.length; j++ ){
          delete array[i][columns[j]]
        }
      }
    }

    return new jsonArray( array )
  }


  /**
   * renames columns
   * @param  {object} mapping object containing the existing column name and new column name
   * @return {object}         json array with the new column naming
   */
  rename( mapping, params={} ){

    // clone the local copy to avoid mutation
    var array = this.__inplace__(params['inplace'])

    const columns = Object.keys( mapping )

    // rename the specified columns
    for( var i = 0; i < array.length; i++ ){

      const ex_columns = Object.keys( array[i] )

      // create a new column based on the mapping and delete
      // the existing one (taht was replaced)
      for( var j=0; j < columns.length; j++ ){
        // only replace the column when data exists for that column
        if( ex_columns.includes(columns[j]) ){
          const new_col = mapping[columns[j]]
          array[i][new_col] = array[i][columns[j]]

          // console.log( columns[j], typeof columns[j], typeof columns[j] instanceof 'string' )
          delete array[i][columns[j]]

        }
      }
    }

    return new jsonArray( array )
  }


  /**
   * replaces the values in the specified column with the given value
   * based on the mapping
   * @param  {String} col     original column name
   * @param  {Object} mapping Object containing the value mapping
   * @return {Object}         jsonArray with the new column added
   */
  replace( col, mapping={}, params={} ){

    // clone the local copy to avoid mutation
    var array = this.__inplace__(params['inplace'])

    const newCol = (params.newCol === undefined) ? col : params.newCol

    const values = Object.keys( mapping )

    // delete the specified column(s) from the DataFrame
    for( var i = 0; i < array.length; i++ ){

      // do not perform mapping when no data nor the mapping exists
      if(array[i] === undefined ) continue

      // copy the original content when there's not mapping
      if(!values.includes(array[i][col])){
        array[i][newCol] = array[i][col]
        continue
      }

      array[i][newCol] = mapping[array[i][col]]

    }

    return new jsonArray( array )
  }



  /**
   * returns the data object. When enable is true, the original
   * jsonArray is returned so the values are modified directly. Otherwise
   * the jsonArray is cloned to avoid mutation of the original object
   *
   * @param  {Boolean} [enable] when inplace is True, the data is not cloned. Defaults to returning a clone
   * @return {Object}             current jsonArray content
   */
  __inplace__( enable=false ){

    // clone the local copy to avoid mutation when inplace is disabled
    if( enable ) return this

    return new jsonArray( this )
  }


  /********************************************************************************
  *  Math Functions
  *  ===============================
  *  Interface for computing common statistical functions
  ********************************************************************************/
  max(col){ return stats.max(this, col)  }
  min(col){ return stats.min(this, col)  }
  sum(col){ return stats.sum(this, col)  }
  mean(col){ return stats.mean(this, col)  }
  forward_diff(col, newCol, step=1){ return stats.forward_diff(this, col, newCol, step)  }
  rolling_average(col, window=1, avgType){ return stats.rolling_average(this, col, window, avgType)  }
  stats(){ return stats  }



  toCsv(filename){ toCsv(this, filename ) }
  // max(col){
  //   if( this.length === 1 ) return this[0][col]
  //   return Math.max(...this.map(row => row[col])) }
  // min(col){
  //   if( this.length === 1 ) return this[0][col]
  //   return Math.min(...this.map(row => row[col])) }
  // sum(col){
  //   if( this.length === 1 ) return this[0][col]
  //   return this.map(row => row[col]).reduce((a,b) => a + b, 0) }
  // mean(col){
  //   if( this.length === 1 ) return this[0][col]
  //   return this.sum(col) / this.length }

  /********************************************************************************
  *  ECharts json array interface
  *  ===============================
  *  Interface that returns echarts series objects for plotting
  ********************************************************************************/


  get dt(){ return new datetime( this ) }

  // /**
  //  * echarts line plot data formatter
  //  * @param  {stringi} col  column name
  //  * @return {object}      echarts data series object
  //  */
  get echartsOptions( ){ return new echartsOptions( this ) }
  get echartsSeries( ){ return new echartsSeries( this ) }

  get echarts( ){ return new eChartsComponents( this ) }

  get react(){ return new ReactComponents(this) }

  get fileIO(){
    const fromFileLibrary = require('./frameworks/fileIO/fromFile').default
    return new fromFileLibrary(this)
  }
}
