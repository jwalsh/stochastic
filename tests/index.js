// import * as stoch from '../src/index';
import * as stoch from '../lib/index';

import _ from 'lodash';
import { spec, valid, explain, conform } from 'js.spec';

const { check, gen, property, sample, sampleOne } = require('testcheck');


// spec interface
// { cat: [Function: m],
//   alt: [Function: g],
//   tuple: [Function: f],
//   map: [Function: f],
//   and: [Function: f],
//   collection: [Function: f],
//   keys: [Function: f],
//   or: [Function: f],
//   nilable: [Function: f],
//   nil: [Function: o],
//   number: [Function: i],
//   fn: [Function: u],
//   obj: [Function: a],
//   object: [Function: a],
//   set: [Function: l],
//   bool: [Function: f],
//   boolean: [Function: f],
//   date: [Function: c],
//   int: [Function: s],
//   integer: [Function: s],
//   str: [Function: p],
//   string: [Function: p],
//   sym: [Function: y],
//   symbol: [Function: y],
//   array: [Function: isArray],
//   coll: [Function: d],
//   even: [Function: v],
//   odd: [Function: h],
//   positive: [Function: b],
//   negative: [Function: m],
//   zero: [Function: g] }


console.log(stoch);

const normal = spec.set;

const e = stoch.norm(1, 1, 100);

console.log('norm collection?', spec.coll(e));

// console.log(explain(normal, e));
const exp = stoch.exp(20000);

console.log('exponential random variable?', spec.positive(stoch.exp()), spec.positive(exp));

const hist = stoch.hist([1,2,3,4,3,3,3,7,4,2,2,3,2,3,1,3,4,4,3,3]);

const average = stoch.average([2, 3, 4, 4, 4, 5, 6]);
const std = stoch.std([2, 3, 4, 4, 4, 5, 6]);
const mock = stoch.mock([2, 3, 4, 4, 4, 5, 6], 10);
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
)
console.log(result);



console.log('wide dist\n', stoch.summary([2, 3, 8, 1000]));
console.log('2 heavy\n', stoch.summary([1, 2, 3, 2, 2, 2, 2, 2, 2, 2]));
console.log('10000 random\n', stoch.summary((new Array(10000)).fill(null).map(e => parseFloat(Math.random().toPrecision(2)))));
console.log('norm(mean = 100, std = 10, num = 1000)\n', stoch.summary(stoch.norm(100, 10, 1000).map(e => parseInt(e, 10))));
