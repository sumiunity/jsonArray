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

import {Header} from '../../../framework/Components'
import ColumnRow from './ColumnRow'

export default function DataFrameHeader( props ) {

  // define the header row
  const headerrow = <ColumnRow {...props} />

  return (
      <Header
        {...props.theadProps}
        style={{...{textAlign:'center'}, ...props.theadStyle}}
        component={props.thead}
        defaultValue={headerrow}
        key = {`${props.tableName}-thead`}
        />
    );

}
