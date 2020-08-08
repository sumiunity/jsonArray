/**
 * Data TAble
 * ==============
 * Routines for managing data tables. This includes mapping objects
 * that contain partial data (missing values), into a complete table
 * where the missing values are filled
 *
 * :Author: Nik Sumikawa
 * :Date: Oct 10, 2019
 */




export class DataTable{
  constructor(object_list) {
    this.object_list = object_list;
  }


  /**
   * returns a list of unique column names
   * @return {col} list of unique column names
   */
  columns(){
    var col = new Set([]);
    for( var i=0; i < this.object_list.length; i++ ){
      var col_array = new Set(Object.keys( this.object_list[i] ));
      col = new Set([...col, ...col_array])
    }

    this.columns = col

    return this.columns
  }

  // sets the index column. When none is provided, an index column
  // will be created
  set_index( col ){
    this.index = col

    return this.index
  }

  // create an index column. When no index attribute is provided, a
  // default column is created and used
  create_index_col( index ){

    //create an index column with numbers in chronological order
    if( index === undefined ){
      this.set_index( 'index' )

      this.index_col = []
      for( var i=0; i < this.object_list.length; i++ ){
        this.index_col.push( i )
      }

      return this.index_col
    }

    //set the index based on what is provided
    this.set_index( index )

    //select all values in the row for the given index
    this.index_col = this.col_values( index );

    //remove the index from the set of column names
    var index_set = new Set([index])
    this.columns = [...this.columns].filter(x => !index_set.has(x) );

    return this.columns
  }


  /**
   * Return the values for the specified column and fill in undefined
   * values. Default to filling with 0
   * @param  {String} col        column name
   * @param  {Number} [fillna=0] all missing values will be replaces with this value
   * @return {Array}            array of data based on the specified column
   */
  col_values( col, fillna=0 ){

    //extract the data for the specified column
    var col_data = this.object_list.map( df => df[col])

    // map the missing values
    col_data = col_data.map(function(num, index) {
      if (isNaN(num) || num === null || num === '') return fillna;
      return num
    })

    return col_data
  }

  /**
   * Creates a Data table where there exists data for each column and row.
   * An index column is created to enable merging with other data Table.
   * Note: merge/join is not IMPLEMENTED
   * @param  {String}  index            Index column names
   * @param  {Number}  [fillna=0]       variable used to fill missing values
   * @param  {Boolean} [formatted=true] when True, the data table will be formatted
 *                                      where each row is an object in the aray
   * @return {array or object}          data table
   */
  create( index, fillna=0, formatted=true ){

    //extract the list of unique column names
    this.columns()

    //defined the index column and extract the data into a list
    this.create_index_col( index );

    //create the data table and seed with the index column
    var data_table = {}
    data_table[this.index] = this.index_col

    // create an object where each column is a key and the contents
    // of the table are stored as lists
    for( var i=0; i < this.columns.length; i++ ){
      data_table[this.columns[i]] = this.col_values(this.columns[i])
    }

    if( formatted === true ){
      data_table = this.format(data_table)
    }

    return data_table
  }

  /**
   * Converts an object where each column is a key and the table contents
   * are stored as lists into an array of objects, where each object
   * represents the contents for a single ro
   * @param  {objects} data_table object containing the contents of the data table
   * @return {Array}            array of objects where each array item is a data table row
   */
  format( data_table ){

    //extract a list of column names based on the provided data
    var columns = Object.keys( data_table )

    var table_array = []

    //convert the data table format to an array of objects. i.e. one object per row.
    for( var row=0; row< data_table[columns[0]].length; row++ ){
      var row_obj = {}
      for( var col=0; col < columns.length; col++ ){
        row_obj[columns[col]] = data_table[columns[col]][row]
      }

      //push the row object into the tabll array
      table_array.push( row_obj )
    }

    return table_array

  }

}
