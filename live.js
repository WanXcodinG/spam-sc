const ffmpeg = require('fluent-ffmpeg');
const readline = require('readline');
const fs = require('fs');

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

// Read the data from data.txt
fs.readFile('data.txt', 'utf8', (err, data) => {
  if (err) {
    console.error('Error:', err);
    rl.close();
    return;
  }

  // Extract the RTMP link and stream key from the data
  const regex = /RTMP link and Stream KEY: (.+)\nEnter Video Name: (.+)/s;
  const matches = data.match(regex);
  if (matches && matches.length === 3) {
    const rtmpLink = matches[1];
    const inputVideo = matches[2];

    ffmpeg()
      .input(inputVideo)
      .inputOptions(['-stream_loop -1'])
      .videoCodec('libx264')
      .audioCodec('aac')
      .outputOptions(['-preset veryfast', '-r 30', '-b:v 2000k'])
      .withOutputFormat('flv')
      .output(rtmpLink)
      .on('end', () => {
        console.log('Stream ended');
        rl.close();
      })
      .on('error', (err) => {
        console.error('Error:', err);
        rl.close();
      })
      .on('progress', (progress) => {
        console.log('Frames: ' + progress.frames);
      })
      .run();
  } else {
    console.error('Invalid data.txt format');
    rl.close();
  }
});