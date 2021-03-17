

import moment from 'moment'
import pie from '../../../series/pie'


export default function pieChart( json_array, props={} ){

  // check to ensure the minimum set of parameters are available
  if( (props.value === undefined)){
    alert( 'pie plot required att : value ')
  }

  var option = {
    series : pie( {...props, ...{json_array: json_array}} ),
  }

  if( props.label !== undefined ){
    option['tooltip'] = {trigger: 'item'}
  }

  return option

}
