const numCols = 50;
const numRows = 25;
const timeInterval = 200;
const CHILD_ID = {
	generate: (x, y) => `child-${x}-${y}`,
	getPosition: (childId) => {
		return childId.split('-').slice(1);
	}
}

// let grid = [];
let isRunning = false;

const baseState = {
	grid: []
}
const stateHandler = {
	set: function (target, property, value) {
		target[property] = value;
		if (property === 'grid') {
			updateGrid(value);
		}
		return true;
	}
}

const state = new Proxy(baseState, stateHandler);

document.body.onload = () => {
	state.grid = createGrid('random');

	setBasicStyles();
}

document.body.addKeyBindings({
	seperator: '+',
	bindings: [{
		keyBinding: 'ctrl+c',
		action: () => {
			state.grid = createGrid('empty');
		}
	}, {
		keyBinding: ' ', // listener for space
		action: () => {
			isRunning = !isRunning;
			console.log('running state', isRunning);
			runSimulation();
		}
	}]
})

/**
 * Creates the grid
 * @param {"empty" | "random"} type
 */
function createGrid(type = 'empty') {
	return new Array(numRows).fill(0).map(row => {
		let x = new Array(numCols).fill(0);
		return type === "random" ? x.map(v => Math.random() > 0.5 ? 0 : 1) : x;
	});
}

function setBasicStyles() {
	document.documentElement.style = `--num-cols: ${numCols}; --num-rows: ${numRows}`;
}

function getAliveNeighbourCount(_grid, [i, j]) {
	const operations = [
		[0, -1],
		[0, 1],
		[-1, -1],
		[-1, 0],
		[-1, 1],
		[1, -1],
		[1, 0],
		[1, 1],
	]

	let neighbourCount = 0;
	operations.forEach(([x, y]) => {
		let newI = i + x;
		let newJ = j + y;

		if (newI >= 0 && newJ >= 0 && newI < numRows && newJ < numCols) {
			if (_grid[newI][newJ]) {
				neighbourCount += 1;
			}
		}
	})
	return neighbourCount;
}

function runSimulation() {
	if (!isRunning) return;

	// {childx: 1, childy: 2, value: 0}[]
	let changes = [];

	for (let i = 0; i < numRows; i++) {
		for (let j = 0; j < numCols; j++) {
			let neighbourCount = getAliveNeighbourCount(state.grid, [i, j]);
			let newValue = 0

			// if (neighbourCount < 2) newValue = 0;
			if (neighbourCount == 3) newValue = 1;
			if (neighbourCount == 2) newValue = state.grid[i][j];

			if (state.grid[i][j] != newValue) {
				changes.push({
					childX: i,
					childY: j,
					value: newValue
				})
			}
		}
	}
	changes.forEach(({ childX, childY, value }) => {
		updateChild(state.grid, childX, childY, value);
	})
	// updateChild(state.grid, i, j, newValue);

	setTimeout(runSimulation, timeInterval);
}

function updateChild(_grid, x, y, newValue) {
	_grid[x][y] = newValue;

	let child = document.getElementById(CHILD_ID.generate(x, y));

	child.classList.remove(_grid[x][y] ? 'dead' : 'alive');
	child.classList.add(_grid[x][y] ? 'alive' : 'dead');
}

function updateGrid(_grid) {
	const container = document.getElementById('container');
	container.innerHTML = '';

	let childArray = [];

	_grid.forEach((row, i) => {
		row.forEach((column, j) => {
			const div = document.createElement('div');
			div.id = CHILD_ID.generate(i, j);
			div.classList.add('child');

			if (_grid[i][j]) {
				div.classList.add('alive');
			} else div.classList.add('dead');

			div.onmousedown = () => {
				updateChild(_grid, i, j, _grid[i][j] ? 0 : 1);
				// _grid[i][j] = _grid[i][j] ? 0 : 1;
			}

			childArray.push(div);
		})
	})

	container.append(...childArray);

}
