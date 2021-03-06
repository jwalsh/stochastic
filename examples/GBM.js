// GBM(S0, mu, sigma, T, steps, path)
import {plot} from 'plotter';

import * as stochastic from '../src/index';

const GBM = stochastic.GBM(1.0, -0.1, 0.1, 1.0, 100, true);

console.log(GBM);

plot({
    data:       GBM,
    filename:   'out/GBM.png',
    xlabel:     'index',
    ylabel:     'GBM',
    format:     'png'
});
