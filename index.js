const fs = require("fs");
const { WordReferenceUtils } = require("./WordReferenceUtils");
const { DEBOUNCE_DURATION, FORMATS, INPUT_FILE, OUTPUT_FILE, NO_RESULTS_FILE } = require("./constants");

const formatProcessArgv = argv => {
  const [key, value] = argv.split('=')
  return {
    [key]: value,
    value
  }
}

const wordReferenceToCsv = async ({
  inputFile = INPUT_FILE,
  outputFile = OUTPUT_FILE,
  noResultsFile = NO_RESULTS_FILE,
  inputSourceLanguage,
  outputTargetLanguage,
  inputFormat = 'file',
  inputData = ''
}) => {
  if(!fs.existsSync(inputFile)) {
    console.error('Input file path doesn\'t exist.');
    return;
  }

  if(!fs.existsSync(outputFile)) {
    console.error('Input file path doesn\'t exist.');
    return;
  }

  if(!fs.existsSync(noResultsFile)) {
    console.error('No results file path doesn\'t exist.');
    return;
  }

  let sourceLanguage;
  let targetLanguage;
  try {
     sourceLanguage = inputSourceLanguage || formatProcessArgv(process.argv[2]);
     targetLanguage = outputTargetLanguage || formatProcessArgv(process.argv[3]);
  }
  catch(err) {
    throw new Error('Must enter source and target language')
  }

  if(inputFormat === 'string') {
      if (inputData.length === 0)
        throw new Error("inputData must not be empty.");
      const lines = WordReferenceUtils.formatLines(inputData);
      const batches = WordReferenceUtils.createBatches(lines);
      let currentBatch = 0;
      batches[0].forEach(line => WordReferenceUtils.fetchData({ line, sourceLanguage: sourceLanguage.value, targetLanguage: targetLanguage.value }));
      currentBatch += 1;
  
      if (
        WordReferenceUtils.determineIfFinishedProcessing(currentBatch, batches)
      ) {
        return {
          output: fs.readFileSync(outputFile, 'utf-8').split('\n')
        }
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
            return {
              output: fs.readFileSync(outputFile, 'utf-8').split('\n')
            }
          }
          currentBatch += 1;
        }, DEBOUNCE_DURATION);
      }
    return {
      output: fs.readFileSync(outputFile, 'utf-8').split('\n')
    };
  }
  else {
    fs.readFile(inputFile, FORMATS.UTF8, (err, data) => {
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
        return {
          output: fs.readFileSync(outputFile, 'utf-8').split('\n')
        };
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
            return {
              output: fs.readFileSync(outputFile, 'utf-8').split('\n')
            }
          }
          currentBatch += 1;
        }, DEBOUNCE_DURATION);
      }
    });
  }
};


module.exports = wordReferenceToCsv;
