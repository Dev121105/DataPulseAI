import os
import sqlite3
import pandas as pd
import io
import time
import random
from fastapi import FastAPI, UploadFile, File, HTTPException, Response
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from langchain_community.utilities import SQLDatabase
from langchain_community.agent_toolkits import create_sql_agent
from langchain_groq import ChatGroq
from dotenv import load_dotenv

load_dotenv(override=True)

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "https://data-pulse-ai-one.vercel.app",
        "http://localhost:5173",
        "http://localhost:8001",
        "http://127.0.0.1:5173",
        "http://127.0.0.1:8001"
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

DB_PATH = "mini_data.db"

def get_conn():
    return sqlite3.connect(DB_PATH)

def get_active_table():
    try:
        conn = get_conn()
        cursor = conn.cursor()
        cursor.execute("CREATE TABLE IF NOT EXISTS metadata (key TEXT PRIMARY KEY, value TEXT)")
        cursor.execute("SELECT value FROM metadata WHERE key='latest_table'")
        row = cursor.fetchone()
        conn.close()
        return row[0] if row else "data_table"
    except:
        return "data_table"

def set_active_table(name):
    conn = get_conn()
    cursor = conn.cursor()
    cursor.execute("CREATE TABLE IF NOT EXISTS metadata (key TEXT PRIMARY KEY, value TEXT)")
    cursor.execute("INSERT OR REPLACE INTO metadata (key, value) VALUES ('latest_table', ?)", (name,))
    conn.commit()
    conn.close()

@app.get("/")
def status():
    return {"status": "online", "engine": "DataPulse Neural"}

@app.post("/upload")
async def upload_dataset(file: UploadFile = File(...)):
    try:
        payload = await file.read()
        df = pd.read_csv(io.BytesIO(payload))
        
        df.columns = [c.strip().replace(" ", "_").lower() for c in df.columns]
        
        base_name = os.path.splitext(file.filename)[0].lower()
        table_id = "".join([c if c.isalnum() else "_" for c in base_name])
        
        conn = get_conn()
        df.to_sql(table_id, conn, if_exists='replace', index=False)
        conn.close()
        
        set_active_table(table_id)
        
        return {
            "message": "Dataset indexed",
            "columns": df.columns.tolist(),
            "table": table_id
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

class Query(BaseModel):
    question: str
    history: list = []  

@app.post("/ask")
def process_query(request: Query):
    if not os.path.exists(DB_PATH):
        return {"answer": "No dataset found. Please upload a CSV."}

    try:
        active_table = get_active_table()
        db_engine = SQLDatabase.from_uri(f"sqlite:///{DB_PATH}")
        
        key = os.getenv("GROQ_API_KEY")
        if not key:
            return {"answer": "Missing API configuration."}

        llm = ChatGroq(
            model="llama-3.3-70b-versatile",
            temperature=0,
            api_key=key
        )

        agent = create_sql_agent(
            llm=llm,
            db=db_engine,
            agent_type="zero-shot-react-description",
            verbose=False,
            handle_parsing_errors=True
        )

        # Build context from history
        context_str = ""
        if request.history:
            context_str = "\n\nPREVIOUS CONVERSATION:\n"
            for msg in request.history[-6:]: # Keep last 6 messages
                role = "User" if msg['role'] == 'user' else "Assistant"
                context_str += f"{role}: {msg['content']}\n"
            instructions = (
            f"\n\nYou are the DataPulse Neural Engine. "
            f"\nActive table: '{active_table}'. "
            f"{context_str}"
            "\n\nRULES:"
            "\n1. For charts, provide a summary then JSON inside ```json ... ``` blocks."
            "\n2. JSON Format: {\"type\": \"chart\", \"chartType\": \"bar|line|pie|area\", \"data\": [...], \"xAxis\": \"col\", \"yAxis\": \"col\", \"title\": \"text\"}."
            f"\n3. You have permission to UPDATE/DELETE records on '{active_table}' BUT ONLY IF the user explicitly confirms in the  CONVERSATION (e.g. 'yes', 'proceed')."
            "\n   - If the user asks to delete/update and hasn't confirmed, DO NOT execute. Instead return: '⚠️ I am about to [action]. Do you want to proceed?'"
            "\n4. ALWAYS append the generated SQL query at the very end of your response in a markdown block like this:\n```sql\nSELECT ...\n```"
        )

        max_retries = 3
        base_delay = 2

        for attempt in range(max_retries):
            try:
                response = agent.invoke({"input": request.question + instructions})
                result = response["output"]
                return {"answer": result}
            except Exception as e:
                if ("rate_limit" in str(e) or "429" in str(e)) and attempt < max_retries - 1:
                    sleep_time = base_delay * (2 ** attempt) + random.uniform(0, 1)
                    print(f"Rate limit hit. Retrying in {sleep_time:.2f}s...")
                    time.sleep(sleep_time)
                else:
                    raise e

    except Exception as e:
        raw_err = str(e)
        if "rate_limit" in raw_err or "429" in raw_err:
            return {"answer": "🚀 **Engine Heat:** Too many requests. I tried to cool down but the pulse is still unstable. Please wait a minute."}
        return {"answer": "The neural engine encountered a ripple. Please retry your query."}

@app.get("/download")
def export_data():
    if not os.path.exists(DB_PATH):
        raise HTTPException(status_code=404, detail="Empty database")

    try:
        table = get_active_table()
        conn = get_conn()
        df = pd.read_sql_query(f"SELECT * FROM {table}", conn)
        conn.close()
        
        buffer = io.StringIO()
        df.to_csv(buffer, index=False)
        
        resp = Response(content=buffer.getvalue(), media_type="text/csv")
        resp.headers["Content-Disposition"] = f"attachment; filename={table}_export.csv"
        return resp
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
