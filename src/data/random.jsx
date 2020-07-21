/**
 * Generates random variables simiar to python random
 *
 * @param  {[type]} max [description]
 * @return {[type]}     [description]
 */


export function integer(max) {
  return Math.floor(Math.random() * Math.floor(max));
}

// returns a gaussian random function with the given mean and stdev.
export function gaussian(mean, stdev) {
    var y1;
    var y2;
    var use_last = false;
    if(use_last) {
       y1 = y2;
       use_last = false;
    }
    else {
        var x1, x2, w;
        do {
             x1 = 2.0 * Math.random() - 1.0;
             x2 = 2.0 * Math.random() - 1.0;
             w  = x1 * x1 + x2 * x2;
        } while( w >= 1.0);
        w = Math.sqrt((-2.0 * Math.log(w))/w);
        y1 = x1 * w;
        y2 = x2 * w;
        use_last = true;
   }

   var retval = mean + stdev * y1;


   if(retval > 0)
       return retval;
   return -retval;

}

/**
 * returns n randomly sampled elements from the Array
 * @param  {array} arr Array of data
 * @param  {int} n   number of elements to sample from array
 * @return {array}   n randomly sampled elements from the array
 */
export function random_array(arr, n) {
    var result = new Array(n),
        len = arr.length,
        taken = new Array(len);
    if (n > len)
        throw new RangeError("getRandom: more elements taken than available");
    while (n--) {
        var x = Math.floor(Math.random() * len);
        result[n] = arr[x in taken ? taken[x] : x];
        taken[x] = --len in taken ? taken[len] : len;
    }
    return result;
}
