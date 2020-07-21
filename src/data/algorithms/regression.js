

// import { jStat } from  'jstat'

export class Regression{

  constructor(){
    this.m = undefined
    this.b = undefined

  }

  get slope(){ return this.m }
  get offset(){ return this.b }

  fit( values_x, values_y ){
  /*
   * We'll use those variables for faster read/write access.
   */

   console.log( values_x)
   var sum_x = 0;
   var sum_y = 0;
   var sum_xy = 0;
   var sum_xx = 0;
   var count = 0;

    var x = 0;
    var y = 0;
    var values_length = values_x.length;

    if (values_length !== values_y.length) {
        throw new Error('The parameters values_x and values_y need to have same size!');
    }

    /*
     * Nothing to do.
     */
    if (values_length === 0) {
        return [ [], [] ];
    }

    /*
     * Calculate the sum for each of the parts necessary.
     */
    for (var v=0; v<values_length; v++) {
        x = values_x[v];
        y = values_y[v];
        sum_x += x;
        sum_y += y;
        sum_xx += x*x;
        sum_xy += x*y;
        count++;
    }

    /*
     * Calculate m and b for the formular:
     * y = x * m + b
     */
    this.m = (count*sum_xy - sum_x*sum_y) / (count*sum_xx - sum_x*sum_x);
    this.b = (sum_y/count) - (this.m*sum_x)/count;
  }

  /**
   * predicts the y value based on the provided x value
   * @param  {array} values_x array of values
   * @param  {boolean} pair when true, the input and predicted value are returned as a pair
   * @return {array}          array of values predicted based on the input
   */
  predict( values_x, pair=false ){

    var prediction = []
    for (var v = 0; v<values_x.length; v++) {
        var pred = values_x[v] * this.m + this.b;

        if( pair ){
          prediction.push( [values_x[v], pred] )
        }else{ prediction.push(pred) }
    }

    return prediction;
  }



}
