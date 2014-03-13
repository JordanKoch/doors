// Simple program that expects a count option;
// an array to hold count number of doors will
// will be initialized with all elements set to
// the closed state, represented by a value of
// false; the program will then display the
// door states as it iterates over the array
// for a number of passes equal to the count.


var args = process.argv.slice(2);

// ensure command line argument was supplied
if (args.length == 0) {
  printUsageAndExit()
}

var arg = args[0];

// ensure argument only contains digits
if (!/^\d+$/.test(arg)) {
  printUsageAndExit();
}

var count = parseInt(arg, 10);

// ensure arg value is > 0
if (count < 1) {
  printUsageAndExit();
}

// create array, set initial state for each door to closed (false)
// then iterate the array and display results
toggleDoors(count, false);


// ----------------------------------------------------------------------------

function printUsageAndExit() {
  console.log('Usage: showdoors <count>');
  console.log('count must be an integer greater than 0');
  console.log('Ex: showdoors 100');
  process.exit(1);
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
function toggleDoors(count, initialState) {
  var doors = createDoorsArray(count, initialState);
  var i = 0;
  var current = 0;

  // print starting state
  console.log('+--------------------------------------------------------------+');
  console.log('| Results (initial state to final state): 0 = closed, 1 = open |');
  console.log('+--------------------------------------------------------------+');
  printdoors(0, doors);

  // this is the baeline unoptimized O(n^2) loop within a loop algorithm
  for (i = 0; i < count; i++) {
    console.log();
    current = i;

    while (current < count) {
      doors[current] = !doors[current];
      current += i + 1;
    }

    // 1-based index for displaying the current iteration
    printdoors(i+1, doors);
  }
  console.log();
}

// prints the door states for a given array iteration
function printdoors(iteration, doors) {
  var leading = iteration < 100 ? ' ' : '';
  leading += iteration < 10 ? ' ' : '';

  process.stdout.write('[' + leading + iteration + '] ');

  for (var i = 0; i < doors.length; i++) {
    // separator between groups of ten
    if (i % 10 == 0) process.stdout.write(' ');
    process.stdout.write(doors[i] ? '1': '0');
  }
}

