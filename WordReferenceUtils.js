const wordReferenceApi = require("wordreference-api");
const fs = require("fs");
const {
  LANGUAGE_FROM,
  LANGUAGE_TO,
  NO_RESULTS_FILE,
  OUTPUT_FILE
} = require("./constants");

class WordReferenceUtils {
  static createBatches(data) {
    let batches = [];
    while (data.length > 0) {
      batches.push(data.splice(0, 15));
    }
    return batches;
  }
  static determineIfFinishedProcessing(currentBatch, batches) {
    if (currentBatch >= batches.length - 1) {
      console.log("Done translating! Data available in output.csv");
      return true;
    }
    return false;
  }
  static formatTranslations(translations) {
    return translations
      .map(t => t.translations)
      .slice(0, 2)
      .map(t => t[0])
      .map(t => t.to.trim())
      .join(", ");
  }
  static async fetchData(line) {
    const hint = `(${line[0]})`;
    const response = await wordReferenceApi(
      encodeURI(line.normalize("NFD").replace(/[\u0300-\u036f]/g, "")),
      LANGUAGE_FROM,
      LANGUAGE_TO
    ).then(result => {
      const { translations } = result;

      if (translations.length === 0) {
        console.error(`No translations found for word: ${line}`);
        fs.appendFile(NO_RESULTS_FILE, `; ${line} \n`, () => {});
        return;
      }

      const firstTwoResults = WordReferenceUtils.formatTranslations(
        translations
      );

      const dataToAppend = `${Array.from(
        new Set(firstTwoResults.split(", "))
      ).join("/")}${hint}; ${line}  \n`;

      fs.appendFile(OUTPUT_FILE, dataToAppend, () => {});
    });
    return response;
  }
  static formatLines(data) {
    return data
      .split(";")
      .map(line => line.replace("/n", "").trim())
      .filter(line => line && line.length);
  }
}

module.exports = {
  WordReferenceUtils
};
