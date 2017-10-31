// mock(values)

import * as stoch from '../src/index';

import {plot} from 'plotter';


const mock = stoch.mock(stoch.norm(1, 1, 100));
const hist = stoch.hist(mock);

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