const inputSynth = new Tone.Synth().toDestination();
const chordSynth = new Tone.PolySynth(Tone.Synth, {
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

const chordPiano = new Tone.Sampler({
    urls: {
        A0: "A0.mp3",
        C1: "C1.mp3",
        "D#1": "Ds1.mp3",
        "F#1": "Fs1.mp3",
        A1: "A1.mp3",
        C2: "C2.mp3",
        "D#2": "Ds2.mp3",
        "F#2": "Fs2.mp3",
        A2: "A2.mp3",
        C3: "C3.mp3",
        "D#3": "Ds3.mp3",
        "F#3": "Fs3.mp3",
        A3: "A3.mp3",
        C4: "C4.mp3",
        "D#4": "Ds4.mp3",
        "F#4": "Fs4.mp3",
        A4: "A4.mp3",
        C5: "C5.mp3",
        "D#5": "Ds5.mp3",
        "F#5": "Fs5.mp3",
        A5: "A5.mp3",
        C6: "C6.mp3",
        "D#6": "Ds6.mp3",
        "F#6": "Fs6.mp3",
        A6: "A6.mp3",
        C7: "C7.mp3",
        "D#7": "Ds7.mp3",
        "F#7": "Fs7.mp3",
        A7: "A7.mp3",
        C8: "C8.mp3"
    },
    release: 1,
    baseUrl: "https://tonejs.github.io/audio/salamander/"
}).toDestination();

const inputPiano = chordPiano;


const enharmonics = [
    ["B2", "Cb3"],
    ["B#2", "C3"],
    ["C#3", "Db3"],
    ["D3"],
    ["D#3", "Eb3"],
    ["E3", "Fb3"],
    ["E#3", "F3"],
    ["F#3", "Gb3"],
    ["G3"],
    ["G#3", "Ab3"],
    ["A3"],
    ["A#3", "Bb3"],
    ["B3", "Cb4"],
    ["B#3", "C4"],
    ["C#4", "Db4"],
    ["D4"],
    ["D#4", "Eb4"],
    ["E4", "Fb4"],
    ["E#4", "F4"],
    ["F#4", "Gb4"],
    ["G4"],
    ["G#4", "Ab4"],
    ["A4"],
    ["A#4", "Bb4"],
    ["B4", "Cb5"],
    ["B#4", "C5"]
  ];


function findEnharmonicNotes(note, enharmonicArray) {
    for (let enharmonicGroup of enharmonicArray) {
      if (enharmonicGroup.includes(note)) {
        return enharmonicGroup;
      }
    }
    return null; // Return null if the note is not found
}
  
const keys = document.querySelectorAll('.key');
const game = document.getElementById('game');
let selectedKeys = []
let activeCount = 0;
let rightCount = 0;
let str = "";
let copyStr = "";
let tempAnswerPlayer = ["D3","Gb3", "A3", "D4"];

const voicing = [];

for (chord of Tonal.ChordType.all())
{
    if (chord.intervals.length == 4)
    {
        voicing.push(chord.aliases[0])
    }
}
// console.log(voicing)
const root = ["C3", "Db3", "D3", "Eb3", "E3", "F3", "Gb3", "G3", "Ab3", "A3", "Bb3", "B3"];
const maxCount = 4

drawGrid(game);
// console.log(random_item(voicing));
// console.log(random_item(root));
tempAnswerPlayer = Tonal.Chord.notes(random_item(voicing), random_item(root));
// console.log(tempAnswerPlayer);
todaysChord = (Tonal.Chord.detect(tempAnswerPlayer.map(string => string.slice(0, -1)))[0]);

function random_item(item) {
    var today = new Date();
    var dd = String(today.getDate()).padStart(2, '0');
    var mm = String(today.getMonth() + 1).padStart(2, '0'); //January is 0!
    var yy = String(today.getFullYear()).substring(2, );

    today = mm + dd + yy;
    const arng = new alea(today + 42);
    const randItem = item[Math.ceil( arng.quick() * item.length)]; 
    return randItem;
    
}

const state = {
    grid: Array(6)
        .fill()
        .map(() => Array(maxCount + 1).fill('')),
    currentRow: 0,
    currentCol: 0,
    ScoreGrid: Array(6)
    .fill()
    .map(() => Array(maxCount+1).fill('')),
    gameOver: false,
};




keys.forEach(key => {
    key.addEventListener('click', () => playNote(key))
})

function chordGen()
{

}

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

    if (state.gameOver)
    {
        return;
    }

    const now = Tone.now();
    let notes = []
    let i = 0;

    keys.forEach(key=> {
        timeSkew = i * (1/maxCount) // s;
        timeSkewMs = timeSkew * 1000 // ms;

        // change it so that if there is a note in the correct chord it will always display that version over the other.

        let keynote = key.dataset.note;
        enNotes = findEnharmonicNotes(keynote, enharmonics)
        if (enNotes)
        {
            // console.log(enNotes);
            for (note in tempAnswerPlayer)
            {
                // console.log(enNotes);
                // console.log(tempAnswerPlayer[note]);
                if(enNotes.includes(tempAnswerPlayer[note]))
                {
                    // console.log("Note from ANSWER! "+tempAnswerPlayer[note]);
                    keynote = tempAnswerPlayer[note];
                }
            }
        }
        
        setTimeout(function() {
            key.classList.add('play');
            state.grid[state.currentRow][state.currentCol] = keynote;
            state.currentCol++;
            updateGrid();
            checkRow(state.currentRow);
            
          }, timeSkewMs);
        
        chordPiano.triggerAttack(keynote, now + timeSkew);

        notes.push(keynote);
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
    rightCount = 0;
    for (let i = 0; i < maxCount; i++)
    {
        const box = document.getElementById(`box${row}${i}`);
        if (state.grid[row][i] == tempAnswerPlayer[i])
        {
            box.classList.add("right");
            rightCount++;
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
    box.textContent = `▶️`;

    // Pop up end screen at end
    if (rightCount == 4 || row == 5)
    {
        state.gameOver = true;
        setTimeout(function() {
            overlayOn();
            shareOn()
        }, 2000);
    }

}

// Post game sharing
function overlayOn()
{

    str = "";
    copyStr = "";
    state.ScoreGrid = Array(6)
        .fill()
        .map(() => Array(maxCount+1).fill(''));

    for (let i = 0; i < state.grid.length; i++)
    {
        for (let j = 0; j < maxCount; j++)
        {
            
            const box = document.getElementById(`box${i}${j}`);
            if (box.classList.contains('right'))
            {
                copyStr += "🟩";
                str += "🟩";
            }
            else if (box.classList.contains('wrong'))
            {
                copyStr += "🟨";
                str += "🟨";
            }
            else
            {
                copyStr += "⬛️";
                str += "⬛️";
            }
        }
        copyStr += "\r\n";
        str += "<br />";
    }
    copyStr = copyStr.substring(0, 10*state.currentRow); // trust me the emojis are 2 each
    str = str.substring(0, 14*state.currentRow); // trust me the emojis are 2 each

    if (state.currentRow == 6 && rightCount != 4)
    {
        str = "So close :( 6/6<br />" + str;
    }
    else
    {
        str = `You got it! ${state.currentRow}/6<br \>` + str;
    }
    str = `Chord: ${todaysChord}<br \>` + str;

    document.getElementById("overlay").style.display = "flex";
    document.getElementById("emojis").children[0].innerHTML = str;

}

function overlayOff()
{
    document.getElementById("overlay").style.display = "none";
}

function shareOn()
{
    document.getElementById("overlayButton").style.display = "block";
}

function copyScore()
{

    var today = new Date();
    var dd = String(today.getDate()).padStart(2, '0');
    var mm = String(today.getMonth() + 1).padStart(2, '0'); //January is 0!
    var yy = String(today.getFullYear()).substring(2, );

    today = mm + '/' + dd + '/' + yy;
    CopyText = `Chordle ${today} 🎹 ${state.currentRow}/6\r\n` + copyStr;

        // Copy the text inside the text field
    navigator.clipboard.writeText(CopyText);
    
    Toastify({
        text: "Score Copied!",
        offset: {
            y: 200
          },
        duration: 3000,
        gravity: "top", // `top` or `bottom`
        position: "center", // `left`, `center` or `right`
        stopOnFocus: true, // Prevents dismissing of toast on hover
        style: {
          background: "#00b09b",
        },
        onClick: function(){} // Callback after click
      }).showToast();

}
