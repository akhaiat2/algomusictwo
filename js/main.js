/* global Tone */

const button = document.querySelector('button')
// Create a sampler to load and play drum samples
const sampler = new Tone.Sampler({
  A1: 'wav/kick.wav',
  A2: 'wav/snare.wav',
  A3: 'wav/clap.wav',
  A4: 'wav/hihat.wav'
}).toDestination()

// Create a drum pattern using a sequence
const drumPattern = new Tone.Pattern((time, note) => {
  sampler.triggerAttackRelease(note, '8n', time)
}, ['A1', 'A2', 'A3', 'A4'], 'randomOnce')

// Create a bass synth
const bassSynth = new Tone.MembraneSynth().toDestination()

// Create a bass pattern using a sequence
const bassPattern = new Tone.Pattern((time, note) => {
  bassSynth.triggerAttackRelease(note, '8n', time)
}, ['C2', 'E2', 'G2', 'A2'], 'up')

// Create a chord synth
const chordSynth = new Tone.PolySynth().toDestination()

// Create a chord progression
const chordProgression = ['C4', 'F4', 'G4', 'C5']

// Create a chord pattern using a sequence
const chordPattern = new Tone.Pattern((time, chord) => {
  chordSynth.triggerAttackRelease(chord, '4n', time)
}, chordProgression, 'random')

// Create a loop to repeat the drum pattern, bass pattern, and chord pattern
const loop = new Tone.Loop((time) => {
  drumPattern.start(time)
  bassPattern.start(time)
  chordPattern.start(time)
}, '4n')

button.addEventListener('click', () => {
  // Check if the audio context is in a suspended state
  if (Tone.context.state !== 'running') {
    // Resume the audio context on user gesture
    Tone.context.resume().then(() => {
      console.log('Audio context resumed')
      startLoop()
    })
  } else {
    startLoop()
  }
})

function startLoop () {
  // Load the drum samples and start the loop when samples are loaded
  Tone.loaded().then(() => {
    console.log('Samples loaded, should start loop')
    loop.start(0)
    Tone.Transport.start()
  })
}

// Load the drum samples
Tone.loaded().then(() => {
  console.log('Samples loaded')
})
