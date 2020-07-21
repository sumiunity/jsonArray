
import { jStat } from  'jstat'

export class Anova{

  constructor( ...args ){

    // buffer to hold the DataFrame partitioned by group
    this.groups = []
    this.columns = []

    // parse the DataFrame when a list and DataFrame are provided
    if( Array.isArray(arguments[0]) ){
      this.parse_from_DataFrame( ...args )
      return
    }


  }

  /**
   * Parse the classes from array of index lists
   * @param {Array} index Array of index list. one list for each groups
   * @param {DataFrame} df    DataFrame object
   */
  parse_from_DataFrame( index, df ){

    // extract a list of column names from the DataFrame
    this.columns = df.columns
    for( var i=0; i < index.length; i++ ){
      this.groups.push( df.ix(index[i]) )
    }
  }

  /**
   * Check to ensure the DataFrames are the same. If so, add them to the
   * group array for comparison
   * @param  {array} args Array of arguments
   * @return {[type]}      [description]
   */
  from_DataFrame_collection( ...args ){

    console.log( 'THIS IS NOT IMPLEMENTED YET')
    // push the dataframe sinto the buffer when of DataFrame type
    for( var i=0; i<arguments.length; i++ ){
      if( arguments[i].dfType === 'DataFrame' ){
        this.groups.push( arguments[i] )
      }
    }
  }

  /**
   * performs anova on all columns in the dataset
   * @return {object} Object containing the Fscore for each column
   */
  anova(){

    var fscore={}

    // compute the fscore for each column in the dataset
    for( var i=0; i<this.columns.length; i++ ){
      fscore[this.columns[i]] = this.anova_column( this.columns[i] )
    }

    return fscore
  }
  /**
   * Performs anova on a single column
   * @param  {string} column Column name
   * @return {float}        Fscore computed by the anova
   */
  anova_column( column ){

    var data = []
    for( var i=0; i<this.groups.length; i++ ){
      data.push( this.groups[i].series(column).values )
    }

    return jStat.anovafscore( data )
  }

}
