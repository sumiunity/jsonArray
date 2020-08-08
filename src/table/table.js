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
import React from 'react';

import tableHeader from './header'

const debug = false

export default function jsonArrayTable( value ) {
  var self = new jsonArray( value );

  self.__proto__ = jsonArrayTable.prototype;

  self.tableName = 'table'
  self.showHeader = true
  self.columnOnClick = {}
  // self.headerComponent = (<th>)
  // self.th = <th>

  return self;
}

jsonArrayTable.prototype.__proto__ = jsonArray.prototype;

// returns the date as a string based on the provided format
jsonArrayTable.prototype.table = function(){

  console.log( tableHeader( this ) )

  return (
    'hello'
    );

}
