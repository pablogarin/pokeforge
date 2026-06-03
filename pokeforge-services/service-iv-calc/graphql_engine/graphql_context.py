import jwt
from fastapi import Request
from strawberry.fastapi import GraphQLRouter, BaseContext
from typing import Optional
from config import JWT_SECRET_KEY


class GraphQLContext(BaseContext):
    def __init__(self, request: Request):
        super().__init__()
        self.request = request

    @property
    def user_id(self) -> Optional[int]:
        session_cookie = self.request.cookies.get("pokeforge_session")
        if not session_cookie:
            return None
        try:
            decoded = jwt.decode(session_cookie, JWT_SECRET_KEY, algorithms=["HS256"])
            return decoded["user_id"]
        except Exception:
            return None
