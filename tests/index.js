// import * as stochastic from '../src/index';
import * as stoch from '../lib/index';

import _ from 'lodash';
import { spec, valid, explain, conform } from 'js.spec';

const { check, gen, property, sample, sampleOne } = require('testcheck');


console.log(stoch);

const normal = spec.set;

const e = stochastic.norm(1, 1, 100);

console.log('norm collection?', spec.coll(e));

// console.log(explain(normal, e));
const exp = stochastic.exp(20000);

console.log('exponential random variable?', spec.positive(stochastic.exp()), spec.positive(exp));

const hist = stochastic.hist([1,2,3,4,3,3,3,7,4,2,2,3,2,3,1,3,4,4,3,3]);

const average = stochastic.average([2, 3, 4, 4, 4, 5, 6]);
const std = stochastic.std([2, 3, 4, 4, 4, 5, 6]);
const mock = stochastic.mock([2, 3, 4, 4, 4, 5, 6], 10);
console.log('mock', mock);

// const bucket = spec.map('bucket', {
//   spec.string: spec.number
// });
console.log(hist);
// console.log('bucket?', spec.collection(hist));
// Bucket values are the counted sums of previous entries
const bucketLabel = spec.and(
  'label',
  spec.string,
  x => x !== ''
);
const bucketCount = spec.and(
  'positive integers',
  spec.number,
  spec.positive,
  spec.integer
);

Object.keys(hist)
  .sort()
  .map(e => {
    // Buckets
    console.log('bucket entry?', valid(bucketLabel, e), valid(bucketCount, hist[e]));
  });


let g = gen.array(gen.int);
console.log('testcheck', g, gen.int);

const result = check(
  property(
    // the arguments generator
    gen.int,
    // the property function to test
    x => x - x === 0
  ),
  { numTests: 1000 }
);
console.log(result);



console.log('wide dist\n', stochastic.summary([2, 3, 8, 1000]));
console.log('2 heavy\n', stochastic.summary([1, 2, 3, 2, 2, 2, 2, 2, 2, 2]));

// random
console.log('10000 random\n', stochastic.summary((new Array(10000)).fill(null).map(e => parseFloat(Math.random().toPrecision(2)))));

// example from wikipedia
// Here is a paper that elaborates:  Westfall, P.H. (2014). Kurtosis as Peakedness, 1905 – 2014. R.I.P. The American Statistician, 68, 191–195.
// https://www.spcforexcel.com/knowledge/basic-statistics/are-skewness-and-kurtosis-useful-statistics
const base = [0, 3, 4, 1, 2, 3, 0, 2, 1, 3, 2, 0, 2, 2, 3, 2, 5, 2, 3, 1];
console.log('excessKurtosis: 2.78 − 3', stochastic.summary(base.concat([1])));
console.log('excessKurtosis: 18.05 − 3', stochastic.summary(base.concat([999])));

console.log('norm(mean = 100, std = 10, num = 10000)\n', stochastic.summary(stochastic.norm(100, 10, 10000).map(e => parseInt(e, 10))));
