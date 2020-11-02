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


import React, {useState} from "react";

import {Grid} from 'semantic-ui-react'
import jsonArray from '../../../jsonArray'

import {FixedDocument} from './CodeDocumentation'

export default function Excel( props ){

  const [xlsx, setXlsx] = useState([])

  const json_array = new jsonArray()
  const xlsx_array = new jsonArray(xlsx)

  return (
    <Grid style={{padding: '0 30px 0 30px'}}>
      <Grid.Row>
        <Grid.Column>

          <FixedDocument
            visible={true}
            title={'Excel Import'}
            code={`

              const [xlsx, setXlsx] = useState([])

              var json_array = new jsonArray( data )
              const xlsx_array = new jsonArray(xlsx)


              return (
                <div>
                  <json_array.react.semanticUI.Excel
                    callback = {(value) => setXlsx( value )}
                    />
                  <xlsx_array.react.semanticUI.Table
                    tableName = {'data'}
                    sortable={true}
                    />
                </div>
              )
              `}
              component={
                <div>
                  <json_array.react.semanticUI.Excel
                    callback = {(value) => setXlsx( value )}
                    />
                  <xlsx_array.react.semanticUI.Table
                    tableName = {'data'}
                    sortable={true}
                    />
                </div>
              }
            />

        </Grid.Column>
      </Grid.Row>
    </Grid>

  )

}
