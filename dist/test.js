'use strict';

var _index = require('../lib/index');

var stoch = _interopRequireWildcard(_index);

var _lodash = require('lodash');

var _lodash2 = _interopRequireDefault(_lodash);

var _js = require('js.spec');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj.default = obj; return newObj; } }

var _require = require('testcheck'),
    check = _require.check,
    gen = _require.gen,
    property = _require.property,
    sample = _require.sample,
    sampleOne = _require.sampleOne;

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


// import * as stoch from '../src/index';


console.log(stoch);

var normal = _js.spec.set;

var e = stoch.norm(1, 1, 100);

console.log('norm collection?', _js.spec.coll(e));

// console.log(explain(normal, e));
var exp = stoch.exp(20000);

console.log('exponential random variable?', _js.spec.positive(stoch.exp()), _js.spec.positive(exp));

var hist = stoch.hist([1, 2, 3, 4, 3, 3, 3, 7, 4, 2, 2, 3, 2, 3, 1, 3, 4, 4, 3, 3]);

var average = stoch.average([2, 3, 4, 4, 4, 5, 6]);
var std = stoch.std([2, 3, 4, 4, 4, 5, 6]);
var mock = stoch.mock([2, 3, 4, 4, 4, 5, 6], 10);
console.log('mock', mock);

// const bucket = spec.map('bucket', {
//   spec.string: spec.number
// });
console.log(hist);
// console.log('bucket?', spec.collection(hist));
// Bucket values are the counted sums of previous entries
var bucketLabel = _js.spec.and('label', _js.spec.string, function (x) {
  return x !== '';
});
var bucketCount = _js.spec.and('positive integers', _js.spec.number, _js.spec.positive, _js.spec.integer);

Object.keys(hist).sort().map(function (e) {
  // Buckets
  console.log('bucket entry?', (0, _js.valid)(bucketLabel, e), (0, _js.valid)(bucketCount, hist[e]));
});

var g = gen.array(gen.int);
console.log('testcheck', g, gen.int);

var result = check(property(
// the arguments generator
gen.int,
// the property function to test
function (x) {
  return x - x === 0;
}), { numTests: 1000 });
console.log(result);

