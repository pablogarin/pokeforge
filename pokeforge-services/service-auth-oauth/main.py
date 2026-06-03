import os
import jwt
import datetime
from fastapi import FastAPI, HTTPException, Response, Cookie
from fastapi.responses import RedirectResponse
import requests
import psycopg2
from psycopg2.extras import RealDictCursor

# 1. Environment and Security Variables
GOOGLE_CLIENT_ID = os.getenv("GOOGLE_CLIENT_ID")
GOOGLE_CLIENT_SECRET = os.getenv("GOOGLE_CLIENT_SECRET")
GOOGLE_REDIRECT_URI = os.getenv("GOOGLE_REDIRECT_URI")
JWT_SECRET_KEY = os.getenv("JWT_SECRET_KEY")

DB_PARAMS = {
    "host": os.getenv("DB_HOST", "localhost"),
    "port": int(os.getenv("DB_PORT", 5432)),
    "user": os.getenv("DB_USER", "forge_admin"),
    "password": os.getenv("DB_PASSWORD", "forge_secure_password123"),
    "database": os.getenv("DB_NAME", "pokeforge"),
}

app = FastAPI(title="PokeForge Authentication Service")


@app.get("/api/v1/auth/login")
def get_google_auth_url():
    """Step 1: Redirects the user's browser directly to the Google login screen."""
    google_url = (
        f"https://accounts.google.com/o/oauth2/v2/auth?"
        f"client_id={GOOGLE_CLIENT_ID}&"
        f"redirect_uri={GOOGLE_REDIRECT_URI}&"
        f"response_type=code&"
        f"scope=openid%20email%20profile"
    )
    return RedirectResponse(url=google_url)


@app.get("/api/v1/auth/callback")
def handle_google_callback(code: str, response: Response):
    """Step 2: Receives Google's authorization code and provisions the session."""
    # 1. Exchange authorization code for access tokens
    token_url = "https://googleapis.com"
    token_payload = {
        "code": code,
        "client_id": GOOGLE_CLIENT_ID,
        "client_secret": GOOGLE_CLIENT_SECRET,
        "redirect_uri": GOOGLE_REDIRECT_URI,
        "grant_type": "authorization_code",
    }

    token_res = requests.post(token_url, data=token_payload).json()
    access_token = token_res.get("access_token")

    if not access_token:
        raise HTTPException(
            status_code=400,
            detail="Authorization handshake failed with Google ID providers.",
        )

    # 2. Pull user profile information using the access token
    profile_url = "https://googleapis.com"
    profile_headers = {"Authorization": f"Bearer {access_token}"}
    user_info = requests.get(profile_url, headers=profile_headers).json()

    google_id = user_info.get("id")
    email = user_info.get("email")
    display_name = user_info.get("name")
    avatar_url = user_info.get("picture")

    if not google_id or not email:
        raise HTTPException(
            status_code=400,
            detail="Incomplete account details returned by identity profile fields.",
        )

    # 3. Upsert user records inside your PostgreSQL container
    conn = psycopg2.connect(**DB_PARAMS, cursor_factory=RealDictCursor)
    cursor = conn.cursor()
    cursor.execute(
        """
        INSERT INTO users (email, google_id, display_name, avatar_url)
        VALUES (%s, %s, %s, %s)
        ON CONFLICT (google_id) DO UPDATE SET
            display_name = EXCLUDED.display_name,
            avatar_url = EXCLUDED.avatar_url
        RETURNING id;
    """,
        (email, google_id, display_name, avatar_url),
    )
    db_user = cursor.fetchone()
    conn.commit()
    cursor.close()
    conn.close()

    # 4. Generate a stateless JWT application session token
    expiration = datetime.datetime.utcnow() + datetime.timedelta(days=7)
    jwt_payload = {"user_id": db_user["id"], "email": email, "exp": expiration}
    encoded_jwt = jwt.encode(jwt_payload, JWT_SECRET_KEY, algorithm="HS256")

    # 5. Delivery token securely inside an HttpOnly cookie parameter
    response.set_cookie(
        key="pokeforge_session",
        value=encoded_jwt,
        httponly=True,
        secure=False,  # Set to True inside high-availability production https environments
        samesite="lax",
        expires=expiration.strftime("%a, %d-%b-%Y %H:%M:%S GMT"),
    )

    # Redirect back to your future React presentation layer dashboard route shell
    return RedirectResponse(url="http://localhost:3000/dashboard")


@app.get("/api/v1/auth/me")
def get_current_session_profile(pokeforge_session: str = Cookie(None)):
    """Verifies user session token validity across downstream endpoints."""
    if not pokeforge_session:
        raise HTTPException(
            status_code=401, detail="Missing active authentication session cookie."
        )

    try:
        decoded = jwt.decode(pokeforge_session, JWT_SECRET_KEY, algorithms=["HS256"])
        return {
            "authenticated": True,
            "user_id": decoded["user_id"],
            "email": decoded["email"],
        }
    except jwt.ExpiredSignatureError:
        raise HTTPException(
            status_code=401, detail="Session validation tracking signature has expired."
        )
    except jwt.InvalidTokenError:
        raise HTTPException(
            status_code=401,
            detail="Tampered or invalid session token configuration detected.",
        )
