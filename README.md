#### Given the following problem:

There are 100 doors, all closed initially.
 * On pass #1, you toggle the state of every door.
 * On pass #2, you toggle the state of every second door.
 * On pass #3, you toggle the state of every third door.
 * On pass #4, you toggle the state of every fourth door.

...and so on former 100 passes.

All doors were initially closed; determine which doors are left open
at the end of 100 passes.

Initial Attempt
---------------

The initial version looked like this:

```
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
```
*doors.js*

This version gets the answer correct as can be verified with the following output.

From the command line, run:

    node showdoors 100


For display purposes here, I show a smaller set:

    node showdoors 30

This will display the following:

```
+--------------------------------------------------------------+
| Results (initial state to final state): 0 = closed, 1 = open |
+--------------------------------------------------------------+
[  0]  0000000000 0000000000 0000000000
[  1]  1111111111 1111111111 1111111111
[  2]  1010101010 1010101010 1010101010
[  3]  1000111000 1110001110 0011100011
[  4]  1001111100 1010011111 0010100111
[  5]  1001011101 1010111110 0010000110
[  6]  1001001101 1110111010 0011000111
[  7]  1001000101 1111111010 1011000011
[  8]  1001000001 1111101010 1010000011
[  9]  1001000011 1111101110 1010001011
[ 10]  1001000010 1111101111 1010001010
[ 11]  1001000010 0111101111 1110001010
[ 12]  1001000010 0011101111 1111001010
[ 13]  1001000010 0001101111 1111011010
[ 14]  1001000010 0000101111 1111011110
[ 15]  1001000010 0000001111 1111011111
[ 16]  1001000010 0000011111 1111011111
[ 17]  1001000010 0000010111 1111011111
[ 18]  1001000010 0000010011 1111011111
[ 19]  1001000010 0000010001 1111011111
[ 20]  1001000010 0000010000 1111011111
[ 21]  1001000010 0000010000 0111011111
[ 22]  1001000010 0000010000 0011011111
[ 23]  1001000010 0000010000 0001011111
[ 24]  1001000010 0000010000 0000011111
[ 25]  1001000010 0000010000 0000111111
[ 26]  1001000010 0000010000 0000101111
[ 27]  1001000010 0000010000 0000100111
[ 28]  1001000010 0000010000 0000100011
[ 29]  1001000010 0000010000 0000100001
[ 30]  1001000010 0000010000 0000100000
```

Optimizing
----------

The problem with the previous attempt is that the algorithm has `O(n^2)` performance characteristics. The algorithm examines doors multiple times with a loop inside of a loop. Ideally, this can be optimized.

### Optimization Attempt #1

In examining the output, there is a pattern. The number of doors that remain in the initial state increase as a function of each loop iteration. For example, for the first pass when i == 0, doors[0] will end up in a toggled state, followed by two doors that remain in the initial state. On the next pass for i = 1, the next door in the sequence (doors[3]) will be left in a toggled state, and the next four doors will remain in the inital state. The function is: `(2 * i) + 2`.

Here is the code:

```
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
```

I wrote a test to confirm that the results matched the results of the baseline algorithm, and then I compared the performance. To get enough results for the comparison, I used 100000 doors instead of 100.

```
The optimized versions returned the same results as the baseline version
toggleDoors1 took 301ms
toggleDoors2 took 93ms
optimized1 version performed in 30.9% of the time taken by the O(n^2) version
optimized1 version is 3.2 times faster the O(n^2) version
```

The optimized version clearly performs better than the naive attempt.

### Optimization Attempt #2

In examining the output more closely, I noticed another pattern. If I considered the final door states using a 1-based index, I realized that an element whose 1-based index had an integer square root always ended up in the toggled state; all other doors remained in their initial state.

I wrote another version to test this:

```
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
```

And then I compared the results for all of the versions:

```
The optimized versions returned the same results as the baseline version

toggleDoors1 took 301ms
toggleDoors2 took 93ms
toggleDoors3 took 124ms

optimized1 version performed in 30.9% of the time taken by the O(n^2) version
optimized1 version is 3.2 times faster the O(n^2) version

optimized2 version performed in 41.2% of the time taken by the O(n^2) version
optimized2 version is 2.4 times faster the O(n^2) version
```

Although the third version very succinctly determines the door states as a function of whether or not an element's 1-based index had an integer square root, its performance was actually not as good as my second attempt.

### Optimization Attempt #3

I thought the Math.sqrt function might be what was slowing down the optimization effort, so I decided to prepopulate a cache of all the square roots for the number of doors being tested.

The next version of the algorithm looks like this:

```
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
```

However, even when I increased the number of doors to 10,000,000 the performance was only marginally better:

```
The optimized versions returned the same results as the baseline version
toggleDoors1 took 3655ms
toggleDoors2 took 607ms
toggleDoors3 took 608ms
toggleDoors4 took 557ms

optimized1 version performed in 16.6% of the time taken by the O(n^2) version
optimized1 version is 6.0 times faster the O(n^2) version

optimized2 version performed in 16.6% of the time taken by the O(n^2) version
optimized2 version is 6.0 times faster the O(n^2) version

optimized3 version performed in 15.2% of the time taken by the O(n^2) version
optimized3 version is 6.6 times faster the O(n^2) version
```

Add to the fact that we are also consuming memory with the cache, this marginal increase in performance is not worth it.

Conclusion
----------
For best performance, `toggleDoors2` (the first optimization attempt) is the best choice for both time and space. However, for succincly expressing the mathematical function that determines door states, `toggleDoors3` (the second optimization attempt) provides performance that is almost as good. Unless performance was absolutely critical, a strong argument can be made for favoring this version based on readability and maintenance. The third optimization attempt, which propopulated a cache to indicate element positions that have integer square roots, barely improved performance while increasing space requirements.
