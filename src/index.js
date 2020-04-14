// import React from 'react';
// import ReactDOM from 'react-dom';
// import App from './components/App';
import Module from '../modules/artifacts/peppermint.js';

const Instance = Module();

const state = {};

const channels = 2;
const bitRate = 64;
const sampleRate = 44100;
Instance.onRuntimeInitialized = () => {
  state.encoder = Instance._encoder_create(sampleRate, channels, bitRate);
};

// ReactDOM.render(<App />, document.getElementById('root'));
