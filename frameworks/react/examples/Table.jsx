import React from 'react';

import {Grid} from 'semantic-ui-react'

import {FixedDocument} from './CodeDocumentation'
import jsonArray from '../../../jsonArray'
import {data} from '../../../tests/data'


export default function Table( props ){


  var json_array = new jsonArray( data )
  json_array = json_array.astype({image: 'image', VALUE:'percentage'})


  return (

    <Grid style={{padding: '0 30px 0 30px'}}>
      <Grid.Row>
        <Grid.Column>

          <FixedDocument
            visible={false}
            title={'Standard Table'}
            code={`
              var json_array = new jsonArray( data )
              json_array = json_array.astype({image: 'image', VALUE:'percentage'})

              return (
                <json_array.react.semanticUI.Table
                  tableName = {'data'}
                  sortable={true}
                  />
              )
              `}
              component={
                <json_array.react.semanticUI.Table
                  tableName = {'data'}
                  sortable={true}
                  />
              }
            />

        </Grid.Column>
      </Grid.Row>

      <Grid.Row>
        <Grid.Column>

          <FixedDocument
            title={'Lazy Loading Table'}
            code={`
              var json_array = new jsonArray( data )
              json_array = json_array.astype({image: 'image', VALUE:'percentage'})

              return (
                <json_array.react.semanticUI.Table
                  tableName = {'data'}
                  lazyLoading = {true}
                  lazyLoadingStart = {5}
                  lazyLoadingStep = {5}
                  sortable={true}
                  />
              )
              `}
              component={
                <json_array.react.semanticUI.Table
                  tableName = {'data'}
                  sortable={true}
                  lazyLoading = {true}
                  lazyLoadingStart = {5}
                  lazyLoadingStep = {5}
                  />
              }
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
