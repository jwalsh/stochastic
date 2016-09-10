// DTMC(transMatrix, steps, start, path)

var plot = require('plotter').plot;

var stoch = require('../index');
var report = require('./report');

var transMatrixTwo = [
    [0, 1, 0],
    [0.4, 0.2, 0.4],
    [0, 1, 0]
];

var DTMC = stoch.DTMC(transMatrixTwo, 20, 0, true);

console.log(DTMC);


plot({
    data:       {tick: DTMC},
    filename:   'DTMC.png',
    xlabel:     'time',
    ylabel:     'state',
    format:     'png'
});
