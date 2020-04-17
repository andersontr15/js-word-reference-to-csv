const fs = require("fs");
const { WordReferenceUtils } = require("./WordReferenceUtils");
const { DEBOUNCE_DURATION, FORMATS, INPUT_FILE } = require("./constants");

const formatProcessArgv = argv => {
  const [key, value] = argv.split('=')
  return {
    [key]: value,
    value
  }
}


const wordReferenceToCsv = () => {

  fs.readFile(INPUT_FILE, FORMATS.UTF8, (err, data) => {
    let sourceLanguage;
    let targetLanguage;
    try {
       sourceLanguage = formatProcessArgv(process.argv[2]);
       targetLanguage = formatProcessArgv(process.argv[3]);
    }
    catch(err) {
      throw new Error('Must enter source and target language')
    }
    if (err) throw err;
    if (data.length === 0)
      throw new Error("Must have at least one line in input.csv!");
    const lines = WordReferenceUtils.formatLines(data);
    const batches = WordReferenceUtils.createBatches(lines);
    let currentBatch = 0;
    batches[0].forEach(line => WordReferenceUtils.fetchData({ line, sourceLanguage: sourceLanguage.value, targetLanguage: targetLanguage.value }));
    currentBatch += 1;

    if (
      WordReferenceUtils.determineIfFinishedProcessing(currentBatch, batches)
    ) {
      return;
    } else {
      let interval;

      interval = setInterval(() => {
        batches[currentBatch].forEach(line => WordReferenceUtils.fetchData({ line, sourceLanguage: sourceLanguage.value, targetLanguage: targetLanguage.value }));
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

wordReferenceToCsv();

module.exports = {
  wordReferenceToCsv
};
