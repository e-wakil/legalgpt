import os
import re
import json
import fitz  # PyMuPDF
import numpy as np
from sentence_transformers import SentenceTransformer

# --- Configuration ---
MODEL_NAME = "all-mpnet-base-v2"
PDF_FOLDER = "./pdfs"
DATA_FOLDER = "./data"
OUTPUT_METADATA = os.path.join(DATA_FOLDER, "legal_metadata.json")
OUTPUT_EMBEDDINGS = os.path.join(DATA_FOLDER, "legal_embeddings.npy")

os.makedirs(DATA_FOLDER, exist_ok=True)

# --- Regex Patterns ---
part_re = re.compile(r'^Part\s*[-–]?\s*(\d+)\s*(.*)', re.I)
chapter_re = re.compile(r'^Chapter\s*[-–]?\s*(\d+)', re.I)
section_re = re.compile(r'^(\d+)\.\s*(.*)') # Captures Number and the rest of the line
subsection_re = re.compile(r'^\((\d+)\)')
clause_re = re.compile(r'^\(([a-z])\)')

def parse_legal_pdf(pdf_path):
    # Clean Law Name: Constitution_en.pdf -> Constitution of Nepal (or similar)
    law_name = os.path.basename(pdf_path).replace(".pdf", "").replace("_", " ").replace("-", " ").title()
    
    doc = fitz.open(pdf_path)
    raw = []
    for page in doc:
        t = page.get_text()
        t = re.sub(r'(\w)-\n(\w)', r'\1\2', t)   # fix hyphens
        t = re.sub(r'\n+', '\n', t)
        raw.append(t)

    lines = [l.strip() for l in "\n".join(raw).split("\n")]
    lines = [l for l in lines if not re.fullmatch(r'\d+', l)] 

    records = []
    part = chapter = chapter_title = None
    section = section_title = None
    subsection = None
    buffer = ""

    def flush():
        nonlocal buffer
        if section and buffer.strip():
            records.append({
                "law": law_name,
                "part": part,
                "chapter": chapter,
                "chapter_title": chapter_title,
                "section": str(section),
                "section_title": section_title,
                "subsection": subsection,
                "text": buffer.strip(),
                "source": f"Source: {law_name}"
            })
        buffer = ""

    i = 0
    while i < len(lines):
        line = lines[i]
        i += 1
        if not line: continue

        # 1. PART
        m = part_re.match(line)
        if m:
            flush()
            part = f"Part-{m.group(1)}"
            section = subsection = None
            continue

        # 2. CHAPTER
        m = chapter_re.match(line)
        if m:
            flush()
            chapter = f"Chapter-{m.group(1)}"
            section = subsection = None
            while i < len(lines) and not lines[i]: i += 1
            chapter_title = lines[i] if i < len(lines) else None
            i += 1
            continue

        # 3. SECTION (Smart Split Logic)
        m = section_re.match(line)
        if m:
            flush()
            section = m.group(1)
            raw_title_line = m.group(2)
            
            # Check if subsection (1) is on the SAME line as the title
            # Matches ": (1)" or " (1)"
            inline_sub = re.search(r'[:\s]*\((\d+)\)\s*(.*)', raw_title_line)
            
            if inline_sub:
                # Title is everything before the (1)
                section_title = raw_title_line[:inline_sub.start()].strip().rstrip(":")
                subsection = f"({inline_sub.group(1)})"
                buffer = inline_sub.group(2) # The rest of the line is the actual text
            else:
                section_title = raw_title_line.strip().rstrip(":")
                subsection = None
                buffer = ""
            continue

        # 4. SUBSECTION
        m = subsection_re.match(line)
        if m:
            flush()
            subsection = f"({m.group(1)})"
            # Some text might follow (1) on the same line
            buffer = line[m.end():].strip()
            continue

        # 5. CONTENT / CLAUSE
        buffer += " " + line

    flush() 
    return records

def run_ingestion():
    all_records = []
    pdf_files = [f for f in os.listdir(PDF_FOLDER) if f.endswith(".pdf")]
    
    if not pdf_files:
        print(f"❌ No PDFs found in {PDF_FOLDER}")
        return

    for pdf in pdf_files:
        print(f"📄 Parsing: {pdf}...")
        all_records.extend(parse_legal_pdf(os.path.join(PDF_FOLDER, pdf)))

    print(f"🧠 Encoding {len(all_records)} sections...")
    embed_model = SentenceTransformer(MODEL_NAME)
    
    # We use Law + Title + Text for embedding to improve search accuracy
    texts_to_embed = [f"{r['law']} {r['section_title']} {r['text']}" for r in all_records]
    embeddings = embed_model.encode(texts_to_embed, convert_to_numpy=True, show_progress_bar=True)

    np.save(OUTPUT_EMBEDDINGS, embeddings.astype('float32'))
    with open(OUTPUT_METADATA, "w", encoding="utf-8") as f:
        json.dump(all_records, f, ensure_ascii=False, indent=2)

    print(f"✅ Success! Metadata cleaned and saved.")

if __name__ == "__main__":
    run_ingestion()