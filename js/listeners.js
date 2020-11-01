// Event listeners and the functions needed for them

const START_STOP_BUTTON = document.getElementById('start-stop-button');

function clearGrid() {
    state.grid = createGrid('empty');
    if (isRunning) {
        toggleRunning()
    }
}

function toggleRunning() {
    isRunning = !isRunning;
    console.log('running state', isRunning);
    START_STOP_BUTTON.innerHTML = isRunning ? "stop" : "start";
    runSimulation();
}

function randomGrid() {
    isRunning = false;
    state.grid = createGrid('random');
}

document.body.onload = () => {
    state.grid = createGrid('random');

    setBasicStyles();
}
// using KeyboardMaster library (CAUTION: it was created by me)
document.body.addKeyBindings({
    seperator: '+',
    bindings: [{
        keyBinding: 'ctrl+c',
        action: clearGrid
    }, {
        keyBinding: 'space', // listener for space
        action: toggleRunning
    }, {
        keyBinding: "ctrl+x",
        action: randomGrid
    }]
})

KeyboardMaster.updateConfig({
    "mode": "production"
});

document.getElementById('start-stop-button').onclick = toggleRunning;
document.getElementById('clear-button').onclick = clearGrid;
document.getElementById('random-grid-button').onclick = randomGrid;