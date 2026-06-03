import os


DB_PARAMS = {
    "host": os.getenv("DB_HOST", "localhost"),
    "port": int(os.getenv("DB_PORT", 5432)),
    "user": os.getenv("DB_USER", "forge_admin"),
    "password": os.getenv("DB_PASSWORD", "forge_secure_password123"),
    "database": os.getenv("DB_NAME", "pokeforge"),
}

JWT_SECRET_KEY = os.getenv("JWT_SECRET_KEY")
