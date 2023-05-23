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
  sampler.triggerAttackRelease(note, '4n', time)
}, ['A1', 'A2', 'A3', 'A4'], 'randomOnce')

// Create a bass synth
const bassSynth = new Tone.MembraneSynth().toDestination()

// Create a bass pattern using a sequence
const bassPattern = new Tone.Pattern((time, note) => {
  bassSynth.triggerAttackRelease(note, '4n', time)
}, ['C2', 'E2', 'G2', 'A2'], 'random')

// Create a chord synth
const chordSynth = new Tone.PolySynth().toDestination()

// Create a chord progression
// const chordProgression = ['C4', 'F4', 'G4', 'C5']
const chordProgression = ['F4m', 'A#4', 'D#4', 'G#4', 'C#4', 'F4m', 'A#4', 'D#4']

// Create a chord pattern using a sequence
const chordPattern = new Tone.Pattern((time, chord) => {
  chordSynth.triggerAttackRelease(chord, '4n', time)
}, chordProgression, 'random')

// Create an array of vocal samples
const vocalSamples = [
  'wav/vocal1.wav'
]

// Create a vocal sample player
const vocalPlayer = new Tone.Player().toDestination()

// Create a loop to repeat the drum pattern, bass pattern, and chord pattern
const loop = new Tone.Loop((time) => {
  drumPattern.start(time)
  bassPattern.start(time)
  chordPattern.start(time)

  // Randomly select a vocal sample
  const randomIndex = Math.floor(Math.random() * vocalSamples.length)
  const vocalSample = vocalSamples[randomIndex]
  vocalPlayer.load(vocalSample, () => {
    vocalPlayer.start(time)
  })
}, '4n')

let isLoopRunning = false

button.addEventListener('click', () => {
  // Check if the audio context is in a suspended state
  if (Tone.context.state !== 'running') {
    // Resume the audio context on user gesture
    Tone.context.resume().then(() => {
      console.log('Audio context resumed')
      toggleLoop()
    })
  } else {
    toggleLoop()
  }
})

function toggleLoop () {
  if (isLoopRunning) {
    Tone.Transport.stop()
    isLoopRunning = false
    button.textContent = 'Start the Song'
    console.log('loop stopped')
  } else {
    // Generate a random BPM within the range of 120-140
    const randomBPM = Math.floor(Math.random() * (140 - 120 + 1) + 140)

    // Set the BPM for the loop
    Tone.Transport.bpm.value = randomBPM
    console.log(randomBPM + ' bpm')

    // Load the drum samples and start the loop when samples are loaded
    Tone.loaded().then(() => {
      console.log('Samples loaded, should start loop')
      loop.start(0)
      Tone.Transport.start()
      isLoopRunning = true
      button.textContent = 'Stop the Song'
      console.log('Loop start')
    })
  }
}

// Load the drum samples
Tone.loaded().then(() => {
  console.log('Samples loaded')
})
