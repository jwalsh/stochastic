// TODO: Migrate to the stochastic library
let trials = 10;

// Suppose you're on a game show, and you're given the choice of three doors:
let doors = 3;

// Vos Savant's response was that the contestant should switch to the
// other door (vos Savant 1990a).
let strategySwitch = true;
console.log('Using strategy switch', strategySwitch);

let contestantWins = [];

for (var i = 0; i < trials; i++) {
  console.log('* Trial', i);

  //  Behind one door is a car; behind the others, goats.
  let winner = Math.floor(Math.random() * doors);
  // You pick a door, say No. 1,
  let contestant = Math.floor(Math.random() * doors);
  console.log(`  Contestant picks door ${contestant}`);

  // Find doors that Monty or the contestant haven't selected
  let unclaimed = (new Array(doors))
      .fill(null)
      .map((e, i) => i)
      .filter(e => e !== winner)
      .filter(e => e !== contestant);

  // and the host, who knows what's behind the doors, opens another
  // door, say No. 3, which has a goat.
  let doorOpen = Math.floor(Math.random() * unclaimed.length);

  let unopened = (new Array(doors))
      .fill(null)
      .map((e, i) => i)
      .filter(e => e !== unclaimed[doorOpen])
      .filter(e => e !== contestant);

  let doorSwitch = Math.floor(Math.random() * unopened.length);
  let change = unopened[doorSwitch];
  console.log(`  Monty opens ${unclaimed[doorOpen]}, change to ${change}?`);

  if (strategySwitch) {
    // He then says to you, "Do you want to pick door No. 2?" Is it to
    // your advantage to switch your choice?
    console.log(`  Switching choice from ${contestant} to ${change}`);
    contestant = change;
  } else {
    console.log(`  Retaining original choice from ${contestant}`);
  }

  let contestantWin = false;
  if (contestant === winner) {
    contestantWin = true;
  }
  console.log(`  Contestant wins: ${contestantWin} (${contestant} vs. ${winner})`);
  contestantWins.push(contestantWin);
}

let report = contestantWins.reduce((p, c) => {
  if (c) {
    p.wins++;
  } else {
    p.losses++;
  }
  return p;
}, {wins: 0, losses: 0});

console.log(JSON.stringify(report, null, '  '));
