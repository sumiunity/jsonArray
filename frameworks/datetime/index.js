
import moment from 'moment'
import jsonArray from '../../jsonArray'

export default class datetime extends Object{

  constructor(data, props={}) {
    super()

    this.data = data
    this.props = props
  }

  /**
   * Converts the date column into moment format
   * @param  {String} col         Date column name
   * @param  {Object} [params={}] Additional Parameters
   * @return {Array}              jsonArray containing the data
   */
  to_datetime(col, params={}){
    var array = this.data.__inplace__(params['inplace'])
    array.row_apply( r => {
      if( !(r[col] instanceof moment) ) r[col] = moment(r[col])
      return r
    })

    array.dtypes[col] = 'datetime'
    return new jsonArray(array)
  }

  /**
   * Converts the date column to week attributes
   * @param  {String} col         Date column name
   * @param  {Object} [params={}] Additional Parameters
   * @return {Array}              jsonArray containing the data
   */
  week(col, params={}){
    var array = this.data.__inplace__(params['inplace'])

    array.row_apply( r => {
      // convert the column to a moment if it is not already
      if( !(r[col] instanceof moment) ) r[col] = moment(r[col])
      r['WEEK'] = r[col].isoWeek()
      r['YEAR'] = r[col].isoWeekYear()
      r['WEEK_LABEL'] = `${r[col].isoWeekYear()}-${String(r[col].isoWeek()).padStart(2, '0')}`
      return r
    })

    // define the datatypes for the created/modified attributes
    array.dtypes = {
      ...array.dtypes,
      ...{
        [col]: 'datetime',
        'WEEK_NUM': 'int',
        'YEAR': 'int',
        'WEEK_LABEL': 'string',
      }
    }

    return new jsonArray(array)
  }

  /**
   * Converts the date column to all date attributes
   * @param  {String} col         Date column name
   * @param  {Object} [params={}] Additional Parameters
   * @return {Array}              jsonArray containing the data
   */
  date(col, format='YYYY-MM-DD', params={}){
    var array = this.data.__inplace__(params['inplace'])

    array.row_apply( r => {
      // convert the column to a moment if it is not already
      if( !(r[col] instanceof moment) ) r[col] = moment(r[col], format)
      r['WEEK'] = r[col].isoWeek()
      r['DAY'] = r[col].format('D')
      r['DAYOFWEEK'] = r[col].day()
      r['MONTH'] = r[col].format('M')
      r['YEAR'] = r[col].isoWeekYear()
      r['WEEK_LABEL'] = `${r[col].isoWeekYear()}-${r[col].isoWeek()}`
      return r
    })

    // define the datatypes for the created/modified attributes
    array.dtypes = {
      ...array.dtypes,
      ...{
        [col]: 'datetime',
        'WEEK': 'int',
        'YEAR': 'int',
        'DAY': 'int',
        'DAYOFWEEK': 'int',
        'MONTH': 'int',
        'WEEK_LABEL': 'string',
      }
    }

    return new jsonArray(array)
  }


  /**
   * Inserts empty objects for missing days
   * @param  {String}               date column name
   * @param  {Object} [params={}]   Extra Parameters
   * @return {jsonArray}            JsonArray with missing weeks
   */
  fill_days(col, params={}){

    var array = this.data.__inplace__(params['inplace'])

    array = array.dt.to_datetime(col, {inplace: true})
    array = array.sort_values(col )

    // push the existing values into the array with empty
    // objects for missing weeks
    var newArray = [array[0]]
    for( let i=1; i < array.length; i++ ){

      const diffTime = Math.abs(array[i][col] - array[i-1][col]);
      const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24))

      for( let j = 1; j < diffDays; j++ ){
        newArray.push( {[col]: moment(array[i-1][col]).add({days: j}) })
      }

      // the existing entry to the buffer
      newArray.push( array[i] )
    }

    return new jsonArray(newArray)
  }



  /**
   * Inserts empty objects for missing weeks
   * @param  {String} [week='WEEK'] Week column name. Defaults to Week
   * @param  {String} [year='YEAR'] Year column mane. Defaults to YEAR
   * @param  {Object} [params={}]   Extra Parameters
   * @return {jsonArray}            JsonArray with missing weeks
   */
  fill_weeks(week='WEEK', year='YEAR', params={}){

    var array = this.data.__inplace__(params['inplace'])

    array = array.sort_values([week, year])


    // push the existing values into the array with empty
    // objects for missing weeks
    var newArray = [array[0]]
    for( let i=1; i < array.length; i++ ){

      // add values that cross multiple years
      if( array[i][year] !== array[i-1][year]){
        for( let j = array[i-1][week]+1; j < 53; j++ ){
          newArray.push({[week]: j, [year]: array[i-1][year]})
        }

        for( let j = 1; j < array[i][week]; j++ ){
          newArray.push({[week]: j, [year]: array[i][year]})
        }

      }else{

        // create entries for all missing weeks
        for( let j = array[i-1][week]+1; j < array[i][week]; j++ ){
          newArray.push({[week]: j, [year]: array[i][year]})
        }
      }

      // the existing entry to the buffer
      newArray.push( array[i] )
    }

    return new jsonArray(newArray)
  }



  /*************************************************************************************
  *     Arithmetic functions
  ************************************************************************************/

  /**
   * Adds to the provided date attribtue
   * @param {String} col              date column name
   * @param {Object} [value={days:1}] object containing the value to add to the date
   * @return {jsonArray}            JsonArray with changes
   */
  add( col, value={days:1}, params={} ){
    var array = this.data.__inplace__(params['inplace'])

    array.row_apply( r => {
      // convert the column to a moment if it is not already
      if( !(r[col] instanceof moment) ) r[col] = moment(r[col])
      r[col].add(value)
      return r
    })

    return new jsonArray(array)
  }

  /**
   * Subtracts from the provided date attribtue
   * @param {String} col              date column name
   * @param {Object} [value={days:1}] object containing the value to subtract from the date
   * @return {jsonArray}            JsonArray with changes
   */
  sub( col, value={days:1}, params={} ){
    var array = this.data.__inplace__(params['inplace'])

    array.row_apply( r => {
      // convert the column to a moment if it is not already
      if( !(r[col] instanceof moment) ) r[col] = moment(r[col])
      r[col].subtract(value)
      return r
    })

    return new jsonArray(array)
  }


  /*************************************************************************************
  *     Formatting Functions
  ************************************************************************************/

  /**
   * formats the datetime attribute into a string format
   * @param {String} col              date column name
   * @param {String} format           formatting string
   * @param {Object} [params={}]      additional paramters
   * @return {jsonArray}            JsonArray with changes
   */
  format( col, format='YYYY-MM-DD', params={} ){
    var array = this.data.__inplace__(params['inplace'])

    array.row_apply( r => {
      // convert the column to a moment if it is not already
      if( !(r[col] instanceof moment) ) r[col] = moment(r[col])
      r[col] = r[col].format(format)
      return r
    })

    return new jsonArray(array)
  }

  /**
   * formats the datetime attribute into a string format
   * @param {String} col              date column name
   * @param {String} format           formatting string
   * @param {Object} [params={}]      additional paramters
   * @return {jsonArray}            JsonArray with changes
   */
  strftime( col, format='YYYY-MM-DD', params={} ){
    return this.format(col, format, params )
  }


}
