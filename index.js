const inputPiano = new Tone.Synth().toDestination();
const chordPiano = new Tone.PolySynth(Tone.Synth).toDestination();
const keys = document.querySelectorAll('.key');

let selectedKeys = []
let activeCount = 0
const maxCount = 4

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

    // Todo: Make sure that you have picked the maxCount of keys
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
    }, 2 * 1000);

    activeCount = 0;
    document.querySelector('.hint').classList.remove('shown');

}


function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
  }
  