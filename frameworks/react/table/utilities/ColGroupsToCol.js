
/// convert the column group object to an array of columns
export default function toColumns(columnGroups, header=false){

  var columns = Object.values(columnGroups)

  /// remove the string values (these will be merged across header rows)
  if( header === true ) columns = columns.filter(r => typeof r !== 'string' )

  // flatten the arrays into a single array
  return columns.flat()
}
