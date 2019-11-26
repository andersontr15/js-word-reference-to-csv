const fs = require("fs");
const { WordReferenceUtils } = require("./WordReferenceUtils");
const { DEBOUNCE_DURATION, FORMATS, INPUT_FILE } = require("./constants");

const wordReferenceToCsv = () => {
  fs.readFile(INPUT_FILE, FORMATS.UTF8, (err, data) => {
    if (err) throw err;
    if (data.length === 0)
      throw new Error("Must have at least one line in input.csv!");
    const lines = WordReferenceUtils.formatLines(data);
    const batches = WordReferenceUtils.createBatches(lines);
    let currentBatch = 0;
    batches[0].forEach(WordReferenceUtils.fetchData);
    currentBatch += 1;

    if (
      WordReferenceUtils.determineIfFinishedProcessing(currentBatch, batches)
    ) {
      return;
    } else {
      let interval;

      interval = setInterval(() => {
        batches[currentBatch].forEach(WordReferenceUtils.fetchData);
        if (
          WordReferenceUtils.determineIfFinishedProcessing(
            currentBatch,
            batches
          )
        ) {
          clearInterval(interval);
          return;
        }
        currentBatch += 1;
      }, DEBOUNCE_DURATION);
    }
  });
};

module.exports = {
  wordReferenceToCsv
};
