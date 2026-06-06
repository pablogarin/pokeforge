import jwt
from fastapi import Request
from strawberry.fastapi import GraphQLRouter, BaseContext
from typing import Optional


class GraphQLContext(BaseContext):
    def __init__(self, request: Request, jwt_secret: str):
        super().__init__()
        self.request = request
        self.jwt_secret = jwt_secret

    @property
    def user_id(self) -> Optional[int]:
        session_cookie = self.request.cookies.get("pokeforge_session")
        if not session_cookie:
            return None
        try:
            decoded = jwt.decode(session_cookie, self.jwt_secret, algorithms=["HS256"])
            return decoded["user_id"]
        except Exception as e:
            print(f"Error decoding token: {e}")
            return None
