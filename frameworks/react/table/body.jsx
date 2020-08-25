/**
 * Table Compoents
 * ================
 * React components used to generate a table
 *
 */



import React from 'react';
import jsonArrayTable from './jsonArrayTable'
import cell from './cell'


import {Body, Row} from '../framework/Components'



export default function tableBody( json_table ) {

  if( !(json_table instanceof jsonArrayTable) ){
    json_table = new jsonArrayTable(json_table)
  }

  const body = []
  for (var i=0; i < json_table.data.length; i++ ){

      // if( json_table.accordian !== undefined ){
      //   body.push(
      //     <AccordianRow
      //       {...childProps}
      //       row={i}
      //       key={'body-' + i}
      //       />
      //   )
      //   continue
      // }

      body.push(
        row( json_table, i)
      )
  }

  return (
    <Body
      {...json_table.parameters.bodyProps}
      style={{...{textAlign:'center'}, ...json_table.parameters.bodyStyle}}
      Component={json_table.parameters.body}
      key={`${json_table.parameters.tableName}-body`}
      defaultValue={body}
      />
  )


}




function row( json_table, row_idx, params={} ) {

    // // extract the color definition when the index and color data is provided.
    // // Note that the colors will adhere to the same data structure as the data
    // // meaning the columns are the keys and the rows are referenced by the index
    // // attribute.
    // // The default is not custom coloring
    // var color = {}
    // if( (props.table.index !== undefined)&(props.table.color !== undefined) ){
    //   var row_id = props.table.data[props.row][props.table.index]
    //   color = props.table.color.filter(row => row[props.table.index] === row_id)
    //
    //   //format the color variable
    //   if( color.length > 0 ){
    //     color = color[0]
    //   }else{
    //     color = {}
    //   }
    // }

    const row = []
    for (var i=0; i < json_table.parameters.columns.length; i++ ){
        row.push(
          cell(
            json_table,
            row_idx,
            json_table.parameters.columns[i]
          )
        )
    }
    //
    // // When extract buttons are specified in the column types that do not have
    // // corresponding data in the data array, the table is extended to add buttons
    // // at the end of the table. The purpose is to allow for buttons that control
    // // some functionality based on the selected row
    // for( var col_name in props.table.col_type ){
    //
    //   if( (props.table.columns.includes(col_name) === false) &
    //       (props.table.col_type[col_name] === 'button') ){
    //     row.push(
    //       <Cell
    //         {...props}
    //         col_name={col_name}
    //         col_type={'Button'}
    //         col={props.col}
    //         key={`tr-button-${col_name+ i++}`  }
    //         /> )
    //   }
    // }

    // // when specified, return the cell data only. The purpose is to extend
    // // the cells for internal table components such as accordian rows
    // if( props.cellDataOnly === true ) return row


    // define the rowOnClick function to standardize the returned data
    var rowOnClick = null
    if( json_table.parameters.rowOnClick !== undefined ){
      rowOnClick = () => json_table.parameters.rowOnClick({
        row: row_idx,
        row_data: json_table.data[row_idx]
      })
    }

    return (
      <Row
        {...json_table.parameters.trProps}
        style={{...{textAlign:'center'}, ...json_table.parameters.trStyle}}
        Component={json_table.parameters.tr}
        key={`${json_table.parameters.tableName}-row--${row_idx}`}
        onClick={rowOnClick}
        defaultValue={row}
        />
    )
}


// // An accordian row unfolds when the carot icon is selected. It retracts
// // when the carot icon is selected again. The purpose is to allow for an
// // unfolding rows to show additional options
// function AccordianRow( props ){
//
//   const [visible, setVisible] = useState(false)
//
//
//   if( props.table.accordian === undefined ) return null
//
//
//   // when the content of the accordian data is less than the
//   // row number, post warning and return the data as a standard
//   // row
//   if( props.row >= props.table.accordian.length ){
//     console.log( 'WARN - accordian data not long enough', props.row, props.table.accordian.length )
//     return <TableBodyRow {...props} />
//   }
//
//   // select an icon based on the visible flag
//   var icon = <Icon name='caret up' />
//   if( visible === true ) icon = <Icon name='caret down' />
//
//   // extract the number of columns for the specified row
//   const columns = Object.keys(props.table.data[props.row]).length
//
//   return (
//     <>
//       <Table.Row>
//         <Table.Cell
//           style={{width:'50px'}}
//           onClick={() => setVisible(!visible)}
//           >
//           {icon}
//         </Table.Cell>
//
//         <TableBodyRow
//           cellDataOnly={true}
//           {...props}
//           />
//
//       </Table.Row>
//
//       { visible ?
//         <Table.Row>
//           <Table.Cell colSpan={columns} style={{padding:'0'}}>
//             {props.table.accordian[props.row]}
//           </Table.Cell>
//         </Table.Row>
//         : null
//       }
//
//     </>
//   )
//
// }
