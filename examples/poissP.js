// poissP(lambda, T, path)

import {plot} from 'plotter';

import * as stochastic from '../src/index';

const poissP = stochastic.poissP(1, 100, true);

console.log(poissP);

plot({
    data:       poissP,
    filename:   'out/poissP.png',
    xlabel:     'index',
    ylabel:     'goal',
    format:     'png'
});
