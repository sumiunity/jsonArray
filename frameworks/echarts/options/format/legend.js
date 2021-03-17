
export default function legend( position ){

  switch( position ){

    case 'top-center':
      return {
        top: '5%',
        left: 'center'
      }

    case 'left':
      return {
        type: 'scroll',
        orient: 'vertical',
        left: 10,
        top: 20,
        bottom: 20,
      }

    case 'right':
      return {
        type: 'scroll',
        orient: 'vertical',
        right: 10,
        top: 20,
        bottom: 20,
      }

    default:
      return {
        top: '5%',
        left: 'center'
      }
  }

}
