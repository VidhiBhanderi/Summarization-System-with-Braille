from fastapi import FastAPI, UploadFile, File, HTTPException,Form
from transformers import pipeline, BartForConditionalGeneration, BartTokenizer
from fastapi.responses import FileResponse
import pdfkit
import PyPDF2
import docx
import shutil
import os
import pyttsx3
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
import mysql.connector
from datetime import datetime



app = FastAPI()

app.add_middleware(
 CORSMiddleware,
 allow_origins=["*"], # Add your frontend origin here "* : all origins are allowed"
 allow_credentials=True,
 allow_methods=["*"],
 allow_headers=["*"],
 )



# Pydantic model for user registration request
class UserRegistration(BaseModel):
    name: str
    email: str
    password: str 

# Pydantic model for user login request
class UserLogin(BaseModel):
    email: str
    password: str

# Database connection parameters
db_config = {
    'user': 'root',
    'password': 'Vid#9313',
    'host': 'localhost',
    'database': 'demo'
}

# Function to authenticate user credentials
def authenticate_user(email: str, password: str):
    connection = mysql.connector.connect(**db_config)
    cursor = connection.cursor()

    try:
        # Check if the email exists
        cursor.execute("SELECT * FROM user_details WHERE email = %s", (email,))
        user = cursor.fetchone()

        if user:
            # Check if the password matches
            if user[3] == password:  # Assuming password is stored at index 3
                return True
    except mysql.connector.Error as e:
        raise HTTPException(status_code=500, detail=f"Database error: {e.msg}")
    finally:
        cursor.close()
        connection.close()

    return False

# Function to check if the 'user_details' table exists
def table_exists(cursor):
    cursor.execute("SHOW TABLES LIKE 'user_details'")
    return cursor.fetchone() is not None

# Function to create the 'user_details' table
def create_user_details_table(cursor):
    cursor.execute("""
        CREATE TABLE user_details (
            id INT AUTO_INCREMENT PRIMARY KEY,
            name VARCHAR(100),
            email VARCHAR(100),
            password VARCHAR(100)
        )
    """)

# Function to check if email already exists in the table
def email_exists(cursor, email):
    cursor.execute("SELECT COUNT(*) FROM user_details WHERE email = %s", (email,))
    count = cursor.fetchone()[0]
    return count > 0

# Function to register a new user
def register_user(name, email, password):
    connection = mysql.connector.connect(**db_config)
    cursor = connection.cursor()

    try:
        if not table_exists(cursor):
            create_user_details_table(cursor)

        # Check if email already exists
        if email_exists(cursor, email):
            raise HTTPException(status_code=400, detail="Email already exists")

        # Insert user details into the table
        cursor.execute("""
            INSERT INTO user_details (name, email, password)
            VALUES (%s, %s, %s)
        """, (name, email, password))

        connection.commit()
    except mysql.connector.Error as e:
        raise HTTPException(status_code=500, detail=f"Database error: {e.msg}")
    finally:
        cursor.close()
        connection.close()


# Load the BART model and tokenizer
model_name = "sshleifer/distilbart-cnn-12-6"
model = BartForConditionalGeneration.from_pretrained(model_name)
tokenizer = BartTokenizer.from_pretrained(model_name)

# Create the summarization pipeline with the specified model
summarizer = pipeline("summarization", model=model, tokenizer=tokenizer)

# Dictionary mapping English characters, numbers, punctuation marks, and special characters to Braille representations
braille_dict = {
    'a': '⠁', 'b': '⠃', 'c': '⠉', 'd': '⠙', 'e': '⠑',
    'f': '⠋', 'g': '⠛', 'h': '⠓', 'i': '⠊', 'j': '⠚',
    'k': '⠅', 'l': '⠇', 'm': '⠍', 'n': '⠝', 'o': '⠕',
    'p': '⠏', 'q': '⠟', 'r': '⠗', 's': '⠎', 't': '⠞',
    'u': '⠥', 'v': '⠧', 'w': '⠺', 'x': '⠭', 'y': '⠽',
    'z': '⠵', ' ': '⠀', ',': '⠂', '.': '⠲', '0': '⠼⠚',
    '1': '⠼⠁', '2': '⠼⠃', '3': '⠼⠉', '4': '⠼⠙', '5': '⠼⠑',
    '6': '⠼⠋', '7': '⠼⠛', '8': '⠼⠓', '9': '⠼⠊',
    '!': '⠮', '?': '⠦', ';': '⠆', ':': '⠒', '-': '⠤',
    '(': '⠷', ')': '⠾', '[': '⠪', ']': '⠻', '{': '⠳',
    '}': '⠹', '<': '⠣', '>': '⠜', '/': '⠤', '\\': '⠠',
    '|': '⠸', '&': '⠯', '#': '⠼⠶', '@': '⠈', '*': '⠔',
    '+': '⠖', '=': '⠶', '$': '⠈⠎'
}

def text_to_braille(text):
    """Convert text to Braille."""
    braille_text = ''
    for char in text.lower():
        if char in braille_dict:
            braille_text += braille_dict[char]
        else:
            braille_text += char  # If character not in dictionary, keep it unchanged
    return braille_text

def read_txt(filepath):
    """Read text from a TXT file."""
    with open(filepath, "r", encoding="utf-8") as file:
        return file.read()

def read_pdf(filepath):
    """Read text from a PDF file."""
    with open(filepath, "rb") as pdfobj:
        pdfreader = PyPDF2.PdfReader(pdfobj)
        all_text = ""
        for page_num in range(len(pdfreader.pages)):
            page = pdfreader.pages[page_num]
            page_text = page.extract_text()
            all_text += page_text
        return all_text

def read_docx(filepath):
    """Read text from a Word document."""
    doc = docx.Document(filepath)
    all_text = ""
    for paragraph in doc.paragraphs:
        all_text += paragraph.text + "\n"
    return all_text

def get_text(file: UploadFile):
    """Get text content based on uploaded file type."""
    # Create a temporary directory
    temp_dir = os.path.join(os.getcwd(), "tmp")
    os.makedirs(temp_dir, exist_ok=True)
    
    # Generate a temporary file path
    file_path = os.path.join(temp_dir, file.filename)
    
    try:
        # Save the uploaded file to the temporary file path
        with open(file_path, "wb") as buffer:
            shutil.copyfileobj(file.file, buffer)
        
        _, extension = os.path.splitext(file.filename)
        
        if extension == '.pdf':
            return read_pdf(file_path)
        elif extension == '.docx':
            return read_docx(file_path)
        elif extension == '.txt':
            return read_txt(file_path)
        else:
            print("Unsupported file format.")
            return None
    finally:
        # Clean up: remove the temporary file
        os.remove(file_path)

@app.post("/summarize/")
async def get_summary(file: UploadFile = File(...)):
    """Get summary and its Braille representation for an uploaded file."""
    text = get_text(file)
    text = " ".join(text.split())

    # Set max_length to a fraction of the text length (e.g., 25%)
    max_length = len(text) // 4
    min_length = 30  # You can adjust this as needed

    # Ensure max_length is within the model's allowed range
    max_length = min(max_length, 1024)

    # Generate summary
    if text:
        summary = summarizer(text, max_length=max_length, min_length=min_length, do_sample=False)
        summary_text = summary[0]['summary_text']

        # Convert summary text to Braille
        braille_text = text_to_braille(summary_text)

        return {"summary_text": summary_text, "braille_text": braille_text}
    else:
        return {"error": "Failed to extract text from the provided file."}


@app.post("/text-to-speech/")
async def text_to_speech(text: str):
    """Convert text to speech."""
    # Initialize the text-to-speech engine
    ts = pyttsx3.init()

    # Get the list of available voices
    voices = ts.getProperty('voices')

    # Set the desired voice (select the first voice)
    desired_voice_id = voices[1].id
    ts.setProperty('voice', desired_voice_id)

    new_rate = 130  # Change this value as needed
    ts.setProperty('rate', new_rate)

    # Speak the text
    ts.say(text)
    ts.runAndWait()
    return {"message": "Text spoken successfully."}




# API endpoint for user registration
@app.post("/register/")
def register_user_endpoint(user: UserRegistration):
    try:
        register_user(user.name, user.email, user.password)
        return {"message": "User registered successfully"}
    except HTTPException as e:
        raise e
    except Exception as e:
        raise HTTPException(status_code=400, detail=f"An error occurred: {str(e)}")



@app.post("/login/")
def login_user(user: UserLogin):
    try:
        
        if authenticate_user(user.email, user.password):
            connection = mysql.connector.connect(**db_config)
            cursor = connection.cursor()
            # Fetch user details from the database
            cursor.execute("SELECT name FROM user_details WHERE email = %s", (user.email,))
            name = cursor.fetchone()[0]
            
            return {"message": "Login successful", "name": name}
        else:
            raise HTTPException(status_code=401, detail="Invalid email or password")
    except HTTPException as e:
        raise e
    except Exception as e:
        raise HTTPException(status_code=400, detail=f"An error occurred: {str(e)}")
    finally:
        cursor.close()
        connection.close()



@app.post("/generate-pdf")
async def generate_pdf(text: str = Form(...)):
    try:
        # Generate PDF from input text
        pdf = pdfkit.from_string(text, False)

        # Save PDF to a temporary file
        pdf_file = "output.pdf"
        with open(pdf_file, "wb") as file:
            file.write(pdf)

        # Return the PDF file
        return FileResponse(pdf_file, filename="output.pdf", media_type='application/pdf')

    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))