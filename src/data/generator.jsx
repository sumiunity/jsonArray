
import {gaussian} from './random.jsx'
import {DataFrame} from './DataFrame.js'

export class DataSet{

  constructor( samples ){
    this.samples = samples
    this.col = []
    this.col_name = []

    this.col_number = 0
  }


  /**
   * create categorical columns (i.e. non numeric columns)
   * @param  {integer} tests       number of correlated tests to create
   * @param  {Number} [range=100] maximum range of the data
   * @return {None}
   */
  categorical( columns, unique ){

    // default the number of unique values to the total number of samples
    if( unique === undefined ) unique = this.samples

    // create data with the current collumn number and the
    // sample as part of a string
    for( var j=0; j < columns; j++ ){

      var samples = []
      for( var i=0; i < this.samples; i++ ){
        const random_val = Math.floor( Math.random() * unique )
        samples.push( `C${this.col_number}-${random_val}` )
      }
      this.col.push( samples )
      this.col_name.push( `${this.col_number}_CAT`)
      this.col_number++

    }
  }

  /**
   * create pairwise correlated columns
   * @param  {integer} tests       number of correlated tests to create
   * @param  {Number} [range=100] maximum range of the data
   * @return {None}
   */
  correlated( columns, range=100 ){

    // print error when insufficent parameters
    if( columns < 2 ){
      console.log( 'method requires test >= 2')
      return
    }

    // create the base test, which the other correlated tests
    // will be derived
    var datapoints = []
    for( var i=0; i < this.samples; i++ ){
      datapoints.push( Math.random() * range )
    }
    this.col.push( datapoints)
    this.col_name.push( `${this.col_number}_CORR`)
    this.col_number++

    for( var j=1; j < columns; j++ ){

      var corrpoints = []
      for( i=0; i < this.samples; i++ ){
        corrpoints.push( datapoints[i] + gaussian(0, range/50) )
      }
      this.col.push( corrpoints)
      this.col_name.push( `${this.col_number}_CORR`)
      this.col_number++

    }
  }

  separable( groups, sigma, columns=1 ){

    var group_size = Math.floor(this.samples/groups)

    var samples
    var datapoints = []
    var samples_remaining = this.samples


    // create a label for each group
    for( var s=0; s<groups; s++ ){
      // determine the number of samples to create. consider
      // the end case that main contain more or less samples
      samples = group_size
      if( s === groups-1 ){
        samples = samples_remaining
      }

      for( var g=0; g<samples; g++ ){
        datapoints.push( s )
      }

      samples_remaining = samples_remaining - samples
    }
    this.col.push( datapoints)
    this.col_name.push( `${this.col_number}_LABEL`)
    this.col_number++



    for( var c=0; c<columns; c++ ){

      // create a label for each group
      datapoints = []
      samples_remaining = this.samples
      for( s=0; s<groups; s++ ){
        // determine the number of samples to create. consider
        // the end case that main contain more or less samples
        samples = group_size
        if( s === groups-1 ){
          samples = samples_remaining
        }
        // select the mean of the new distribution randomly
        var mean = gaussian(0, sigma)

        for( g=0; g<samples; g++ ){
          datapoints.push( gaussian(mean, 1) )
        }

        samples_remaining = samples_remaining - samples
      }
      this.col.push( datapoints)
      this.col_name.push( `${this.col_number}_SEPARABLE`)
      this.col_number++

    }




  }

  /**
   * Returns the randomly generated data as a DataFrame
   * @return {DataFrame} randomly generated data as a DataFrame
   */
  toDataFrame(){

    // // format the local column names and data into a dictionary
    // var columns = {}
    // for( var c=0; c<this.col_name.length; c++){
    //   columns[this.col_name[c]] = this.col[c]
    // }

    // return a DataFrame with the data
    return new DataFrame( this.format() )
  }



  format( ){


    var formatted = []
    // loop through each row and format the array into an array
    // of dictionaries.
    for( var r=0; r<this.samples; r++ ){

      // create a placeholder for the row data
      var row_val = {id:r+1}

      for( var c=0; c<this.col_name.length; c++ ){
        row_val[this.col_name[c]] = this.col[c][r]
      }

      formatted.push( row_val )
    }

    // console.log( formatted )
    return formatted
  }

}
