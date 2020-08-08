/**
 * Table Compoents
 * ================
 * React components used to generate a table
*
 * Description
 * -----------
 *
 * Inut Description
 * ----------------
 * @param {dictionary} table single dictionary containing all information required to render the table
 *
 * keys
 * ----
 * @param {list} index list containing the table index values
 * @param {list} columns list containing the column names (table header)
 * @param {array} data array (list of lists) containing the table contents referenced by row then col
 * @param {dictionary} col_type specifies the column type (text, button, etc.). The dictionary
 *                              key corresponds to the column name and the value signals the column
 *                              type. Defaults to text type
 * @param {dicitonary} onClick specifies onClick functions to be exectued. The dictionary
 *                              key corresponds to the column name and the value corresponds to
 *                              the onClick function. The onClick funcion will always have the
 *                              row and column number as parameters so the onClick function knows
 *                              what cell triggered the event. Defaults to no onClick function.
 * @param {dicitonary} icon when provided, the value is assumed to be of icon type. The contents
 *                          of the cell are replaced by the specified icon.  The dictionary
 *                          key corresponds to the column name and the value corresponds to
 *                          the icon string
 *
 *
 * note
 * ----
 * In python, a DataFrame can be converted into the proper table format using ReactTable class
 * in common.web.react.table
 */

import React, {useState} from 'react';

import { Table as SemanticTable} from 'semantic-ui-react'

import { TableBody } from "components/Table/Body";
import { TableHeader } from "components/Table/Header";






/**
 * Plan table with no added features. The purpose is to have a light weight
 * table where the data isn't store in the state. This comes at the sacrifice
 * of efficiency
 * @param       {Boolean} attached [description]
 * @param       {Boolean} celled when true, the table cells will be outlined
 * @param       {Boolean} basic when True, the table will have a basic layout
 * @param       {Boolean} selectable when true, the selected rows will be highlighted
 * @constructor
 */

 export class Table extends React.Component {

   constructor(props) {
     super(props);

     this.state = {
       ascending: props.ascending === undefined ? true : props.ascending ,
       sortBy: props.sortBy,
       selectedRow: props.selectedRow,
     }

   }

   /**
    * Sort the table based on the table values. When the same column is selected
    * twice, the order is reveresed from ascending to descending order.
    * @param  {[type]} col [description]
    * @return {[type]}     [description]
    */
   order_table( col ){

     // do not order the table when not specified by the parameters
     if( this.props.sortable !== true ) return

     var column_name = this.props.table.columns[col]

     //only allow for decending order when the previous state was assending
     //and the column selected is the same
     var ascending = true
     if( (this.state.sortBy === column_name)&(this.state.ascending === true) ){
       ascending = false
     }

     // store the sort order and the column name
     this.setState( {ascending: ascending, sortBy: column_name })

   }

   /**
    * Sort the table based on the selected column and the order
    * @param  {objects} table Object containing the table data structure
    * @return {object }       Table data structure
    */
   sort_data( table ){

     if( this.state.sortBy === undefined ) return table

     //sort the table based on the ascending flag
     if( this.state.ascending === true ){
       table.data = table.data.sort((a, b) => a[this.state.sortBy] > b[this.state.sortBy] ? 1 : -1 )

     }else{
       table.data = table.data.sort((a, b) => a[this.state.sortBy] < b[this.state.sortBy] ? 1 : -1 )
     }

     return table

   }

   setSelectedRow( row ){ this.setState({selectedRow: row})}

   render() {

     // return empty component when no table is provided
     if( (this.props.table === undefined)|(this.props.table === null) ) return null

     // //use the data keys as columns when non are provided
     var table = fill_columns( this.props.table )


     table = this.sort_data( table )

     return (
       <SemanticTable
         attached = {this.props.attached}
         celled = {this.props.celled}
         selectable = {this.props.selectable}
         basic = {this.props.basic}
         >
         <TableHeader
           table={table}
           showHeader={this.props.showHeader}
           onClick={this.order_table.bind(this)}/>

         <TableBody
           table={table}
           selectable = {this.props.selectable}
           selectedRow={this.state.selectedRow}
           setSelectedRow={this.setSelectedRow.bind(this)}
           version = {2}
           />
       </SemanticTable>);

   }

 }




/***********************************************************************************
  DEPRECATED FUNCTIONS. Migrated into Table funcion above
***********************************************************************************/


export default class SortableTableAPI extends React.Component {

  constructor(props) {
    super(props);

    this.state = {
      ascending: props.ascending === undefined ? true : props.ascending ,
      sortBy: props.sortBy,
      selectedRow: props.selectedRow,
    }

  }

  /**
   * Sort the table based on the table values. When the same column is selected
   * twice, the order is reveresed from ascending to descending order.
   * @param  {[type]} col [description]
   * @return {[type]}     [description]
   */
  order_table( col ){

    var column_name = this.props.table.columns[col]


    //only allow for decending order when the previous state was assending
    //and the column selected is the same
    var ascending = true
    if( (this.state.sortBy === column_name)&(this.state.ascending === true) ){
      ascending = false
    }

    // store the sort order and the column name
    this.setState( {ascending: ascending, sortBy: column_name })

  }

  /**
   * Sort the table based on the selected column and the order
   * @param  {objects} table Object containing the table data structure
   * @return {object }       Table data structure
   */
  sort_data( table ){

    if( this.state.sortBy === undefined ) return table

    //sort the table based on the ascending flag
    if( this.state.ascending === true ){
      table.data = table.data.sort((a, b) => a[this.state.sortBy] > b[this.state.sortBy] ? 1 : -1 )

    }else{
      table.data = table.data.sort((a, b) => a[this.state.sortBy] < b[this.state.sortBy] ? 1 : -1 )
    }

    return table

  }

  setSelectedRow( row ){ this.setState({selectedRow: row})}

  render() {

    // return empty component when no table is provided
    if( (this.props.table === undefined)|(this.props.table === null) ) return null

    // //use the data keys as columns when non are provided
    var table = fill_columns( this.props.table )


    table = this.sort_data( table )

    return (
      <SemanticTable
        attached = {this.props.attached}
        celled = {this.props.celled}
        selectable = {this.props.selectable}
        basic = {this.props.basic}
        >
        <TableHeader
          table={table}
          onClick={this.order_table.bind(this)}/>
        <TableBody
          table={table}
          selectable = {this.props.selectable}
          selectedRow={this.state.selectedRow}
          setSelectedRow={this.setSelectedRow.bind(this)}
          />
      </SemanticTable>);

  }

}

/**
 * Plan table with no added features. The purpose is to have a light weight
 * table where the data isn't store in the state. This comes at the sacrifice
 * of efficiency
 * @param       {Boolean} attached [description]
 * @param       {Boolean} celled when true, the table cells will be outlined
 * @param       {Boolean} basic when True, the table will have a basic layout
 * @param       {Boolean} selectable when true, the selected rows will be highlighted
 * @constructor
 */
export function TableAPI( props ){

  // console.log( 'rendering TABLEAPU')
  const [selectedRow, setSelectedRow] = useState(props.selectedRow)

  if( (props.table === undefined)|(props.table === null) ) return null


  // remove the wafer struct from the current props
  const childProps = { ...props };
  delete childProps.table;

  var table = fill_columns(props.table)

  return (
    <SemanticTable
      attached = {props.attached}
      celled = {props.celled}
      basic = {props.basic}
      selectable = {props.selectable}
       >

      <TableHeader
        showHeader={props.showHeader}
        table={table}
        />

      <TableBody
        {...childProps}
        table={table}
        selectedRow={selectedRow}
        setSelectedRow={setSelectedRow}
        />
    </SemanticTable>
  );
}


/**
 * Populate the columns when none are specified
 * @param  {[type]} table [description]
 * @return {[type]}       [description]
 */
function fill_columns( table ){

  if( (table === undefined)|(table === null) ) return table

  if( table.columns === undefined ){
    table['columns'] = Object.keys(table.data[0])
  }else{
    if( table.columns.length === 0 ){
      table['columns'] = Object.keys(table.data[0])
    }
  }

  return table
}
