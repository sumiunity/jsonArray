/**
 * Table Body
 * ================
 *
 * React components used to generate the Table Body
 *
 *  @author Nik Sumikawa
 *  @date Aug 27, 2020
 */




import Row from './Row'


export default function MultiRow( props ) {

  const modProps = rowSpan(props)

  var MultiRow = [Row(modProps)]

  for( var i=0; i < props.multirow.length; i++ ){
    const columns = props.multirow[i]

    MultiRow.push(
      Row({
        ...props,
        ...{
          columns: columns,
          multirow_idx: i,
          col_span: colSpan(props, columns),
          tdStyle: {textAlign: 'left'}
        }
      })
    )

  }

  return MultiRow
}


function colSpan( props, columns ){

  var span_len = props.columns.length
  if( props.multirowSpan !== undefined ) span_len = span_len - props.multirowSpan.length

  // compute the lower bound on column span width
  const span = Math.ceil(span_len/columns.length)

  var colSpan = {}
  for( var i=0; i < columns.length; i++ ){
    colSpan[columns[i]] = span

    // shrink the last column when span does not align properly
    if(  (columns.length - i*span) < 0 ){
      colSpan[columns[i]] = columns.length - (i-1)*span
    }
  }

  return colSpan

}

function rowSpan( props ){

  var modProps = {...props, ...{}}


  if( props.multirowSpan !== undefined ){

    // const multiRowCol = [...new Set(props.multirowSpan.filter(x => props.columns.includes(x)))]
    // const colDiff = [...new Set(props.multirowSpan.filter(x => !props.columns.includes(x)))]
    //
    // modProps.columns = multiRowCol.concat(colDiff)

    modProps['row_span'] = {}
    props.multirowSpan.map(r => modProps['row_span'][r] = props.multirow.length + 1 )
  }

  return modProps

}
