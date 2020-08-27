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

  return (
    <div>
      <h2>Excel dev</h2>
      <json_array.react.semanticUI.Excel
        callback = {(value) => console.log( 'parent callback', value )}
      />
    
    </div>
  )

}

function callback( value ){
  console.log( 'callback function', value )
}
