
import Hline from '../../features/Hline'

export default function HorizontalLines( props, Series ){

  var data = []
  for( let i=0; i < props.json_array.length-1; i++ ){
    // const index = props.json_array[i][props.colx]
    // const min = props.json_array[i][props.coly]
    const y_val = props.json_array[i+1][props.coly]
    data.push([y_val, i, i+1])
  }

  Series = Series.concat(
   Hline({
     data: data,
     color: 'black',
     border: 'black',

   })
 )

 return Series

}
