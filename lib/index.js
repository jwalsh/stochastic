'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.poissP = poissP;
exports.average = average;
exports.mode = mode;
exports.std = std;
exports.summary = summary;
exports.mock = mock;
exports.GBM = GBM;
exports.DTMC = DTMC;
exports.collate = collate;
exports.CTMC = CTMC;
exports.sample = sample;
exports.exp = exp;
exports.pareto = pareto;
exports.hist = hist;

function _toConsumableArray(arr) { if (Array.isArray(arr)) { for (var i = 0, arr2 = Array(arr.length); i < arr.length; i++) { arr2[i] = arr[i]; } return arr2; } else { return Array.from(arr); } }

var _skewness = require('compute-skewness');
var _kurtosis = require('compute-kurtosis');

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
 * @example const poissP = stoch.poissP(1, 100, true);
 * @example const emails = stoch.hist(Array(261).fill().map(e => stoch.poissP(10, 8, true).length));
 * @param {number} lambda (rate)
 * @param {number} T time as positive number
 * @param {boolean} [path=true]
 * @returns {number[]} times of each arrival in a Poisson Process
 */
function poissP() /*: boolean */ /*: Array<number> */{
  var lambda = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : 0;
  var T = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 0;
  var path = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : true;

  var U = void 0,
      exp = void 0,
      N_t = void 0,
      t = void 0,
      n = void 0;
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
 * @example const avg = stoch.average([1, 2, 3]);
 * @param {number[]} values
 * @returns {number} average
 */
function average(data /*: Array<number> */) {
  var sum = data.reduce(function (curr, acc) {
    return acc + curr;
  }, 0);
  return sum / data.length;
}

/**
 * Returns the mode.
 *
 * @example const mode = stoch.mode([1, 2, 3]);
 * @param {number[]} values
 * @returns {number} mode
 */
function mode(data /*: Array<number> */) {
  return data.reduce(function (p, c) {
    var val = p.numMapping[c] = (p.numMapping[c] || 0) + 1;
    if (val > p.greatestFreq) {
      p.greatestFreq = val;
      p.mode = c;
    }
    return p;
  }, { mode: null, greatestFreq: -Infinity, numMapping: {} }).mode;
}

/**
 * Returns the standard deviation.
 *
 * @example const std = stoch.std([2, 3, 4, 4, 4, 5, 6]);
 * @param {number[]} values
 * @returns {number} standard deviation as positive number
 */
function std(values /*: Array<number> */) {
  var avg = average(values);

  var squareDiffs = values.map(function (value) {
    var diff = value - avg;
    var sqrDiff = diff * diff;
    return sqrDiff;
  });

  var avgSquareDiff = average(squareDiffs);

  return Math.sqrt(avgSquareDiff);
}

/**
 * Provides a summary of a set of data.
 *
 * @example const summary = stoch.summary([1, 2, 3]);
 * @param {number[]} values
 * @returns {object} R-like summary of values
 */
function summary(values /*: Array<number> */) {
  if (values.length === 0) {
    return {};
  }
  var sorted = values.sort(function (a, b) {
    return a - b;
  });

  var min = sorted[0];
  var max = sorted[values.length - 1];
  var range = [min, max];

  var sum = values.reduce(function (p, c) {
    return p + c;
  }, 0);
  var stdev = std(values);
  var median = function (values) {
    if (values.length % 2 === 1) {
      return sorted[(values.length - 1) / 2];
    } else {
      return (sorted[values.length / 2 - 1] + sorted[values.length / 2]) / 2;
    }
  }(values);
  var mean = average(values);
  // const std = std(values);
  var quantile = function (values) {
    var result = [25, 50, 75].reduce(function (p, c) {
      p[c] = c;
      return p;
    }, {});
    return result;
  }(sorted);

  var skewness = _skewness(values);
  var kurtosis = _kurtosis(values);
  var _mode = mode(values);

  var result = {
    min: min,
    max: max,
    range: range,
    sum: sum,
    mean: mean,
    median: median,
    mode: _mode,
    stdev: stdev,
    skewness: skewness,
    excessKurtosis: kurtosis
  };
  return result;
}

/**
 * Returns a mock data set that uses the same standard deviation and average.
 *
 * ![norm](out/mock.png)
 * @example const mock = stoch.mock(stoch.norm(1, 1, 100));
 * @param {number[]} values
 * @param {number} [num=1] a positive integer
 * @returns {number} standard deviation as positive number
 */
function mock(values /*: Array<number> */, num /*: number */) {
  return norm(average(values), std(values), num || values.length);
}

/**
 * Returns an array with `num` normal random variables in a [normal distribution](http://en.wikipedia.org/wiki/Normal_distribution) of mean `mu` and standard deviation `sigma`.
 *
 * ![norm](out/norm.png)
 * @example const norm = stoch.norm(1, 1, 100);
 * @param {number} mu the mean or expectation of the distribution (and also its median and mode)
 * @param {number} sigma standard deviation as positive number
 * @param {number} [num=1] a positive integer
 * @returns {number[]} normal random values
 */
var norm = exports.norm = function norm() /*: Array<number> */{
  var mu = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : 1;
  var sigma = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 0;
  var num = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : 1;
  var /*: number */xi = arguments[3];

  var U1 = void 0,
      U2 = void 0,
      x = void 0,
      y = void 0,
      z1 = void 0,
      z2 = void 0;
  var sample = [];

  if (sigma <= 0) {
    return sample;
  }

  function boxMuller(mu, sigma) {
    U1 = Math.random();
    U2 = Math.random();
    z1 = Math.sqrt(-2 * Math.log(U1)) * Math.cos(2 * U2 * Math.PI);
    z2 = Math.sqrt(-2 * Math.log(U1)) * Math.sin(2 * U2 * Math.PI);
    x = mu + sigma * z1;
    y = mu + sigma * z2;
    return [x, y];
  }

  if (typeof num === 'undefined' || num === 1 || num % 1 !== 0) {
    return [boxMuller(mu, sigma)[0]];
  }

  if (num / 2 % 2 !== 0) sample.push(boxMuller(mu, sigma)[0]);
  for (var i = 0; i < Math.floor(num / 2); i++) {
    sample = sample.concat(boxMuller(mu, sigma));
  }
  return sample;
};

// WIP: Distributions

// https://stat.ethz.ch/R-manual/R-devel/library/stats/html/Beta.html
// Usage: applied in acoustic analysis to assess damage to gears
var dbeta = function dbeta(n, shape1, shape2) {
  var ncp = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : 0;
};

// https://stat.ethz.ch/R-manual/R-devel/library/stats/html/Binomial.html
// Usage: only two mutually exclusive possible outcomes, for example the outcome of tossing a coin is heads or tails
var dbinom = function dbinom(x, size, prob) {
  var log = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : FALSE;
};

// https://stat.ethz.ch/R-manual/R-devel/library/stats/html/Cauchy.html
// Usage:
var dcauchy = function dcauchy(x) {
  var location = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 0;
  var scale = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : 1;
  var log = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : FALSE;
};

// Usage:
var dlevy = function dlevy() {};

// https://stat.ethz.ch/R-manual/R-devel/library/stats/html/Lognormal.html
// Usage: important in the description of natural phenomena.
var dlnorm = function dlnorm(x) {
  var meanlog = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 0;
  var sdlog = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : 1;
  var log = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : false;
};

// https://stat.ethz.ch/R-manual/R-devel/library/stats/html/Weibull.html
// https://en.wikipedia.org/wiki/Weibull_distribution
// Usage: in industrial engineering to represent manufacturing and delivery times
var dweibull = function dweibull(x, shape) {
  var scale = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : 1;
  var log = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : false;
};

/**
 * Returns an array corresponding to the path of [Brownian motion](http://en.wikipedia.org/wiki/Wiener_process#Related_processes) from time 0 to `T` with drift parameter `mu` and volatility parameter `sigma` (the process is initialized to be 0). The i-th entry in the array corresponds to the Brownian process at time `i * (T / steps)`.
 *
 * ![brown](out/brown.png)
 * @example const brown = stoch.brown(1.0, -0.1, +0.1, 100, true);
 * @param {number} mu drift parameter (a real number)
 * @param {number} sigma volatility parameter (strictly positive real)
 * @param {number} T time (strictly positive real)
 * @param {number} steps (positive integer)
 * @param {boolean} [path=true]
 * @return {number[]} Brownian motion path
 */
var brown = exports.brown = function brown(mu /*: number */
, sigma /*: number */
, T /*: number */
, steps /*: number */
) /*: boolean */ /*: Array<number> */{
  var path = arguments.length > 4 && arguments[4] !== undefined ? arguments[4] : true;

  var B_t = [0];
  var B = 0;
  var dt = T / steps;
  var dB = void 0;

  if (!(T > 0) || !(steps > 0)) {
    return B_t;
  }

  if (path === false) {
    return [mu * T + sigma * norm(0, Math.sqrt(T), 1)[0]];
  } else {
    for (var i = 0; i < steps; i++) {
      dB = mu * dt + sigma * norm(0, Math.sqrt(dt), 1)[0];
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
 * @example const GBM = stoch.GBM(1.0, -0.1, 0.1, 1.0, 100, true);
 * @param {number} S0 initialized process value
 * @param {number} mu drift parameter
 * @param {number} sigma volatility parameter (strictly positive real)
 * @param {number} T time (strictly positive real)
 * @param {number} steps (positive integer)
 * @param {boolean} [path=true]
 * @returns {number[]} geometric Brownian motion
 */
function GBM(S0 /*: number */
, mu /*:number */
, sigma /*: number */
, T /*: number */
, steps /*: number */
) /*: boolean */ /*: Array<number> */{
  var path = arguments.length > 5 && arguments[5] !== undefined ? arguments[5] : true;

  var S_t = [];
  var B_t = [0];

  if (!(T > 0) || !(steps > 0)) {
    return B_t;
  }

  if (path === false) {
    return [S0 * Math.exp((mu - sigma * sigma / 2) * T + sigma * norm(0, Math.sqrt(T), 1)[0])];
  } else {
    B_t = brown(mu - sigma * sigma / 2, sigma, T, steps, true);
    B_t.forEach(function (B) {
      S_t.push(S0 * Math.exp(B));
    });
    return S_t;
  }
}

var isValid = function isValid(matrix) {
  var n = matrix.length;
  for (var i = 0; i < n; i++) {
    var sum = 0;
    if (matrix[i].length !== n) {
      return false;
    }
    for (var j = 0; j < n; j++) {
      if (matrix[i][j] > 1 || matrix[i][j] < 0) {
        return false;
      }
      sum += matrix[i][j];
    }
    var eps = 4 * Math.pow(10, -16);
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
 * @example const DTMC = stoch.DTMC([[0,1,0],[0,0,1],[1,0,0]], 20, 0, true);
 * @param {Array<Array<number>>} transMatrix
 * @param {number} steps (positive integer)
 * @param {number} start
 * @param {boolean} path
 * @returns {number[]}
 */
function DTMC(transMatrix /*: Array<Array<number>> */
, steps /*: number */
, start /*: number */
) /*: boolean */ /*: Array<number> */{
  var path = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : true;

  //function to check if input is a valid transition matrix

  //return null if the transition matrix is not valid
  if (!isValid(transMatrix)) {
    throw new Error("Invalid transMatrix");
  }

  //initialize the Markov Chain
  var init = parseInt(start, 10);
  var fullPath = [];
  fullPath.push(init);
  var stateRow = transMatrix[init];
  var U = void 0;

  for (var i = 0; i < steps; i++) {
    U = Math.random();
    var sum = 0;
    for (var j = 0; j < stateRow.length; j++) {
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
  } else {
    return fullPath;
  }
}

/**
 * Returns the `transMatrix` for an array of mapped `states` to numerical values.
 *
 * @example const collate = stoch.collate([0,1,0,0,0,1,1,0,0]);
 * @param {number[]} states
 * @returns {Array<Array<number>>} transMatrix
 */
function collate(states /*: Array<number> */) {
  // TODO: Allow for arbitrary string values let uniques = [], lookup = {};
  var max = Math.max.apply(Math, _toConsumableArray(states)) + 1;
  var row = Array(max).fill(0);
  var transMatrix = []; // Array(max).fill(row.slice());
  for (var i = 0; i < row.length; i++) {
    transMatrix.push(row.slice());
  }

  var result = states.reduce(function (p, c) {
    p.transMatrix[p.previous][c]++;
    p.previous = c;
    return p;
  }, {
    transMatrix: transMatrix,
    previous: 0
  });
  var weighted = result.transMatrix.map(function (e) {
    var sum = e.reduce(function (p, c) {
      return p + c;
    }, 0);
    return e.map(function (e) {
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
 * @example const CTMC = stoch.CTMC([[0,1,0],[0,0,1],[1,0,0]], 20, 0, true);
 * @param {Array<Array<number>>} transMatrix
 * @param {number} T
 * @param {number} start
 * @param {boolean} [path=true]
 * @returns {Object} Continuous-time Markov chain
 */
function CTMC(transMatrix /*: Array<Array<number>> */
, T /*: number */
, start /*: number */
) /*: boolean */ /*: {[ts:string]: number} */{
  var path = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : true;

  // function to determine if input is a valid CTMC transition matrix

  //return null if the transition matrix is not valid
  if (!isValid(transMatrix)) {
    throw new Error("Invalid transMatrix");
  }

  // initialize simulation of the CTMC
  var fullPath = { "0": start };
  var lastState = start;
  var stateRow = transMatrix[start];
  var t = 0;
  var U = void 0,
      exp = void 0,
      sum = void 0;

  // begin simulation
  while (t < T) {
    var lambda = 0;
    for (var i = 0; i < stateRow.length; i++) {
      lambda += stateRow[i];
    }
    U = Math.random();
    exp = -Math.log(U) / lambda; //exp is the time to make the transition
    t += exp;

    if (t > T) {
      if (path === false) {
        return { t: lastState };
      } else {
        return fullPath;
      }
    }

    sum = 0;
    U = Math.random();
    for (var j = 0; j < stateRow.length; j++) {
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
 * @example const sample = stoch.sample([1,2,3,4,5], +10);
 * @param {number[]} arr
 * @param {number} n (positive integer)
 * @returns {number[]} random sample
 */
function sample(arr /*: number[] */, n /*: number */) /*: Array<number> */{
  var samp = [];
  for (var i = 0; i < n; i++) {
    var index = Math.floor(Math.random() * arr.length);
    var value = arr[index];
    samp.push(value);
  }
  return samp;
}

/**
 * Generates an exponential random variable with rate parameter `lambda`.
 * @example const exp = stoch.exp(20);
 * @param {number} lambda (positive)
 * @returns {number} variable
 */
function exp() /*: number */ /*: number */{
  var lambda = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : 1;

  return -Math.log(Math.random()) / lambda;
}

/**
 * Generates a Pareto random variables with parameters `x_m` and `alpha`.
 * @example const pareto = stoch.pareto(+20.0, -1.0);
 * @param {number} x_a (positive)
 * @param {number} alpha
 * @returns {number} distribution
 */
function pareto(x_m /*: number */, alpha /*: number */) /*: number */{
  return x_m / Math.pow(Math.random(), 1 / alpha);
}

/**
 * Generates a histogram object from an array of data. Keys denote the lower bound of each bin and the values indicate the frequency of data in each bin.
 *
 * ![hist](out/hist.png)
 * @example const hist = stoch.hist([1,1,1,1,2,3,3,4,4,4]);
 * @param {Array<number>} arr
 * @returns {Object} histogram
 */
function hist(arr /*: Array<number> */, n /*: number */) {
  var newArr = arr.slice().sort(function (a, b) {
    return a - b;
  });

  var max = newArr[arr.length - 1];
  var min = newArr[0];
  var bins = Math.round(Math.sqrt(arr.length));
  var binSize = n || (max - min) / bins;

  var obj = {};
  var keys = [];
  for (var i = 0; i < bins; i++) {
    var key = min + i * binSize;
    keys.push(key);
    obj[key] = 0;
  }

  for (var j = 0; j < arr.length; j++) {
    var val = min;
    var temp_key = 0;
    var cont = true;
    while (cont) {
      if (newArr[j] === newArr[newArr.length - 1]) {
        obj[keys[keys.length - 1]] += 1;
        cont = false;
        break;
      } else if (newArr[j] < val + binSize) {
        obj[keys[temp_key]] += 1;
        cont = false;
        break;
      } else {
        temp_key += 1;
        val += binSize;
      }
    }
  }

  return obj;
}