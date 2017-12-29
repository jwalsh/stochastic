var kurtosis = require('compute-kurtosis');
var fs = require('fs');
var histogram = require('ascii-histogram');


// bound 0...1 between 0...b
let bound = (n, b = 40) => {
  return Math.floor(n * b);
};

let tests = [
  {
    name: "symmetric", // 0...1 normal
    rand:  (t = 6) => { // apply random repeatedly for dist
      var rand = 0;

      for (var i = 0; i < t; i += 1) {
        rand += Math.random();
      }
      return rand / t;
    }
  },
  {
    name: "uniform", // 0...1
    rand:  () => {
      return Math.random();
    }
  }
];

let trials = [];
const start = 5;
for (var i = 5; i < 650; i+=1) {
  const data = (new Array(1000))
        .fill(null)
        .map(e => tests[0].rand(i))
        .map(e => bound(e))
        .sort((a, b) => a - b);


  const dist = data
        .reduce((p, c) => {
          p[c] = p[c] ? ++p[c] : 1;
          return p;
        }, {});

  console.log('\n--------------', tests[0].name, i, '--------------');
  console.log(histogram(dist));
  let k = kurtosis( data );
  trials.push(k);
  console.log(i, 40, 'kurtosis', k);

}

let out = trials.reduce((p, c, i) => {
  p += `${i + start},${c}\n`;
  return p;
}, '');

fs.writeFileSync('trials.txt', out);
