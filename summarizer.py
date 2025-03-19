import fitz  # PyMuPDF
from collections import Counter
import re

# Function to extract text from the PDF file
def extract_text_from_pdf(pdf_path):
    text = ""
    try:
        with fitz.open(pdf_path) as pdf:
            for page in pdf:
                text += page.get_text()  # Extract text from each page
    except Exception as e:
        print(f"An error occurred while extracting text: {e}")
    return text

# Function to summarize the extracted text
def summarize_text(text, num_sentences=3):
    sentences = re.split(r'(?<=[.!?]) +', text)  # Split text into sentences
    word_count = Counter(re.findall(r'\w+', text.lower()))  # Count word frequencies

    # Score sentences based on the frequency of words
    sentence_scores = {}
    for sentence in sentences:
        for word in re.findall(r'\w+', sentence.lower()):
            if word in word_count:
                if sentence not in sentence_scores:
                    sentence_scores[sentence] = 0
                sentence_scores[sentence] += word_count[word]

    # Get the top N sentences based on the word frequency score
    summary_sentences = sorted(sentence_scores, key=sentence_scores.get, reverse=True)[:num_sentences]
    return summary_sentences

# The main summarization function to be called
def summarize():
    pdf_path = input("Enter the PDF file path: ")
    try:
        text = extract_text_from_pdf(pdf_path)
        summary = summarize_text(text, num_sentences=3)  # Adjust the number of sentences for a shorter summary
        print("\nSummary:")
        for sentence in summary:
            print(sentence)
    except Exception as e:
        print(f"An error occurred: {e}")
