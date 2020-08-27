import React from 'react';

import jsonArray from 'jsonArray/jsonArray'
import {data} from 'jsonArray/tests/data'

import {Table as TableComponent} from 'jsonArray/frameworks/react/table/Table'
import TableHeader from 'jsonArray/frameworks/react/table/header'

export default function Table( props ){


  var json_array = new jsonArray( data )

  json_array = json_array.astype({image: 'image'})

  // console.log( json_array )
  // console.log( json_array.dtypes)
  //
  // const table = json_array.react.semanticUI.table
  // table.parameters.sortable = true
  // table.parameters.button = {TYPE: console.log('test')}
  // table.parameters.rowOnClick = (value) => console.log('row was selected', value )
  // {table.render()}
  // console.log( header)

  console.log( json_array.react.table)
  return (
    <div>
      <h2>What is this?? --- </h2>
      <json_array.react.semanticUI.Table
        sortable={false}
        />
    </div>
  )

}

// <TableComponent
//   json_array={json_array}
//   sortable={true}
//   />
