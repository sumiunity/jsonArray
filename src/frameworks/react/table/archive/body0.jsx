/**
 * Table Compoents
 * ================
 * React components used to generate a table
 *
 */



import React from 'react';
import jsonArray from '../jsonArray'

// import React, {useState} from 'react';
// import cell from './cell'

// import { Table, Icon } from 'semantic-ui-react'




export default function tableBody( json_array ) {


  return( 'hello')

  // const body = []
  // for (var i=0; i < json_array.length; i++ ){
  //
  //     // if( json_array.accordian !== undefined ){
  //     //   body.push(
  //     //     <AccordianRow
  //     //       {...childProps}
  //     //       row={i}
  //     //       key={'body-' + i}
  //     //       />
  //     //   )
  //     //   continue
  //     // }
  //
  //     body.push(
  //       row( json_array, i)
  //     )
  // }

  return( 'hello')
  // return (
  //   __body__(
  //       json_table,
  //       body,
  //       `${json_table.tableName}-body`
  //       )
  //   )

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
    for (var i=0; i < json_table.columns.length; i++ ){
        row.push(
          cell(
            json_table,
            row_idx,
            json_table.columns[i]
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
    if( json_table.rowOnClick !== undefined ){
      rowOnClick = () => json_table.rowOnClick({
        row: row_idx,
        row_data: json_table[row_idx]
      })
    }

    return (
      __row__(
        json_table,
        row,
        `${json_table.tableName}-row--${row_idx}`,
        rowOnClick)
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



// returns the date as a string based on the provided format
function __row__(json_table, value, key, onClick){

  // return standard html json_table header html component when
  // a different cell type is not provided
  if( json_table.tr === undefined ){
    return(
      <tr
        key={key}
        style={{textAlign:'center'}}
        onClick={onClick}>
          {value}
      </tr>
    )
  }

  return (
    <json_table.tr
      key={key}
      style={{textAlign:'center'}}
      onClick={onClick}>
        {value}
    </json_table.tr>
    );

}

// returns the date as a string based on the provided format
function __body__(json_table, value, key, onClick){

  // return standard html json_table header html component when
  // a different cell type is not provided
  if( json_table.body === undefined ){
    return(
      <body
        key={key}
        style={{textAlign:'center'}}
        onClick={onClick}>
          {value}
      </body>
    )
  }

  return (
    <json_table.body
      key={key}
      style={{textAlign:'center'}}
      onClick={onClick}>
        {value}
    </json_table.body>
    );

}

//
// function rowOnClick( props ){
//   // wrapper function that's executed when a row is selected. The
//   // purpose is to track the selected row and highlight it for user feedback
//
//   // only update the selected row when selectable is enabled
//   if( props.selectable === true ){
//     props.setSelectedRow( props.row )
//   }
//
//   // when the table contains data, retrieve the data for the specified row
//   var data = []
//   if( props.table.data !== undefined ){
//     data = props.table.data[props.row]
//   }
//
//   if( props.table.rowOnClick !== undefined ){
//     // format for version 2 of onClick Functions
//     if( props.version === 2 ){
//       props.table.rowOnClick({
//         row: props.row,
//         row_data: data
//         })
//       return
//     }
//     // default format for the onClick Function
//     props.table.rowOnClick( props.row, data )
//   }
// }
