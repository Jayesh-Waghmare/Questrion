import psycopg2
import os
from psycopg2.extras import RealDictCursor

def get_db_connection():
    try:
        database_url = os.getenv("DATABASE_URL")
        if not database_url:
            raise Exception("DATABASE_URL environment variable is not set")
            
        conn = psycopg2.connect(
            database_url,
            cursor_factory=RealDictCursor
        )
        return conn
    except Exception as e:
        raise e

def init_db():
    conn = get_db_connection()
    cur = conn.cursor()
    try:
        cur.execute("""
        CREATE TABLE IF NOT EXISTS creations (
            id VARCHAR PRIMARY KEY,
            user_id VARCHAR NOT NULL,
            prompt VARCHAR,
            content TEXT,
            type VARCHAR,
            pdf_content TEXT,
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
            publish BOOLEAN DEFAULT FALSE
        );
        """)

        cur.execute("""
        CREATE TABLE IF NOT EXISTS chat_messages (
            id SERIAL PRIMARY KEY,
            user_id VARCHAR NOT NULL,
            conversation_id VARCHAR,
            message TEXT,
            response TEXT,
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
            FOREIGN KEY (conversation_id) REFERENCES creations(id) ON DELETE CASCADE
        );
        """)

        conn.commit()
    except Exception as e:
        conn.rollback()
        raise e
    finally:
        cur.close()
        conn.close()
