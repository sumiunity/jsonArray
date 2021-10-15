
import moment from 'moment'
import jsonArray from '../../jsonArray'

export default class datetime extends Object{

  constructor(data, props={}) {
    super()

    this.data = data
    this.props = props
  }


  to_datetime(col, params={}){
    var array = this.data.__inplace__(params['inplace'])
    array.create_row( col, r => moment(r.col))
    return array
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
      r['WEEK'] = r[col].week()
      r['YEAR'] = r[col].year()
      return r
    })

    return new jsonArray(array)
  }

  /**
   * Converts the date column to all date attributes
   * @param  {String} col         Date column name
   * @param  {Object} [params={}] Additional Parameters
   * @return {Array}              jsonArray containing the data
   */
  date(col, params={}){
    var array = this.data.__inplace__(params['inplace'])

    array.row_apply( r => {
      // convert the column to a moment if it is not already
      if( !(r[col] instanceof moment) ) r[col] = moment(r[col])
      r['WEEK'] = r[col].week()
      r['DAY'] = r[col].day()
      r['MONTH'] = r[col].month()
      r['YEAR'] = r[col].year()
      return r
    })

    return new jsonArray(array)
  }

  fill_weeks(week='WEEK', year='YEAR', params={}){
    var array = this.data.__inplace__(params['inplace'])

    array = array.sort_values([week])
    console.log( array )
    return new jsonArray(array)
  }

}
