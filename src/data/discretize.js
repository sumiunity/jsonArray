/**
 * Discretize
 * ===========
 * Discretizes a given series for group learning and plotting
 *
 * :Author: Nik Sumikawa
 * :DAte: Nov 6, 2019
 */

export class Discretize{

  constructor( ser ){
    this.ser = ser
    this.min = ser.min()
    this.max = ser.max()
    this.range = this.max - this.min
  }

  apply( bins, ser ){

    if( ser === undefined ) ser = this.ser

    const index = ser.index
    const values = ser.values
    const step_size = this.range/bins

    var _index = {}
    var _count = {}

    for( var i=0; i < ser.count(); i++ ){
      const bin_num = Math.floor( (values[i]-this.min)/step_size )

      if( _count[bin_num] === undefined ){
        _count[bin_num] = 1
        _index[bin_num] = [index[i]]
      }else{
        _count[bin_num]++
        _index[bin_num].push( index[i] )
      }
    }


    return _count

  }

  // returns the label based on the partition group multiplied
  // by the stepsize. This gives the lower bound of the bin/bucket
  labels( bins ){

    const step_size = this.range/bins

    var labels = []
    for( var i=0; i < bins; i++ ){
      labels.push( i* step_size + this.min )
    }

    return labels
  }



}
