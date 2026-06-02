from config import DB_PARAMS
from contextlib import contextmanager
import psycopg2
from psycopg2.extras import RealDictCursor


@contextmanager
def get_db_cursor():
    conn = psycopg2.connect(**DB_PARAMS, cursor_factory=RealDictCursor)
    cursor = conn.cursor()
    try:
        yield cursor
        conn.commit()
    except Exception as err:
        conn.rollback()
        raise err
    finally:
        cursor.close()
        conn.close()
