/**
 * Uses Box-Muller transform to produce a random number on a normalized curve.
 */
function random_bm() {
  var u = 0,
    v = 0;
  while (u === 0) u = Math.random();
  while (v === 0) v = Math.random();
  return Math.sqrt(-2.0 * Math.log(u)) * Math.cos(2.0 * Math.PI * v);
}

/**
 * Returns true or false at a ratio of 1/x.
 */
function random_denominator(denominator) {
  return Math.random() < 1 / denominator;
}

module.exports = {
  random_bm,
  random_denominator
};
