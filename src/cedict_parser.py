# Parser that extracts lines from the CEDICT Chinese-English dictionary and
# exports them as a JSON file.

import json
from parse import parse

# Assumes the parser is run from the src directory
INPUT_CEDICT_PATH = '../public/cedict_ts.u8'

OUTPUT_MAPPINGS_PATH = '../public/char-mappings.json'
OUTPUT_DICTIONARY_PATH = '../public/cedict-ts.json'


def parse_line(line: str) -> dict:
    """Converts a line from the CEDICT into a dictionary along its delimiters.
        The basic format of each line is specified by CEDICT documentation as:
        "traditional simplified [pin1 yin1] /gloss; gloss; .../gloss; gloss; .../"

    Args:
        line (str): A line from the CEDICT file.

    Returns:
        dict: A dictionary with keys "traditional," "simplified", "pinyin", and
            "glossary".
    """

    parsed_line = list(parse('{} {} [{}] /{}/', line))
    parsed_line[-1] = parsed_line[-1].split('/')

    keys = ['traditional', 'simplified', 'pinyin', 'glossary']
    phrase = {key: value for (key, value) in zip(keys, parsed_line)}
    phrase['pinyin'] = phrase['pinyin'].lower()

    return phrase


if __name__ == '__main__':
    # Index mappings for simplified and traditional characters onto the same
    # dictionary entry
    char_mapping = {}
    dict_entries = []

    # Open CEDICT file
    with open(INPUT_CEDICT_PATH, encoding='utf8') as cedict:
        for line in cedict:
            # Inserts phrase into dictionary and creates index mappings for characters
            phrase = parse_line(line.strip())

            # Mappings store a set of indices of dictionary entries for terms
            # with multiple definitions
            if phrase['traditional'] not in char_mapping:
                char_mapping[phrase['traditional']] = set()

            if phrase['simplified'] not in char_mapping:
                char_mapping[phrase['simplified']] = set()

            char_mapping[phrase['traditional']].add(len(dict_entries))
            char_mapping[phrase['simplified']].add(len(dict_entries))

            # Adds phrase to the dictionary
            dict_entries.append(phrase)

    # Convert sets to lists for JSON serialization
    for key in char_mapping:
        char_mapping[key] = list(char_mapping[key])

    # Outputs character mappings and dictionary as json files
    with (open(OUTPUT_MAPPINGS_PATH, 'w', encoding='utf-8') as mappings_json,
            open(OUTPUT_DICTIONARY_PATH, 'w', encoding='utf-8') as dict_json):
        json.dump(char_mapping, mappings_json, ensure_ascii=False)
        json.dump(dict_entries, dict_json, ensure_ascii=False)
