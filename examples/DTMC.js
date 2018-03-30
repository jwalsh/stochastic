// DTMC(transMatrix, steps, start, path)

import {plot} from 'plotter';

import * as stochastic from '../src/index';

const transMatrixTwo = [
    [0, 1, 0],
    [0.4, 0.2, 0.4],
    [0, 1, 0]
];

// var DTMC = stochastic.DTMC([[0,1,0],[0,0,1],[1,0,0]], 20, 0, true);
const DTMC = stochastic.DTMC([[0,1,0],[0,0,1],[.5,.5,0]], 20, 0, true);
// var DTMC = stochastic.DTMC(transMatrixTwo, 20, 0, true);

console.log(DTMC);


plot({
    data:       {tick: DTMC},
    filename:   'out/DTMC.png',
    xlabel:     'time',
    ylabel:     'state',
    format:     'png'
});
