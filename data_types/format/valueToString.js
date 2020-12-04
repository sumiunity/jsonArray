/**
 * Value To String
 * ====================
 *
 * Converts values to string formats based on the provided
 * data types
 *
 * @author Nik Sumikawa
 * @date Aug 31, 2020
 *
 */


export default class valueToString{

  // defaults
  constructor(){

    this.numeric = 8
    this.percentage = 2
    this.float = 4
    this.string = 50

  }

  // returns a formatted string based on the value data type
  toString( value, dtype ){

    switch( dtype ){

      case 'float': return this.format_float(value)
      case 'int': return this.format_int(value)
      case 'array': return this.format_array(value)
      case 'object': return this.format_object(value)
      case 'boolean': return this.format_boolean(value)

      case 'scientific': return this.format_scientific( value )

      case 'percent': return this.format_percentage( value )
      case 'percentage': return this.format_percentage( value )

      default: return this.format_string( value )
    }
  }

  // formats a float by removing resolution to 4 decimal points or
  // converting it to scientific notation
  format_float( value ){
    if( value/Math.pow(10,this.float-1) > 0 ) return value.toFixed(this.float).toString()
    return value.toExponential(this.float).toString()
  }

  // formats a value of percent data type into a percentage string
  format_percentage( value ){
    return `${(100*value).toFixed(this.percentage)}%`
  }

  // limits the resolution of integers. Returns the original
  // value when less than the maximum resolutions
  format_int( value ){
    if( value < Math.pow(10,this.numeric-1) ) return value.toString()
    return value.toExponential(this.float).toString()
  }

  format_array( value ){
    return value.toString()
  }

  format_object( value ){
    return value.toString()
  }

  format_boolean( value ){
    return value
  }

  format_scientific( value ){
    return Number.parseFloat(value).toExponential(2)
  }

  // limits the number of characters in a string
  format_string( value ){
    if( value.length > this.string ) return value.slice(1, this.string)
    return value
  }

}
