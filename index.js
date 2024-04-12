const inputPiano = new Tone.Synth().toDestination();
const chordPiano = new Tone.PolySynth(Tone.Synth, {
	"volume": 0,
	"detune": 0,
	"portamento": 0,
	"envelope": {
		"attack": 0.005,
		"attackCurve": "linear",
		"decay": 0.1,
		"decayCurve": "exponential",
		"release": 1,
		"releaseCurve": "exponential",
		"sustain": 0.3
	},
	"oscillator": {
		"partialCount": 0,
		"partials": [],
		"phase": 0,
		"type": "triangle"
	}
}).toDestination();
const keys = document.querySelectorAll('.key');
const game = document.getElementById('game');
let selectedKeys = []
let activeCount = 0
let tempAnswerPlayer = ["Db4", "F4", "Ab4", "Eb5"];
const maxCount = 4

drawGrid(game);



const state = {
    grid: Array(6)
        .fill()
        .map(() => Array(maxCount + 1).fill('')),
    currentRow: 0,
    currentCol: 0,
};




keys.forEach(key => {
    key.addEventListener('click', () => playNote(key))
})

function playChord(row)
{
    if (row == 0)
    {
        chordPiano.triggerAttackRelease(tempAnswerPlayer, "8n");
    }
    else
    {
        row--;
        const now = Tone.now();
        for (let i = 0; i < maxCount; i++) {
            timeSkew = i * (1/maxCount) // s;
            console.log(`playing ${state.grid[row][i]}`)
            chordPiano.triggerAttack(state.grid[row][i], now + timeSkew);
        }
        chordPiano.triggerRelease(state.grid[row], now + 2);
    }
}

function playNote(key) {
    // Toggle active
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
            state.grid[state.currentRow][state.currentCol] = key.dataset.note;
            state.currentCol++;
            updateGrid();
            checkRow(state.currentRow);
            
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

    if (col == maxCount){
        // Add the play
        box.addEventListener('click', () => playChord(row+1))
        box.style.border = "0px solid";
    }
    box.textContent = note;


    container.appendChild(box);
    return box;
}

function drawGrid(container) {
    const grid = document.createElement('div');
    grid.className = 'grid';

    for (let i = 0; i < 6; i++)
    {
        for (let j = 0; j < maxCount + 1; j++)
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
            box.textContent = state.grid[i][j].substring(0, state.grid[i][j].length - 1);
        }
    }
}

function checkRow(row) {
    for (let i = 0; i < maxCount; i++)
    {
        const box = document.getElementById(`box${row}${i}`);
        if (state.grid[row][i] == tempAnswerPlayer[i])
        {
            box.classList.add("right");
        }
        else if (tempAnswerPlayer.includes(state.grid[row][i])) 
        {
            // WARNING: IF MORE OCTAVES ARE ADDED THIS may NOT WORK!!!!!!! YOU HAVE TO COUNT!!!!
            box.classList.add("wrong")
        }
        else 
        {
            box.classList.add("empty");
        }
    }
    // Add the play
    const box = document.getElementById(`box${row}${maxCount}`);
    box.textContent = "▶️";

}
