/**
 * Table Column Framework
 * =======================
 *
 * Add functionality to the base table driver to allow for
 * column header generation
 *
 *  @author Nik Sumikawa
 *  @date Aug 4, 2020
 */



import React from 'react';

import SingleRow from './SingleRow'
import MultiRow from './MultiRow'
// import TableRow from './Row'

export default function DataFrameHeader( props ) {

  // do not render header when visible is turned off
  if( props.showHeader === false ) return null


  if( props.columnGroups !== undefined ) return <MultiRow {...props}/>

  // // return the standard single row
  return <SingleRow {...props}/>

}
