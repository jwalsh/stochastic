var kurtosis = require('compute-kurtosis');
var fs = require('fs');
var histogram = require('ascii-histogram');


// bound 0...1 between 0...b
let bound = (n, b = 28) => {
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

for (var i = 1; i < 200; i+=1) {
  const data = (new Array(100000))
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
  console.log(i, 'kurtosis', k);

}

let out = trials.reduce((p, c, i) => {
  p += `${i},${c}\n`;
  return p;
}, '');

fs.writeFileSync('trials.txt', out);
