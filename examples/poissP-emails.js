// poissP(lambda, T, path)

import {plot} from 'plotter';

import * as stoch from '../src/index';

// Assuming you get 10 emails per hour over the course of an 8 hour day;
// what's the distribution of the number of emails you receive each day
// over the course of a standard 261 work-day year
const emails = Array
      .apply(
        null,
        Array(261))
      .map(
        (e, i, c) => {
          const poissP = stoch.poissP(10, 8, true);
          return poissP.length;
        });


console.log(emails);

const hist = stoch.hist(emails);
// const hist = stoch.hist(Array(261).fill().map(e => stoch.poissP(10, 8, true).length));
console.log(hist);

// const data = Object.keys(hist).map((e, i, c) => { return hist[e]; });

plot({
  data:		{ 'line' : hist },
  style: 'boxes',
  boxwidth: '1',
  filename:   'out/poissP-emails.png',
  xlabel:     'emails / workday',
  ylabel:     'days / year',
  format:     'png'
});
