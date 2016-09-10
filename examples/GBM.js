// GBM(S0, mu, sigma, T, steps, path)
var plot = require('plotter').plot;

var stoch = require('../index');

var GBM = stoch.GBM(1.0, -0.25, 2.0, 4.0, 1000, true);

console.log(GBM);

plot({
    data:       GBM,
    filename:   'GBM.png',
    xlabel:     'index',
    ylabel:     'GBM',
    format:     'png'
});
