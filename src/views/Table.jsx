import React from 'react';

import {Grid} from 'semantic-ui-react'

import jsonArray from 'jsonArray/jsonArray'
import {data, array} from 'jsonArray/tests/data'


export default function Table( props ){


  var json_array = new jsonArray( data )
  json_array = json_array.astype({image: 'image', VALUE:'percentage'})
  // json_array = json_array.astype({VALUE:'float'})

  var json_array2 = new jsonArray( array )

  // console.log( json_array )
  // console.log( json_array.dtypes)

  // const table = json_array.react.semanticUI.table
  // table.parameters.sortable = true
  // table.parameters.button = {TYPE: console.log('test')}
  // table.parameters.rowOnClick = (value) => console.log('row was selected', value )
  // {table.render()}
  // console.log( header)

  console.log( json_array.dtypes)


  return (

    <Grid>
      <h2>Table</h2>
      <Grid.Row>
        <Grid.Column>
          <json_array.react.semanticUI.Table
            tableName = {'data'}
            sortable={false}
            />
        </Grid.Column>
      </Grid.Row>

      <Grid.Row>
        <Grid.Column>
            <json_array2.react.semanticUI.Table
              tableName = {'array'}
              sortable={true}
              />
        </Grid.Column>
      </Grid.Row>


    </Grid>
  )

}

// <TableComponent
//   json_array={json_array}
//   sortable={true}
//   />
