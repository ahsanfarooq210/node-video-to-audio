const ffmpeg = require("fluent-ffmpeg");
const ffmpegPath = require("ffmpeg-static");
const path = require("path");
const fs = require("fs");
const axios = require("axios");
const FormData = require("form-data");

// Set the path to the ffmpeg binary
const extractAudio = () => {
  ffmpeg.setFfmpegPath(ffmpegPath);

  const inputVideoPath = path.resolve("./english-talk.mp4"); // Replace with your input video file path
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
      extractText();
    })
    .on("error", (err) => {
      console.error("Error:", err);
    })
    .save(outputAudioPath);

  console.log("Extracting audio...");
};

const extractText = () => {
  const API_KEY = "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"; // Replace with your OpenAI API key
  const FILE_PATH = path.resolve("./output-audio.mp3");

  const form = new FormData();
  form.append("file", fs.createReadStream(FILE_PATH));
  form.append("model", "whisper-1");

  const config = {
    headers: {
      Authorization: `Bearer ${API_KEY}`,
      ...form.getHeaders(),
    },
  };

  axios
    .post("https://api.openai.com/v1/audio/transcriptions", form, config)
    .then((response) => {
      console.log(response.data);
    })
    .catch((error) => {
      console.error(error);
    });
};

extractAudio();
