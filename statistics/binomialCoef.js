// Returns the binomial coefficient
// where a is the total set of posibbilites
// and b is the number of combinatios we're interested in

export function binomialCoef(a, b) {
  var numerator = fact(a);
  var denominator = fact(a-b) *  fact(b);
  return numerator / denominator;
}

// Factorial function.
export function fact(x) {
  var total = 1
  for( var i=x; i > 0; i-- ){
    total = total * i
  }
  return total
   // if(x==0) return 1;
   // return x * fact(x-1);
}
