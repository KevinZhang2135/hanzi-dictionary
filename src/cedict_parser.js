import fs from 'fs';
import readline from 'readline';
import { convert } from 'pinyin-pro';

// Assumes the parser is run from the root directory
const INPUT_CEDICT_PATH = 'public/cedict_ts.u8';
const OUTPUT_MAPPINGS_PATH = 'public/char-mappings.json';
const OUTPUT_DICTIONARY_PATH = 'public/cedict-ts.json';

/**
 * Converts a line from the CEDICT into a dictionary along its delimiters.
 * The basic format of each line is specified by CEDICT documentation as:
 * "traditional simplified [pin1 yin1] /gloss; gloss; .../gloss; gloss; .../"
 *
 * @param {string} line A line from the CEDICT file
 * @returns {object} An JSON object containing each word with their corresponding
 * definitions
 */
function parseLine(line) {
  const match = line.match(/^(\S+) (\S+) \[([^\]]+)\] \/(.+)\/$/);
  if (!match) {
    throw Error(`Encountered unexpected line in CEDICT file: \n\t${line}`);
  }

  const [_, traditional, simplified, rawPinyin, rawGlossary] = match;
  const glossary = rawGlossary.split('/');

  // CEDICT uses "u:" instead of "v" for ü
  let pinyin = rawPinyin.replace(/u:/g, 'v').toLowerCase();

  // Converts tone numbers (e.g., "pin1 yin1") to diacritics (e.g., "pīn yīn")
  pinyin = convert(pinyin);

  return {
    traditional,
    simplified,
    pinyin,
    glossary,
  };
}

(async () => {
  const charMapping = {};
  const dictEntries = [];

  // Create a read stream to handle CEDICT file
  const fileStream = fs.createReadStream(INPUT_CEDICT_PATH, {
    encoding: 'utf8',
  });

  const readStream = readline.createInterface({
    input: fileStream,
    crlfDelay: Infinity,
  });

  for await (const line of readStream) {
    // Skip empty lines and comment lines
    const trimmedLine = line.trim();
    if (!trimmedLine || trimmedLine.startsWith('#')) {
      continue;
    }

    // Each traditional and simpified character will map to `entryIdx` of the
    // dictionary
    const phrase = parseLine(trimmedLine);
    const entryIdx = dictEntries.length;

    // Mappings store a set of indices of dictionary entries for terms with
    // multiple definitions
    if (!(phrase.traditional in charMapping)) {
      charMapping[phrase.traditional] = new Set();
    }

    if (!(phrase.simplified in charMapping)) {
      charMapping[phrase.simplified] = new Set();
    }

    charMapping[phrase.traditional].add(entryIdx);
    charMapping[phrase.simplified].add(entryIdx);

    dictEntries.push(phrase);
  }

  for (const key in charMapping) {
    charMapping[key] = Array.from(charMapping[key]);
  }

  // Output character mappings and dictionary as JSON files
  try {
    fs.writeFileSync(
      OUTPUT_MAPPINGS_PATH,
      JSON.stringify(charMapping, null),
      'utf8'
    );

    fs.writeFileSync(
      OUTPUT_DICTIONARY_PATH,
      JSON.stringify(dictEntries, null),
      'utf8'
    );

    console.log('Parsing complete.');
  } catch (err) {
    console.error('Error writing JSON output files: ', err);
  }
})()
