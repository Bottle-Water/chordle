const inputPiano = new Tone.Synth().toDestination();
const chordPiano = new Tone.PolySynth(Tone.Synth).toDestination();
const keys = document.querySelectorAll('.key');
const game = document.getElementById('game');
let selectedKeys = []
let activeCount = 0
const maxCount = 4

drawGrid(game);

const state = {
    grid: Array(6)
        .fill()
        .map(() => Array(maxCount).fill('')),
    currentRow: 0,
    currentCol: 0,
};




keys.forEach(key => {
    key.addEventListener('click', () => playNote(key))
})

function playNote(key) {
    // Toggle active
    console.log(activeCount);
    if (key.classList.contains('active'))
    {
        key.classList.remove('active');
        activeCount--;
    }
    else if (activeCount < 4)
    {
        key.classList.add('active');
        activeCount++;
        pitch = key.dataset.note;
        inputPiano.triggerAttackRelease(pitch, "8n");
    }
    else
    {
        inputPiano.triggerAttackRelease("C1", "32n");
    }

}

function submitGuess()
{
    state.currentCol = 0;
    const keys = document.querySelectorAll('.active');
    if (keys.length < maxCount)
    {
        inputPiano.triggerAttackRelease("C1", "32n");
        document.querySelector('.hint').classList.add('shown');
        return;
    }

    const now = Tone.now();
    let notes = []
    let i = 0;

    keys.forEach(key=> {
        timeSkew = i * (1/maxCount) // s;
        timeSkewMs = timeSkew * 1000 // ms;
        
        setTimeout(function() {
            key.classList.add('play');
            console.log(`${state.currentRow} is state row and i is ${i}`)
            
            // Strip the octave
            note = key.dataset.note;
            note = note.substring(0, note.length-1)

            state.grid[state.currentRow][state.currentCol] = note;
            console.log(state.grid);
            state.currentCol++;
            updateGrid();
            
          }, timeSkewMs);
        
        chordPiano.triggerAttack(key.dataset.note, now + timeSkew);
        notes.push(key.dataset.note);
        i++;
    })

    chordPiano.triggerRelease(notes, now + 2);

    setTimeout(function() {
        keys.forEach(key => {
            key.classList.remove('active');
            key.classList.remove('play');
            
        })
        state.currentRow++;
    }, 2 * 1000);

    activeCount = 0;
    document.querySelector('.hint').classList.remove('shown');

}


function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
  }
  

function drawBox(container, row, col, note ='')
{
    const box = document.createElement('div');
    box.className = 'box';
    box.id = `box${row}${col}`;
    box.textContent = note;

    container.appendChild(box);
    return box;
}

function drawGrid(container) {
    const grid = document.createElement('div');
    grid.className = 'grid';

    for (let i = 0; i < 6; i++)
    {
        for (let j = 0; j < maxCount; j++)
        {
            drawBox(grid, i, j);
        }
    }
    container.appendChild(grid);
}

function updateGrid() {
    for (let i = 0; i < state.grid.length; i++)
    {
        for (let j = 0; j < maxCount; j++)
        {
            
            const box = document.getElementById(`box${i}${j}`);
            console.log(`On box${i}${j}`)
            box.textContent = state.grid[i][j];
        }
    }
}

state.grid = Array(6)
    .fill()
    .map(() => Array(maxCount).fill(""));
updateGrid();