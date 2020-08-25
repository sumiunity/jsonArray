/**
 * Excel
 * ===================
 *
 * Development page for the excel to jsonArray pluggin
 *
 * @author Nik Sumikawa
 * @date Aug 25, 2020
 *
 */


import React from "react";

import jsonArray from 'jsonArray/jsonArray'

import {ExcelRenderer} from 'react-excel-renderer';
import Excel from 'jsonArray/frameworks/react/pluggins/Excel'

export default function ExcelComponentTest( props ){

  const json_array = new jsonArray()
  // const excel = new Excel()
  const excel = json_array.react.semanticUI.excel({callback: callback})

  // console.log( header)
  return (
    <div>
      <h2>Excel dev</h2>
      {excel.render()}


    </div>
  )

}

function callback( value ){
  console.log( 'callback function', value )
}
