import streamlit as st
import pandas as pd
import sqlite3
import os
import json
from langchain_community.utilities import SQLDatabase
from langchain_community.agent_toolkits import create_sql_agent
from langchain_groq import ChatGroq
from dotenv import load_dotenv

# Page config
st.set_page_config(page_title="DataPulse AI", page_icon="🧩", layout="wide")
load_dotenv()

# Constants
DB_PATH = "mini_data.db"

# --- Database Helper Functions ---
def get_connection():
    return sqlite3.connect(DB_PATH)

def init_database():
    """Ensure the db exists"""
    conn = get_connection()
    conn.close()

def save_uploaded_file(uploaded_file):
    """Load the CSV to SQLite"""
    try:
        df = pd.read_csv(uploaded_file)
        # Clean columns
        df.columns = [c.strip().replace(" ", "_").lower() for c in df.columns]
        
        # Create a table name from filename
        base_name = os.path.splitext(uploaded_file.name)[0].lower()
        table_name = "".join([c if c.isalnum() else "_" for c in base_name])
        
        conn = get_connection()
        df.to_sql(table_name, conn, if_exists='replace', index=False)
        conn.close()
        
        # Save metadata about active table
        st.session_state['active_table'] = table_name
        return table_name, df.columns.tolist()
    except Exception as e:
        st.error(f"Error processing file: {e}")
        return None, None

def get_agent():
    """Create the SQL Agent"""
    api_key = os.getenv("GROQ_API_KEY")
    if not api_key:
        # Try to get from streamlit secrets if env not set
        if "GROQ_API_KEY" in st.secrets:
            api_key = st.secrets["GROQ_API_KEY"]
        else:
            return None

    db = SQLDatabase.from_uri(f"sqlite:///{DB_PATH}")
    llm = ChatGroq(
        model="llama-3.3-70b-versatile",
        temperature=0,
        api_key=api_key
    )
    
    return create_sql_agent(
        llm=llm,
        db=db,
        agent_type="zero-shot-react-description",
        verbose=True,
        handle_parsing_errors=True
    )

# --- UI Setup ---
st.title("🧩 DataPulse AI")
st.caption("Powered by Groq & Llama 3")

# Sidebar for Setup
with st.sidebar:
    st.header("Setup")
    
    # Check for API Key
    if not os.getenv("GROQ_API_KEY") and "GROQ_API_KEY" not in st.secrets:
        st.warning("⚠️ GROQ_API_KEY missing.")
        user_key = st.text_input("Enter Groq API Key", type="password")
        if user_key:
            os.environ["GROQ_API_KEY"] = user_key
            st.rerun()
    
    # File Uploader
    uploaded_file = st.file_uploader("Upload CSV Dataset", type=["csv"])
    if uploaded_file:
        # Check if we already processed this specific file to avoid reloading on every rerun
        if 'last_uploaded' not in st.session_state or st.session_state['last_uploaded'] != uploaded_file.name:
            with st.spinner("Indexing data..."):
                table, cols = save_uploaded_file(uploaded_file)
                if table:
                    st.session_state['last_uploaded'] = uploaded_file.name
                    st.success(f"Loaded: **{table}**")
                    st.write("Columns:", cols)
        elif 'active_table' in st.session_state:
            st.info(f"Active Table: **{st.session_state['active_table']}**")

    # Clear History Button
    if st.button("Clear Chat History"):
        st.session_state['messages'] = []
        st.rerun()

# Initialize Chat History
if "messages" not in st.session_state:
    st.session_state["messages"] = [{"role": "assistant", "content": "Hello! Upload a CSV and ask me anything about your data."}]

# Display Chat Messages
for msg in st.session_state.messages:
    if msg["role"] == "user":
        st.chat_message("user").write(msg["content"])
    else:
        with st.chat_message("assistant"):
            st.write(msg["content"])
            # If there was a chart data block in a previous message (stored in tuple/dict?), we could render it.
            # Simpler: The agent output usually contains the answer. If we want charts, we handle it below.
            if "chart_data" in msg:
                 chart = msg["chart_data"]
                 if chart["chartType"] == "bar":
                     st.bar_chart(data=chart["data"], x=chart["xAxis"], y=chart["yAxis"])
                 elif chart["chartType"] == "line":
                     st.line_chart(data=chart["data"], x=chart["xAxis"], y=chart["yAxis"])
                 # Add other types as needed

# Chat Input
if prompt := st.chat_input("Ask a question about your data..."):
    # Add user message
    st.session_state.messages.append({"role": "user", "content": prompt})
    st.chat_message("user").write(prompt)

    # Generate Response
    with st.chat_message("assistant"):
        agent = get_agent()
        if not agent:
            st.error("Please provide a Groq API Key to continue.")
        elif 'active_table' not in st.session_state:
            st.warning("Please upload a CSV file first.")
        else:
            with st.spinner("Thinking..."):
                try:
                    # Construct instructions
                    active_table = st.session_state['active_table']
                    history_str = "\n".join([f"{m['role']}: {m['content']}" for m in st.session_state.messages[-4:-1]])
                    
                    instructions = (
                        f"\n\nContext: Active table is '{active_table}'. Recent history:\n{history_str}\n"
                        "RULES:\n"
                        "1. If the user asks for a visualization, return a summary text AND a JSON object strictly in this format inside a code block:\n"
                        "```json\n"
                        "{\"type\": \"chart\", \"chartType\": \"bar|line\", \"data\": [{\"col1\": val, \"col2\": val}, ...], \"xAxis\": \"col_name\", \"yAxis\": \"col_name\"}\n"
                        "```\n"
                        "2. For bar/line charts, 'data' must be a list of dictionaries representing the rows to plot. 'xAxis' is the category column, 'yAxis' is the value column."
                    )
                    
                    response = agent.invoke({"input": prompt + instructions})
                    result_text = response["output"]
                    
                    # Extract Chart JSON
                    chart_data = None
                    try:
                        import re
                        match = re.search(r'```json\s*(\{.*?\})\s*```', result_text, re.DOTALL)
                        if match:
                            json_str = match.group(1)
                            parsed = json.loads(json_str)
                            if parsed.get("type") == "chart":
                                chart_data = parsed
                                # Clean the text to hide the raw JSON if desired
                                # result_text = result_text.replace(match.group(0), "") 
                    except Exception as e:
                        pass # JSON parse fail, just show text

                    st.write(result_text)
                    
                    if chart_data:
                        if chart_data["chartType"] in ["bar", "line"]:
                            df_chart = pd.DataFrame(chart_data["data"])
                            if chart_data["chartType"] == "bar":
                                st.bar_chart(df_chart, x=chart_data["xAxis"], y=chart_data["yAxis"])
                            elif chart_data["chartType"] == "line":
                                st.line_chart(df_chart, x=chart_data["xAxis"], y=chart_data["yAxis"])
                    
                    # Save to history
                    msg_data = {"role": "assistant", "content": result_text}
                    if chart_data:
                        msg_data["chart_data"] = chart_data
                    st.session_state.messages.append(msg_data)
                    
                except Exception as e:
                    st.error(f"Error: {str(e)}")
