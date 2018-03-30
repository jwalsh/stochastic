// mock(values)

import * as stochastic from '../src/index';

import {plot} from 'plotter';


const mock = stochastic.mock(stochastic.norm(1, 1, 100));
const hist = stochastic.hist(mock);

const data = Object.keys(hist).map((e, i, c) => { return hist[e]; });
console.log(hist, data);

plot({
  data: data,
  style: 'boxes',
  boxwidth: '1',
  filename:   'out/mock.png',
  xlabel:     'bucket',
  ylabel:     'count',
  format:     'png'
});


console.log(mock);
