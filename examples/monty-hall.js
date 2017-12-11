// TODO: Migrate to the stochastic library

let doors = 3;

let trials = 1000;

let playerSelection;

// Player will always switch doors if true
let strategySwitch = false;
console.log('Using strategy switch', strategySwitch);

let userWins = [];

for (var i = 0; i < trials; i++) {
  console.log('Trial', i);

  let winner = Math.floor(Math.random() * doors);
  let user = Math.floor(Math.random() * doors);
  console.log(`User picks door ${user}`);

  // Find doors that Monty or the user haven't selected
  let unclaimed = (new Array(doors))
      .fill(null)
      .map((e, i) => i)
      .filter(e => e !== winner)
      .filter(e => e !== user);

  let doorOpen = Math.floor(Math.random() * unclaimed.length);
  console.log('Opening', unclaimed[doorOpen]);

  let unopened = (new Array(doors))
      .fill(null)
      .map((e, i) => i)
      .filter(e => e !== unclaimed[doorOpen])
      .filter(e => e !== user);

  // All trials use the same strategy
  if (strategySwitch) {
    let doorSwitch = Math.floor(Math.random() * unopened.length);
    let change = unopened[doorSwitch];
    console.log(`Switching choice from ${user} to ${change}`);
    user = change;
  } else {
    console.log(`Retaining original choice from ${user}`);
  }

  let userWin = false;
  if (user === winner) {
    userWin = true;
  }
  userWins.push(userWin);
}

let report = userWins.reduce((p, c) => {
  if (c) {
    p.wins++;
  } else {
    p.losses++;
  }
  return p;
}, {wins: 0, losses: 0});

console.log(JSON.stringify(report, null, '  '));
