# word_reference_to_csv

## Table of Contents

- [About](#about)
- [Getting Started](#getting_started)
- [Usage](#usage)
- [Contributing](../CONTRIBUTING.md)

## About <a name = "about"></a>

Simple package that allows a user to take a csv file or string of semi-colon separated values and translate them into their desired target language using the Word Reference API.

## Getting Started <a name = "getting_started"></a>

To work with this package, you'll need at the bare minimum to create a no_results.csv file and an output.csv file. You will then either need an input.csv file or to pass an option of inputFormat as a string with inputData formatted as seen below. The default option is file.


### Installing

```npm install word_reference_to_csv```

```js
const inputData =
  ';vitaminico ;potasio ;criada ;poner en marcha ;peramanzana ;bollo';

wordReferenceToCsv({
  inputSourceLanguage: 'es',
  outputTargetLanguage: 'en',
  outputFile: '',
  noResultsFile: '',
  inputFormat: 'string',
  inputData,
});
```
