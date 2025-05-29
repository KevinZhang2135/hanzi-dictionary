# Parser that extracts lines from the CEDICT Chinese-English dictionary and
# exports them as a JSON file.

import json

def parse_line(line: str) -> dict:
    """Converts a line from the CEDICT into a dictionary along its delimiters.
        The basic format of each line is specified by CEDICT documentation as:
        "Traditional Simplified [pin1 yin1] /gloss; gloss; .../gloss; gloss; .../"

    Args:
        line (str): A line from the CEDICT file.

    Returns:
        dict: A dictionary with keys "traditional," "simplified", "pinyin", and
            "glosses".
    """

if __name__ == '__main__':
    # Assumes the parser is run from the src directory
    CEDICT_PATH = '../public/cedict_ts.u8'

    # Open CEDICT file
    dict_lines = []
    with open(CEDICT_PATH, encoding='utf8') as file:
        for line in file:
            dict_lines.append(line.strip())
