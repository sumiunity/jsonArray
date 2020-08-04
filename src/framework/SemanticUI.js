/**
 * Semantic UI Framework
 * =======================
 *
 * Extends the jsonArray functionality to include specific
 * functions for formatting semantic UI components
 *
 * :Author: Nik Sumikawa
 * :Date: Aug 4, 2020
 */


import jsonArray from '../jsonArray'


const debug = false

export default function jsonSemanticUI( value ) {
  var self = new jsonArray( value );

  self.__proto__ = jsonSemanticUI.prototype;

  return self;
}

jsonSemanticUI.prototype.__proto__ = jsonArray.prototype;

// returns the date as a string based on the provided format
jsonSemanticUI.prototype.dropdown = function(col, ascending=true){

  // retrieve the unique calues from the specified column
  const values = this.unique( col, ascending )

  var dropdown = []

  // push the values into the array formatted for the dropdown menu
  values.forEach( element => dropdown.push({
     key:  element, text: element, value: element
  }) )

  return dropdown
}
