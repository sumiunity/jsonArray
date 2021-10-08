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


export default class ReactLibraryFramework{

  constructor(data, props={}){
    // cast the data to a json_array data type
    this.data = data
    this.props = props
  }

  format_props( props ){
    return {
      ...props,
      ...this.props,
      ...{
        data: this.data
      }}
  }

}
