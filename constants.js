const path = require("path");

const LANGUAGE_FROM = "es";
const LANGUAGE_TO = "en";

const INPUT_FILE = path.resolve(__dirname, "input.csv");

const DEBOUNCE_DURATION = 8000;

const OUTPUT_FILE = path.resolve(__dirname, "output.csv");

const NO_RESULTS_FILE = path.resolve(__dirname, "no_results.csv");

const FORMATS = {
  UTF8: "utf8"
};

module.exports = {
  DEBOUNCE_DURATION,
  FORMATS,
  INPUT_FILE,
  LANGUAGE_FROM,
  LANGUAGE_TO,
  NO_RESULTS_FILE,
  OUTPUT_FILE
};
