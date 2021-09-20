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

import toColumn from '../../utilities/ColGroupsToCol'
import { Table as SemanticTable } from 'semantic-ui-react'

// import {Header} from '../../../framework/Components'
import ColumnRow from '../SingleRow/ColumnRow'
import CategoryRow from './CategoryRow'

export default function MultiRowHeader( props ) {

  const columns = toColumn(props.columnGroups, true)

  return (
      <SemanticTable.Header>
        <CategoryRow
          key={`${props.tableName}-CombinedRow1`}
          {...props}
          />

        <ColumnRow
          key={`${props.tableName}-CombinedRow2`}
          {...props}
          columns = {columns}
          />
      </SemanticTable.Header>

    );

}
