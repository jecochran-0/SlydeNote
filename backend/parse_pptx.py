from flask import Flask, request, jsonify
from pptx import Presentation
import os
import logging
import re
from collections import defaultdict
import spacy
from transformers import pipeline
from keybert import KeyBERT

# Set up logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

app = Flask(__name__)

# Load NLP models (ensure models are installed)
try:
    nlp = spacy.load("en_core_web_sm")
except OSError:
    logger.error("spaCy model 'en_core_web_sm' not found. Installing now...")
    spacy.cli.download("en_core_web_sm")
    nlp = spacy.load("en_core_web_sm")

summarizer = pipeline("summarization", model="facebook/bart-large-cnn")
kw_model = KeyBERT()

def analyze_text(text: str) -> dict:
    """
    Analyze slide text to create all-encompassing notes with guiding questions, definitions, and specific topics.
    Uses NLP for structure and coherence, agnostic to any specific topic.
    """
    notes = {
        "guiding_questions": [],
        "definitions": [],
        "specific_topics": defaultdict(list),  # Subtopics organized by key areas
        "key_phrases": [],
        "summary": ""
    }

    # 1. Clean and Normalize Text
    raw_text = text.strip()
    cleaned_text = re.sub(r'https?://\S+', '', raw_text)  # Remove URLs
    cleaned_text = re.sub(r'\b\d{1,2}[^\w\s]\d{1,2}[^\w\s]\d{2,4}\b', '', cleaned_text)  # Remove coordinates
    cleaned_text = re.sub(r'\b\d+\b', '', cleaned_text)  # Remove standalone numbers
    cleaned_text = re.sub(r'\s*\(ex\.\s*[^\)]*\)', '', cleaned_text)  # Remove "(Ex. Coinbase)" or similar
    cleaned_text = re.sub(r'\s*\(money,\s*p\d+\)', '', cleaned_text)  # Remove "(Money, p7)" references
    cleaned_text = re.sub(r'\b(quiz|interactive|task|upload|canvas|source|video)\b', '', cleaned_text)  # Remove procedural terms
    cleaned_text = " ".join(cleaned_text.split())  # Normalize spaces

    # 2. Extract Key Phrases using KeyBERT for topics
    if cleaned_text and len(cleaned_text.split()) > 10:
        key_phrases = kw_model.extract_keywords(cleaned_text, keyphrase_ngram_range=(1, 2), top_n=5, stop_words=['the', 'and', 'is'], diversity=0.7)
        notes["key_phrases"] = [kp[0].capitalize() for kp in key_phrases if kp[0] and len(kp[0]) > 3 and not any(char.isdigit() for char in kp[0])]

    # 3. Summarize Text using BART
    if len(cleaned_text.split()) > 50:  # Only summarize if text is long enough
        try:
            max_length = min(150, max(30, len(cleaned_text.split()) // 2))
            summary = summarizer(cleaned_text, max_length=max_length, min_length=20, do_sample=False)
            notes["summary"] = summary[0]["summary_text"].capitalize()
        except Exception as e:
            logger.error(f"Error summarizing text: {str(e)}")
            notes["summary"] = cleaned_text[:200] + "..." if len(cleaned_text) > 200 else cleaned_text.capitalize()

    # 4. Categorize Sentences using spaCy with dependency parsing and NER
    if cleaned_text:
        doc = nlp(cleaned_text)
        sentences = list(doc.sents)
        
        # Identify guiding questions (questions or prompts)
        for sent in sentences:
            sentence = sent.text.strip()
            if not sentence or len(sentence) < 5:
                continue
            
            sentence_lower = sentence.lower()
            if sentence_lower.endswith('?') or any(word in sentence_lower for word in ['what', 'how', 'why', 'are', 'is', 'does']):
                notes["guiding_questions"].append(sentence.capitalize())
                logger.info(f"Found guiding question: {sentence}")
                continue

        # Categorize remaining sentences
        for sent in sentences:
            sentence = sent.text.strip()
            if not sentence or len(sentence) < 10:
                continue
            
            sentence_lower = sentence.lower()
            # Use dependency parsing for definitions (subject-verb-object with "is," "defined," etc.)
            is_definition = any(token.dep_ in ['attr', 'nsubj'] and token.head.text.lower() in ['is', 'defined', 'known', 'refers', 'means'] for token in sent)
            if is_definition and any(word in sentence_lower for word in ['a', 'an', 'the', 'this', 'that', 'of']):
                notes["definitions"].append(sentence.capitalize())
                logger.info(f"Found definition: {sentence}")
                continue

            # Use keywords and NER for specific topics (subtopics based on key phrases or entities)
            key_entities = [ent.text.lower() for ent in sent.ents if ent.label_ in ['PERSON', 'ORG', 'PRODUCT', 'EVENT']]
            key_words = [word.text.lower() for word in sent if word.pos_ in ['NOUN', 'PROPN'] and len(word.text) > 3]
            if key_entities or key_words:
                topic_key = key_entities[0] if key_entities else key_words[0] if key_words else "General Topic"
                notes["specific_topics"][topic_key].append(sentence.capitalize())
                logger.info(f"Added to specific topic '{topic_key}': {sentence}")
                continue

    # Remove duplicates and empty entries, ensure coherence
    for key in notes:
        if key == "summary":
            continue  # Skip summary for deduplication
        if key == "specific_topics":
            for subtopic in notes[key]:
                notes[key][subtopic] = list(dict.fromkeys([n for n in notes[key][subtopic] if n and len(n) > 15]))
        else:
            notes[key] = list(dict.fromkeys([n for n in notes[key] if n and len(n) > 15]))  # Filter very short entries

    logger.info(f"Analyzed notes: {notes}")
    return notes

def extract_topic(text: str) -> str:
    """
    Extract a topic from text based on keywords or title-like phrases, agnostic to any specific topic.
    Avoids noise and procedural text.
    """
    # Clean and normalize text
    cleaned_text = text.strip().lower()
    
    # Remove noise (URLs, coordinates, technical fragments, procedural text)
    cleaned_text = re.sub(r'https?://(?:[-\w.]|(?:%[\da-fA-F]{2}))+[^\s]*', '', cleaned_text)  # Remove URLs
    cleaned_text = re.sub(r'\b\d{1,2}[^\w\s]\d{1,2}[^\w\s]\d{2,4}\b', '', cleaned_text)  # Remove coordinates
    cleaned_text = re.sub(r'\b\d+\b', '', cleaned_text)  # Remove standalone numbers
    cleaned_text = re.sub(r'\s*\(ex\.\s*[^\)]*\)', '', cleaned_text)  # Remove "(Ex. Coinbase)" or similar
    cleaned_text = re.sub(r'\s*\(money,\s*p\d+\)', '', cleaned_text)  # Remove "(Money, p7)" references
    cleaned_text = re.sub(r'\b(quiz|interactive|task|upload|canvas|source|video)\b', '', cleaned_text)  # Remove procedural terms
    cleaned_text = " ".join(cleaned_text.split())  # Normalize spaces

    # General academic topics (agnostic to any subject)
    topic_keywords = ['concept', 'system', 'technology', 'process', 'theory', 'practice', 'method', 'principle', 'structure', 'function']
    
    # Look for capitalized words or keywords in the text
    for keyword in topic_keywords:
        if keyword in cleaned_text:
            return keyword.capitalize()
    
    # Fallback: use the first significant word (noun or capitalized phrase) after cleaning
    words = [w for w in cleaned_text.split() if w and not w.isdigit() and len(w) > 3 and not any(proc in w for proc in ['quiz', 'interactive', 'task', 'upload', 'canvas', 'source', 'video'])]
    if words:
        # Look for noun-like or capitalized words
        for word in words:
            if word[0].isupper() or word.pos_ in ['NOUN', 'PROPN'] if hasattr(word, 'pos_') else True:
                return word.capitalize()
        return words[0].capitalize() if words else "General Topic"
    
    return "General Topic"

@app.route('/parse-pptx', methods=['POST'])
def parse_pptx():
    if 'file' not in request.files:
        return jsonify({'error': 'No file uploaded'}), 400

    file = request.files['file']
    file_path = os.path.join('uploads', file.filename)
    os.makedirs('uploads', exist_ok=True)

    try:
        logger.info(f"Received file: {file.filename}")
        file.save(file_path)

        prs = Presentation(file_path)
        topic_notes = defaultdict(lambda: {
            'guiding_questions': [],
            'definitions': [],
            'specific_topics': defaultdict(list),
            'key_phrases': [],
            'summary': ""
        })

        # Process each slide
        for slide_num, slide in enumerate(prs.slides, 1):
            slide_content = {
                'title': '',
                'notes': {
                    'guiding_questions': [],
                    'definitions': [],
                    'specific_topics': defaultdict(list),
                    'key_phrases': [],
                    'summary': "",
                    'raw_text': ''
                },
                'images': []
            }
            
            # Extract title and text
            for shape in slide.shapes:
                if shape.has_text_frame and shape.text:
                    if not slide_content['title']:
                        slide_content['title'] = shape.text
                    else:
                        slide_content['notes']['raw_text'] += shape.text + '\n'
                
                # Extract image references
                if shape.shape_type == 13:  # Picture type
                    slide_content['images'].append(f"Image_{slide_num}_{shape.shape_id}")

            # Analyze the text for structured notes
            if slide_content['notes']['raw_text']:
                analyzed_notes = analyze_text(slide_content['notes']['raw_text'])
                slide_content['notes'].update(analyzed_notes)

            # Determine topic (use title if available, otherwise infer from text)
            topic = extract_topic(slide_content['title'] or slide_content['notes']['raw_text'])
            
            # Add notes to the topic, handling nested defaultdict for specific_topics
            for key in ['guiding_questions', 'definitions', 'key_phrases']:
                if slide_content['notes'][key]:
                    if isinstance(slide_content['notes'][key], list):
                        topic_notes[topic][key].extend(slide_content['notes'][key])
                    else:
                        topic_notes[topic][key].append(slide_content['notes'][key])
            if slide_content['notes']['summary']:
                topic_notes[topic]['summary'] = slide_content['notes']['summary']
            
            # Handle specific_topics (nested defaultdict)
            for subtopic, sentences in slide_content['notes']['specific_topics'].items():
                if sentences:
                    topic_notes[topic]['specific_topics'][subtopic].extend(sentences)

        # Convert defaultdict to regular dict for JSON serialization
        final_notes = {
            topic: {
                'guiding_questions': notes['guiding_questions'],
                'definitions': notes['definitions'],
                'specific_topics': dict(notes['specific_topics']),
                'key_phrases': notes['key_phrases'],
                'summary': notes['summary']
            } for topic, notes in topic_notes.items()
        }

        logger.info(f"Returning topics: {final_notes}")
        os.remove(file_path)  # Clean up
        return jsonify({'topics': final_notes})

    except Exception as e:
        logger.error(f"Error parsing PowerPoint file: {str(e)}")
        return jsonify({'error': f"Failed to parse file: {str(e)}"}), 500

if __name__ == '__main__':
    app.run(host='0.0.0.0', port=6000)  # Using port 6000 for backend