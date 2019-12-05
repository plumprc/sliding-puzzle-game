var goalState = [0, 1, 2, 3, 4, 5, 6, 7, 8];
var path = [];
var hash = {},
    openList = [],
    startTime,
    endTime,
    solved = false,
    steps = 0,
    counter = 100,
    counted = 0,
    checked = 0;

function initParam() {
    hash = {},
    openList = [],
    startTime,
    endTime,
    solved = false,
    steps = 0,
    counter = 100,
    counted = 0,
    checked = 0;
    path = [];
}

// 逆序数奇偶性
function checkSolvable(state) {
  var pos = state.indexOf(8);
  var _state = state.slice();
  _state.splice(pos,1);
  var count = 0;
  for (var i = 0; i < _state.length; i++) {
    for (var j = i + 1; j < _state.length; j++) {
      if (_state[i] > _state[j]) {
        count++;
      }
    }
  }
  return (count & 1) === 0;
}

// 确保打乱后的拼图一定有解
function shuffle(state) {
  var _state = state.slice();
  shuffle_arr(_state);
  if(!checkSolvable(_state)) {
      swap(_state, 0, 1);
  }
  console.log('Puzzle to solve: [' + _state + ']');
  return _state;
}

function shuffle_arr(array) {
  var size = array.length;
  var rand;
  for (var i = 1; i < size; i += 1) {
    rand = Math.round(Math.random() * i);
    swap(array, rand, i);
  }
  return array;
}

function swap(state, from, to) {
  var _ = state[from];
  state[from] = state[to];
  state[to] = _;
}

function statesPer100Millisecond() {
  var now = new Date();
  if (now.getTime() - startTime.getTime() >= counter) {
    console.log('counted', counter, checked - counted);
    counted = checked;
    counter += 100;
  }
}

function move(state, successors, pos, steps) {
  var _state, newState;
  newState = state.slice();
  swap(newState, pos, pos + steps);
  if (!compare(newState, state.prev)) {
      _state = newState.join('');
      if (typeof hash[_state] === 'undefined') {
          hash[_state] = newState;
          newState.prev = state;
          newState.manhanttanDistance = calcManhanttanDistance(newState);
          newState.levels = newState.prev.levels + 1;
          successors.push(newState);
      }
  }
}

function compare(arr1, arr2) {
  if (!arr1 || !arr2) {
    return false;
  }

  for (var i = 0; i < arr1.length; i++) {
    if (arr1[i] !== arr2[i]) {
      return false;
    }
  }
  return true;
}

function getSuccessors(state) {
    let successors = [];
    let pos = state.indexOf(8);
    let row = Math.floor(pos / 3);
    let col = pos % 3;
    if (row > 0) {
        //move up
        move(state, successors, pos, -3);
    }
    if (col > 0) {
        //move left
        move(state, successors, pos, -1);
    }
    if (row < 2) {
        //move down
        move(state, successors, pos, 3);
    }
    if (col < 2) {
        //move right
        move(state, successors, pos, 1);
    }
    return successors;
}

function moveDis(i, j) {
    let realCol = j % 3;
    let realRow = Math.floor(j / 3);
    let col = i % 3;
    let row = Math.floor(i / 3);
    return (Math.abs(realCol - col) + Math.abs(realRow - row));
}

// h(x)，曼哈顿距离，一定小于真实步长，可以收敛
function calcManhanttanDistance(state) {
    let totalDist = 0;
    for (let i = 0; i < state.length - 1; i++) {
        if (state[i] !== 0) {
            let realPos = goalState.indexOf(state[i]);
            totalDist += moveDis(i, realPos);
        }
    }
    return totalDist;
}

function collateSteps(state) {
  var t = state.splice(0, 9);
  console.log(t);
  path.push(t);
  steps++;
  if (!state.prev) {
    console.log(state, steps);
    return state;
  }

  collateSteps(state.prev);
}

function aStarSearch(state) {
  state.levels = 0;
  state.prev = null;
  openList.push(state);
  while (solved !== true) {
    var currentState = openList.shift();
    checked++;
    statesPer100Millisecond();
    var successors = getSuccessors(currentState);
    for (var i = 0; i < successors.length; i++) {
      if (compare(goalState, successors[i])) {
        solved = true;
        collateSteps(successors[i]);
        break;
      } else {
        heap(openList, successors[i]);
      }
    }
  }
}

function parent(index) {
  return Math.floor((index - 1) / 2);
}

function heap(state, successor) {
  state.push(successor);
  var node = state.length - 1;
  while (parent(node) >= 0 && node > 0) {
    var parentElement = state[parent(node)];
    var currentElement = state[node];
    var totalWeightA = parentElement.manhanttanDistance + parentElement.levels;
    var totalWeightB = currentElement.manhanttanDistance + currentElement.levels;
    if (totalWeightA >= totalWeightB) {
      swap(state, parent(node), node);
      node = parent(node);
      continue;
    }
    break;
  }
}