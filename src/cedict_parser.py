# Parser that extracts lines from the CEDICT Chinese-English dictionary and
# exports them as a JSON file.

import json
from parse import parse

# Assumes the parser is run from the src directory
INPUT_CEDICT_PATH = '../public/cedict_ts.u8'

OUTPUT_MAPPINGS_PATH = '../public/trad_simp_mappings.json'
OUTPUT_DICTIONARY_PATH = '../public/cedict_ts.json'


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
    phrase = { key:value for (key, value) in zip(keys, parsed_line)}

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

            char_mapping[phrase['traditional']] \
                = char_mapping[phrase['simplified']] \
                = len(dict_entries)

            dict_entries.append(phrase)
    
    # Outputs character mappings and dictionary as json files
    with open(OUTPUT_MAPPINGS_PATH, 'w') as mappings_json:
        print(json.dumps(char_mapping), file=mappings_json)

    with open(OUTPUT_DICTIONARY_PATH, 'w') as dict_json:
        print(json.dumps(dict_entries), file=dict_json)



    
            
