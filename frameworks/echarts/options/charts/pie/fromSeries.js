

import pie from '../../../series/pie/fromSeries'


export default function pieFromSeries( json_array, props={} ){

  // check to ensure the minimum set of parameters are available
  if( (props.col === undefined)){
    alert( 'pie plot required att : col ')
  }

  var option = {
    series : pie( {...props, ...{json_array: json_array}} ),
  }

  if( props.name !== undefined ){
    option['tooltip'] = {trigger: 'item'}
  }

  return option

}
