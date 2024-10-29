# process_citation.py
import sys
import json
import bibtexparser

def extract_bib_info(file_path):
    with open(file_path, 'r') as bib_file:
        bib_database = bibtexparser.load(bib_file)

    citations = []
    for entry in bib_database.entries:
        citation = {
            'author': entry.get('author', 'N/A'),
            'title': entry.get('title', 'N/A'),
            'year': entry.get('year', 'N/A'),
            'journal': entry.get('journal', 'N/A'),
            'volume': entry.get('volume', 'N/A'),
            'pages': entry.get('pages', 'N/A')
        }
        citations.append(citation)
    
    return citations

if __name__ == "__main__":
    file_path = sys.argv[1]  # Get file path from command line arguments
    citation_info = extract_bib_info(file_path)
    print(json.dumps({"citations": citation_info}))  # Output JSON to stdout
