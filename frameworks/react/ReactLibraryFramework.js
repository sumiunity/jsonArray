/**
 * React Library Framework
 * =========================
 *
 * Class used to store a global copy of the json array so it
 * can be automatically included as a prop into the desired
 * react component. This Framework is intended to be extended
 * upon for each component library
 *
 * @author Nik Sumikawa
 * @date Aug 28, 2020
 *
 */


import jsonArray from '../../jsonArray'

export default class ReactLibraryFramework{

  constructor(json_array){

    // cast the data to a json_array data type
    this.json_array = json_array
    if( !(json_array instanceof jsonArray) ){
      this.json_array  = new jsonArray(json_array)
    }
  }

  props( props ){
    return {
      ...props,
      ...{
        json_array: this.json_array
      }}
  }

}
