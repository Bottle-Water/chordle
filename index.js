const inputPiano = new Tone.Synth().toDestination();

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
