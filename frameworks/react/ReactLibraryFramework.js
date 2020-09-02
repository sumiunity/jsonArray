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

  constructor(data){
    // cast the data to a json_array data type
    this.data = data
  }

  props( props ){
    return {
      ...props,
      ...{
        data: this.data
      }}
  }

}
