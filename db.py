import os
import sqlite3

DB_PATH = os.getenv("DB_PATH", "tracker.db")

def get_connection():
    dirname = os.path.dirname(DB_PATH)
    if dirname:
        os.makedirs(dirname, exist_ok=True)
    return sqlite3.connect(DB_PATH)

def init_db():
    connect = get_connection()
    cursor = connect.cursor()
    cursor.execute("""
        CREATE TABLE IF NOT EXISTS user_cycles (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            user_id INTEGER,
            start_date TEXT,
            end_date TEXT,
            cycle_length INTEGER DEFAULT 28
        )
    """)
    connect.commit()
    connect.close()

def get_all_cycles(user_id):
    with get_connection() as conn:
        cursor = conn.cursor()
        cursor.execute("SELECT id, start_date, end_date, cycle_length FROM user_cycles WHERE user_id = ?", (user_id,))
        return cursor.fetchall()

def get_latest_cycle(user_id):
    with get_connection() as conn:
        cursor = conn.cursor()
        cursor.execute("SELECT start_date, end_date, cycle_length FROM user_cycles WHERE user_id = ? ORDER BY start_date DESC LIMIT 1", (user_id,))
        return cursor.fetchone()

def save_cycle(user_id, start_date, end_date, cycle_length=28):
    with get_connection() as conn:
        cursor = conn.cursor()
        cursor.execute("INSERT INTO user_cycles (user_id, start_date, end_date, cycle_length) VALUES (?, ?, ?, ?)", (user_id, start_date, end_date, cycle_length,))
