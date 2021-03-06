/* @flow */

var _skewness = require( 'compute-skewness' );
var _kurtosis = require( 'compute-kurtosis' );

/**
 * Returns an array with the times of each arrival in a [Poisson Process](http://en.wikipedia.org/wiki/Poisson_process) with rate `lambda` until time `T`.
 *
 * ![poissP](out/poissP.png)
 *
 * *Exercise*: Assuming you get 10 emails per hour over the course of an 8 hour day,
 * what's the distribution of the number of emails you receive
 * over the course of a standard 261 work-day year
 *
 * ![poissP-emails](out/poissP-emails.png)
 *
 * @example const poissP = stochastic.poissP(1, 100, true);
 * @example const emails = stochastic.hist(Array(261).fill().map(e => stochastic.poissP(10, 8, true).length));
 * @param {number} lambda (rate)
 * @param {number} T time as positive number
 * @param {boolean} [path=true]
 * @returns {number[]} times of each arrival in a Poisson Process
 */
export function poissP(
  lambda = 0/*: number */,
  T = 0/*: number */,
  path = true/*: boolean */) /*: Array<number> */ {
  let U, exp, N_t, t, n;
  N_t = [0];
  t = 0;
  n = 0;

  if (T <= 0 || lambda <= 0) {
    return N_t;
  }

  // https://www.probabilitycourse.com/chapter11/11_1_2_basic_concepts_of_the_poisson_process.php
  while (t < T) {
    U = Math.random();
    exp = -Math.log(U) / lambda;
    t += exp;
    if (t < T) {
      n += 1;
      N_t.push(t);
    }
  }

  if (path === false) {
    return [n];
  } else {
    return N_t;
  }
}

/**
 * Returns the average.
 *
 * @example const avg = stochastic.average([1, 2, 3]);
 * @param {number[]} values
 * @returns {number} average
 */
export function average(data /*: Array<number> */) {
  let sum = data
      .reduce((curr, acc) => {
        return acc + curr;
      }, 0);
  return sum / data.length;
}


/**
 * Returns the mode.
 *
 * @example const mode = stochastic.mode([1, 2, 3]);
 * @param {number[]} values
 * @returns {number} mode
 */
export function mode(data /*: Array<number> */) {
  return data.reduce((p, c) => {
        var val = p.numMapping[c] = (p.numMapping[c] || 0) + 1;
        if (val > p.greatestFreq) {
            p.greatestFreq = val;
            p.mode = c;
        }
        return p;
    }, {mode: null, greatestFreq: -Infinity, numMapping: {}}).mode;
}


/**
 * Returns the standard deviation.
 *
 * @example const std = stochastic.std([2, 3, 4, 4, 4, 5, 6]);
 * @param {number[]} values
 * @returns {number} standard deviation as positive number
 */
export function std(values /*: Array<number> */) {
  const avg = average(values);

  const squareDiffs = values.map(function(value){
    var diff = value - avg;
    var sqrDiff = diff * diff;
    return sqrDiff;
  });

  const avgSquareDiff = average(squareDiffs);

  return Math.sqrt(avgSquareDiff);
}


/**
 * Provides a summary of a set of data.
 *
 * @example const summary = stochastic.summary([1, 2, 3]);
 * @param {number[]} values
 * @returns {object} R-like summary of values
 */
export function summary(values /*: Array<number> */) {
  if (values.length === 0) {
    return {};
  }
  const sorted = values.sort((a, b) => a - b);

  const min = sorted[0];
  const max = sorted[values.length - 1];
  const range = [min, max];

  const sum = values.reduce((p, c) => { return p + c; }, 0);
  const stdev = std(values);
  const median = (function(values) {
    if (values.length % 2 === 1) {
      return sorted [(values.length - 1) / 2];
    } else {
      return (sorted[values.length / 2 - 1] + sorted[values.length / 2]) / 2;
    }
  }(values));
  const mean = average(values);
  // const std = std(values);
  const quantile = (function(values) {
    let result = [25, 50, 75].reduce((p, c) => {
      p[c] = c;
      return p;
    }, {});
    return result;
  }(sorted));

  const skewness = _skewness(values);
  const kurtosis = _kurtosis(values);
  const _mode = mode(values);
  // mean | moment | skewness | std | var
  const result = {
    min,
    max,
    range,
    sum,
    mean,
    median,
    mode: _mode,
    stdev,
    skewness,
    excessKurtosis: kurtosis
  };
  return result;
}


/**
 * Returns a mock data set that uses the same standard deviation and average.
 *
 * ![norm](out/mock.png)
 * @example const mock = stochastic.mock(stochastic.norm(1, 1, 100));
 * @param {number[]} values
 * @param {number} [num=1] a positive integer
 * @returns {number} standard deviation as positive number
 */
export function mock(values /*: Array<number> */, num/*: number */) {
  return norm(average(values),
              std(values),
              num || values.length);
}


/**
 * Returns the Skew-Normal (SN) probability distribution.
 * http://azzalini.stat.unipd.it/SN/
 *
 * @example const rsn = stochastic.rsn(10000, 1.256269, 1.605681, 5);
 * @param {number} n
 * @param {number} location
 * @param {number} scale
 * @param {number} shape 0 is the normal distribution
 * @returns {number[]} average
 */
export function rsn(n/*: number */, location/*: number */, scale/*: number */, shape/*: number */ = 0) {
  return false;
}


/**
 * Returns an array with `num` normal random variables in a [normal distribution](http://en.wikipedia.org/wiki/Normal_distribution) of mean `mu` and standard deviation `sigma`.
 *
 * ![norm](out/norm.png)
 * @example const norm = stochastic.norm(1, 1, 100);
 * @param {number} mu the mean or expectation of the distribution (and also its median and mode)
 * @param {number} sigma standard deviation as positive number
 * @param {number} [num=1] a positive integer
 * @returns {number[]} normal random values
 */
export const norm = (mu = 1/*: number */, sigma = 0/*: number */, num = 1/*: number */, xi)/*: Array<number> */ =>  {
  let U1, U2, x, y, z1, z2;
  let sample = [];

  if (sigma <= 0) {
    return sample;
  }

  function boxMuller(mu, sigma) {
    U1 = Math.random();
    U2 = Math.random();
    z1 = Math.sqrt(-2 * Math.log(U1)) * Math.cos(2 * U2 * Math.PI);
    z2 = Math.sqrt(-2 * Math.log(U1)) * Math.sin(2 * U2 * Math.PI);
    x = mu + (sigma * z1);
    y = mu + (sigma * z2);
    return [x, y];
  }

  if (typeof num === 'undefined' || num === 1 || (num % 1) !== 0) {
      return [boxMuller(mu, sigma)[0]];
  }

  if (num / 2 % 2 !== 0) sample.push(boxMuller(mu, sigma)[0]);
  for (let i = 0; i < Math.floor(num / 2); i++) {
    sample = sample.concat(boxMuller(mu, sigma));
  }
  return sample;
};


// WIP: Distributions

// https://stat.ethz.ch/R-manual/R-devel/library/stats/html/Beta.html
// Usage: applied in acoustic analysis to assess damage to gears
const dbeta = (n, shape1, shape2, ncp = 0) => {

};

// https://stat.ethz.ch/R-manual/R-devel/library/stats/html/Binomial.html
// Usage: only two mutually exclusive possible outcomes, for example the outcome of tossing a coin is heads or tails
const dbinom = (x, size, prob, log = FALSE) => {

};

// https://stat.ethz.ch/R-manual/R-devel/library/stats/html/Cauchy.html
// Usage:
const dcauchy = (x, location = 0, scale = 1, log = FALSE) => {

};

// Usage:
const dlevy = () => {

};

// https://stat.ethz.ch/R-manual/R-devel/library/stats/html/Lognormal.html
// Usage: important in the description of natural phenomena.
const dlnorm = (x, meanlog = 0, sdlog = 1, log = false) => {

};

// https://stat.ethz.ch/R-manual/R-devel/library/stats/html/Weibull.html
// https://en.wikipedia.org/wiki/Weibull_distribution
// Usage: in industrial engineering to represent manufacturing and delivery times
const dweibull = (x, shape, scale = 1, log = false) => {

};



/**
 * Returns an array corresponding to the path of [Brownian motion](http://en.wikipedia.org/wiki/Wiener_process#Related_processes) from time 0 to `T` with drift parameter `mu` and volatility parameter `sigma` (the process is initialized to be 0). The i-th entry in the array corresponds to the Brownian process at time `i * (T / steps)`.
 *
 * ![brown](out/brown.png)
 * @example const brown = stochastic.brown(1.0, -0.1, +0.1, 100, true);
 * @param {number} mu drift parameter (a real number)
 * @param {number} sigma volatility parameter (strictly positive real)
 * @param {number} T time (strictly positive real)
 * @param {number} steps (positive integer)
 * @param {boolean} [path=true]
 * @return {number[]} Brownian motion path
 */
export const brown = (
  mu/*: number */,
  sigma/*: number */,
  T/*: number */,
  steps/*: number */,
  path = true/*: boolean */)/*: Array<number> */ => {
  const B_t = [0];
  let B = 0;
  const dt = T / steps;
  let dB;

  if (!(T > 0) || !(steps > 0)) {
    return B_t;
  }

  if (path === false) {
      return [((mu * T) + (sigma * norm(0, Math.sqrt(T), 1)[0]))];
  }
  else {
    for (let i = 0; i < steps; i++) {
        dB = (mu * dt) + (sigma * norm(0, Math.sqrt(dt), 1)[0]);
      B += dB;
      B_t.push(B);
    }
    return B_t;
  }
};

/**
 * Returns an array corresponding to the path of [geometric Brownian motion](http://en.wikipedia.org/wiki/Geometric_Brownian_motion) from time 0 to `T` with drift parameter `mu` and volatility parameter `sigma` (the process is initialized to be S0). The i-th entry in the array corresponds to the geometric Brownian process at time `i * (T/steps)`.
 *
 * ![GBM](out/GBM.png)
 * @example const GBM = stochastic.GBM(1.0, -0.1, 0.1, 1.0, 100, true);
 * @param {number} S0 initialized process value
 * @param {number} mu drift parameter
 * @param {number} sigma volatility parameter (strictly positive real)
 * @param {number} T time (strictly positive real)
 * @param {number} steps (positive integer)
 * @param {boolean} [path=true]
 * @returns {number[]} geometric Brownian motion
 */
export function GBM(
  S0/*: number */,
  mu/*:number */,
  sigma/*: number */,
  T/*: number */,
  steps/*: number */,
  path = true/*: boolean */) /*: Array<number> */ {
  const S_t = [];
    let B_t = [0];

  if (!(T > 0) || !(steps > 0)) {
    return B_t;
  }

  if (path === false) {
      return [S0 * Math.exp((mu - (sigma * sigma / 2)) * T + (sigma * norm(0, Math.sqrt(T), 1)[0]))];
  } else {
      B_t = brown((mu - (sigma * sigma / 2)), sigma, T, steps, true);
    B_t.forEach(B => {
      S_t.push(S0 * Math.exp(B));
    });
    return S_t;
  }
}

const isValid = matrix => {
  const n = matrix.length;
  for (let i = 0; i < n; i++) {
    let sum = 0;
    if (matrix[i].length !== n) {
      return false;
    }
    for (let j = 0; j < n; j++) {
      if (matrix[i][j] > 1 || matrix[i][j] < 0) {
        return false;
      }
      sum += matrix[i][j];
    }
    const eps = (4 * Math.pow(10, -16));
    if (sum < 1 - eps || sum > 1 + eps) {
      return false;
    }
  }
  return true;
};

/**
 * Returns an array with the states at each step of the [discrete-time Markov Chain](http://en.wikipedia.org/wiki/Markov_chain) given by `transMatrix` (a square matrix). The number of transitions is given by `steps`. The initial state is given by start (the states are indexed from 0 to n-1 where n is the number of arrays in transMatrix).
 *
 * ![DTMC](out/DTMC.png)
 * @example const DTMC = stochastic.DTMC([[0,1,0],[0,0,1],[1,0,0]], 20, 0, true);
 * @param {Array<Array<number>>} transMatrix
 * @param {number} steps (positive integer)
 * @param {number} start
 * @param {boolean} path
 * @returns {number[]}
 */
export function DTMC(
  transMatrix/*: Array<Array<number>> */,
  steps/*: number */,
  start/*: number */,
  path = true/*: boolean */) /*: Array<number> */ {
  //function to check if input is a valid transition matrix

  //return null if the transition matrix is not valid
  if (!isValid(transMatrix)) {
    throw new Error("Invalid transMatrix");
  }

  //initialize the Markov Chain
  const init = parseInt(start, 10);
  const fullPath = [];
  fullPath.push(init);
  let stateRow = transMatrix[init];
  let U;

  for (let i = 0; i < steps; i++) {
    U = Math.random();
    let sum = 0;
    for (let j = 0; j < stateRow.length; j++) {
      sum += stateRow[j];
      if (sum > U) {
        fullPath.push(j);
        stateRow = transMatrix[j];
        j = stateRow.length;
      }
    }
  }
  if (path === false) {
    return fullPath[fullPath.length - 1];
  }
  else {
    return fullPath;
  }
}

/**
 * Returns the `transMatrix` for an array of mapped `states` to numerical values.
 *
 * @example const collate = stochastic.collate([0,1,0,0,0,1,1,0,0]);
 * @param {number[]} states
 * @returns {Array<Array<number>>} transMatrix
 */
export function collate(
  states/*: Array<number> */) {
  // TODO: Allow for arbitrary string values let uniques = [], lookup = {};
  var max = Math.max(...states) + 1;
  const row = Array(max).fill(0);
  let transMatrix = []; // Array(max).fill(row.slice());
  for (let i = 0; i < row.length; i++) {
    transMatrix.push(row.slice());
  }

  let result = states
        .reduce((p, c) => {
          p.transMatrix[p.previous][c]++;
          p.previous = c;
          return p;
        }, {
          transMatrix: transMatrix,
          previous: 0
        });
  const weighted = result
          .transMatrix
          .map(e => {
            let sum = e.reduce((p, c) => {
              return p + c;
            }, 0);
            return e.map(e => {
              return e / sum;
            });
          });
  // TODO: percentages
  // console.log(result.transMatrix);
  return weighted;
}

/**
 * Returns an object with the {key:value} pair {time:state} at each step of the [continuous-time Markov Chain](http://en.wikipedia.org/wiki/Continuous-time_Markov_chain) given by transMatrix (a square matrix). The Markov Chain is simulated until time `T`. The initial state is given by `start` (the states are indexed from 0 to n-1 where n is the number of arrays in `transMatrix`).
 *
 * ![CTMC](out/CTMC.png)
 * @example const CTMC = stochastic.CTMC([[0,1,0],[0,0,1],[1,0,0]], 20, 0, true);
 * @param {Array<Array<number>>} transMatrix
 * @param {number} T
 * @param {number} start
 * @param {boolean} [path=true]
 * @returns {Object} Continuous-time Markov chain
 */
export function CTMC(
  transMatrix/*: Array<Array<number>> */,
  T/*: number */,
  start/*: number */,
  path = true/*: boolean */) /*: {[ts:string]: number} */ {
  // function to determine if input is a valid CTMC transition matrix

  //return null if the transition matrix is not valid
  if (!isValid(transMatrix)) {
    throw new Error("Invalid transMatrix");
  }

  // initialize simulation of the CTMC
  const fullPath = { "0": start };
  let lastState = start;
  let stateRow = transMatrix[start];
  let t = 0;
  let U, exp, sum;

  // begin simulation
  while (t < T) {
    let lambda = 0;
    for (let i = 0; i < stateRow.length; i++) {
      lambda += stateRow[i];
    }
    U = Math.random();
    exp = -Math.log(U) / lambda; //exp is the time to make the transition
    t += exp;

    if (t > T) {
      if (path === false) {
        return {t: lastState};
      }
      else {
        return fullPath;
      }
    }

    sum = 0;
    U = Math.random();
    for (let j = 0; j < stateRow.length; j++) {
      sum += stateRow[j] / lambda;
      if (sum > U) {
        stateRow = transMatrix[j];
        fullPath[t] = j;
        lastState = j;
        j = stateRow.length;
      }
    }
  }
  return fullPath;
}

/**
 * Generates a random sample (with replacement) from array `arr` of observations. Number of observations `n` is specified by the user.
 * @example const sample = stochastic.sample([1,2,3,4,5], +10);
 * @param {number[]} arr
 * @param {number} n (positive integer)
 * @returns {number[]} random sample
 */
export function sample(arr/*: number[] */, n/*: number */) /*: Array<number> */ {
  const samp = [];
  for (let i = 0; i < n; i++) {
    const index = Math.floor(Math.random() * arr.length);
    const value = arr[index];
    samp.push(value);
  }
  return samp;
}

/**
 * Generates an exponential random variable with rate parameter `lambda`.
 * @example const exp = stochastic.exp(20);
 * @param {number} lambda (positive)
 * @returns {number} variable
 */
export function exp(lambda = 1/*: number */) /*: number */ {
  return -Math.log(Math.random()) / lambda;
}

/**
 * Generates a Pareto random variables with parameters `x_m` and `alpha`.
 * @example const pareto = stochastic.pareto(+20.0, -1.0);
 * @param {number} x_a (positive)
 * @param {number} alpha
 * @returns {number} distribution
 */
export function pareto(x_m/*: number */, alpha/*: number */) /*: number */ {
  return x_m / Math.pow(Math.random(), 1 / alpha);
}

/**
 * Generates a histogram object from an array of data. Keys denote the lower bound of each bin and the values indicate the frequency of data in each bin.
 *
 * ![hist](out/hist.png)
 * @example const hist = stochastic.hist([1,1,1,1,2,3,3,4,4,4]);
 * @param {Array<number>} arr
 * @returns {Object} histogram
 */
export function hist(arr/*: Array<number> */, n/*: number */) {
  const newArr = arr.slice().sort((a, b) => a - b);

  const max = newArr[arr.length - 1];
  const min = newArr[0];
  const bins = Math.round(Math.sqrt(arr.length));
  const binSize = n || (max - min) / bins;

  const obj = {};
  const keys = [];
  for (let i = 0; i < bins; i++) {
    const key = min + (i * binSize);
    keys.push(key);
    obj[key] = 0;
  }

  for (let j = 0; j < arr.length; j++) {
    let val = min;
    let temp_key = 0;
    let cont = true;
    while (cont) {
      if (newArr[j] === newArr[newArr.length - 1]) {
        obj[keys[keys.length - 1]] += 1;
        cont = false;
        break;
      }
      else if (newArr[j] < val + binSize) {
        obj[keys[temp_key]] += 1;
        cont = false;
        break;
      }
      else {
        temp_key += 1;
        val += binSize;
      }
    }
  }

  return obj;
}
