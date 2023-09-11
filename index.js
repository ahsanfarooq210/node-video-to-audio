const ffmpeg = require("fluent-ffmpeg");
const ffmpegPath = require("ffmpeg-static");
const path = require("path");
const fs = require("fs");

// Set the path to the ffmpeg binary
ffmpeg.setFfmpegPath(ffmpegPath);

const inputVideoPath = path.resolve("./sample-vido.mp4"); // Replace with your input video file path
const outputAudioPath = path.resolve("./output-audio.mp3"); // Replace with the desired output audio file path

// Check if the input video file exists
if (!fs.existsSync(inputVideoPath)) {
  console.error(`Input video file not found at path: ${inputVideoPath}`);
  process.exit(1);
}

// Execute FFmpeg command to extract audio
ffmpeg()
  .input(inputVideoPath)
  .audioCodec("libmp3lame") // Specify the audio codec (e.g., libmp3lame for MP3)
  .toFormat("mp3") // Specify the output audio format (e.g., mp3)
  .on("end", () => {
    console.log("Audio extraction finished.");
  })
  .on("error", (err) => {
    console.error("Error:", err);
  })
  .save(outputAudioPath);

console.log("Extracting audio...");
