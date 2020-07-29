/**
 * Datetime
 * ===============
 *
 * extend the moments class to provide python datetime functions
 *
 * :Author: Nik Sumikawa
 * :Date: July 29, 2020
 */


import moment from 'moment';



export default function datetime( value ) {
  var self = moment( value );

  self.__proto__ = datetime.prototype;

  return self;
}

datetime.prototype.__proto__ = moment.prototype;

// returns the date as a string based on the provided format
datetime.prototype.toString = function(format='YYYY-MM-DD'){
  return this.format(format)
}

// returns the date as a string based on the provided format
datetime.prototype.strftime = function(format='YYYY-MM-DD'){
  return this.format(format)
}

/**
 *  adds to the date based on the params object
 * @param  {objects}  params         'add' parameters with keys of days, months, years, etc.
 * @param  {Boolean} [inplace=false] When True, the local copy of the date will be changed.
 * @return {datetime}                updated datetime object
 */
datetime.prototype.timedelta = function(params, inplace=false){

  // avoid mutating the original copy via cloning unless specified otherwise
  var date = this
  if( inplace === false ){
    date = datetime(this)
  }

  /// retrieve the offset parameters
  const param_keys = Object.keys( params )

  // add the offset to the date
  for( var i=0; i < param_keys.length; i++ ){
    const pkey = param_keys[i]
    date.add(params[pkey], pkey)
  }

  return date
}
