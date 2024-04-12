const inputPiano = new Tone.Synth().toDestination();

const keys = document.querySelectorAll('.key');

let selectedKeys = []

keys.forEach(key => {
    key.addEventListener('click', () => playNote(key))
})

function playNote(key) {
    
    pitch = key.dataset.note;
    inputPiano.triggerAttackRelease(pitch, "8n");
}
