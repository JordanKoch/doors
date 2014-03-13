/*
There are 100 doors, all closed initially.
On pass #1, you toggle the state of every door.
On pass #2, you toggle the state of every second door.
On pass #3, you toggle the state of every third door.
On pass #4, you toggle the state of every fourth door...
...and so on, until completing 100 passes

All doors were initially closed; which doors are left open
at the end of 100 passes.

*/

var assert = require('assert');

var count = 10000000;
var initialState = false; // closed

var squareroots = [];
initializeSquareRoots(count);

// ensure that our optimized version returns the same results
// as our baseline unoptimized O(n^2) version (which was already
// tested and verified separately)

var expected = toggleDoors1(count, initialState);
var optimized1 = toggleDoors2(count, initialState);
var optimized2 = toggleDoors3(count, initialState);
var optimized3 = toggleDoors4(count, initialState);


for (var i = 0; i < count; i++) {
  assert.equal(optimized1[i], expected[i], '(optimized1) failed at doors[' + i + ']');
}

for (var i = 0; i < count; i++) {
  assert.equal(optimized2[i], expected[i], '(optimized2) failed at doors[' + i + ']');
}

for (var i = 0; i < count; i++) {
  assert.equal(optimized3[i], expected[i], '(optimized3) failed at doors[' + i + ']');
}

console.log('The optimized versions returned the same results as the baseline version');

// measure the performance of the two versions

var t1 = measureFunction(function() {
  toggleDoors1(count, initialState);
});

var t2 = measureFunction(function() {
  toggleDoors2(count, initialState);
});

var t3 = measureFunction(function() {
  toggleDoors3(count, initialState);
});

var t4 = measureFunction(function() {
  toggleDoors4(count, initialState);
});

console.log('toggleDoors1 took ' + t1 + 'ms');
console.log('toggleDoors2 took ' + t2 + 'ms');
console.log('toggleDoors3 took ' + t3 + 'ms');
console.log('toggleDoors4 took ' + t4 + 'ms');

var savings1 = ((t2 / t1) * 100).toFixed(1);
var performance1 = (t1 / t2).toFixed(1);

var savings2 = ((t3 / t1) * 100).toFixed(1);
var performance2 = (t1 / t3).toFixed(1);

var savings3 = ((t4 / t1) * 100).toFixed(1);
var performance3 = (t1 / t4).toFixed(1);

console.log();

console.log('optimized1 version performed in ' + savings1 + '% of the time taken by the O(n^2) version');
console.log('optimized1 version is ' + performance1 + ' times faster the O(n^2) version');

console.log();

console.log('optimized2 version performed in ' + savings2 + '% of the time taken by the O(n^2) version');
console.log('optimized2 version is ' + performance2 + ' times faster the O(n^2) version');

console.log();

console.log('optimized3 version performed in ' + savings3 + '% of the time taken by the O(n^2) version');
console.log('optimized3 version is ' + performance3 + ' times faster the O(n^2) version');

// ----------------------------------------------------------------------------

// executes the given function and returns the elapsed time
function measureFunction(fn) {
  var start = (new Date()).getTime();
  fn();
  return (new Date()).getTime() - start;
}


// return an intialized array;
// initialState: false for closed, true for open
function createDoorsArray(count, initialState) {
  var doors = new Array(count);
  for (var i = 0; i < count; i++) {
    doors[i] = initialState;
  }
  return doors;
}


// this is the unoptimized O(n^2) baseline function
function toggleDoors1(count, initialState) {
  var doors = createDoorsArray(count, initialState);
  var i, current = 0;

  for (i = 0; i < count; i++) {
    current = i;

    while (current < count) {
      doors[current] = !doors[current];
      current += i + 1;
    }
  }

  return doors;
}


// in this version, we never look at the same element twice;
// although there is an inner loop, this is not an O(n^2) algorithm
// because all the inner loop does is advance the element index by
// an increasing amount as it passes through the array one time;
// the outer loop ensure that we do not advance beyond the array bounds.
function toggleDoors2(count, initialState) {
  var doors = createDoorsArray(count, initialState);
  var i = 0;

  // the current array element index
  var current = 0;

  while (current < count) {

    // these elements always end up in the opposite state
    doors[current] = !initialState;
    current++;

    // an increasing number of elements always remain in the same state
    current += (2 * i) + 2;

    // in our optimized version, we don't need to execute multiple
    // passes over the array, but i is incremented as if we were
    // passing over count times; for example, with an array of
    // 100 elements, we would pass over the array 100 times
    i++;
  }

  return doors;
}


// after observing results, it became apparent that the elements whose
// 1-based index had a square root always ended up
// in the opposite state,
// while all other elements were left in the initial state.
function toggleDoors3(count, initialState) {
  var doors = createDoorsArray(count, initialState);

  while (count > 0) {
    if (Math.sqrt(count) % 1 === 0) {
      doors[count - 1] = !initialState;
    }

    count--;
  }

  return doors;
}


// after observing results, it became apparent that the elements whose
// 1-based index had a square root always ended up
// in the opposite state,
// while all other elements were left in the initial state.
function toggleDoors4(count, initialState) {
  var doors = createDoorsArray(count, initialState);

  while (count > 0) {
    if (squareroots[count]) {
      doors[count - 1] = !initialState;
    }

    count--;
  }

  return doors;
}

// squareroots is prepopulated with all the square roots
// for the number of doors that will be inspected before
// toggleDoors4 gets called
function initializeSquareRoots(count) {
  while (count > 0) {
    squareroots[count] = (Math.sqrt(count) % 1 === 0) ? true : false;
    count--;
  }
}
