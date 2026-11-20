
import os
from datetime import datetime, timedelta, timezone

import jwt


ALGORITHM = "HS256"
ACCESS_TOKEN_EXPIRE_MINUTES = 30


def create_access_token(user_id: int) -> str:
    secret_key = os.getenv("SECRET_KEY")

    if not secret_key:
        raise RuntimeError("SECRET_KEY is not configured.")

    expires = datetime.now(timezone.utc) + timedelta(
        minutes=ACCESS_TOKEN_EXPIRE_MINUTES
    )

    payload = {
        "sub": str(user_id),
        "exp": expires,
    }

    return jwt.encode(
        payload,
        secret_key,
        algorithm=ALGORITHM
    )


def verify_access_token(token: str):
    secret_key = os.getenv("SECRET_KEY")

    if not secret_key:
        raise RuntimeError("SECRET_KEY is not configured.")

    try:
        payload = jwt.decode(
            token,
            secret_key,
            algorithms=[ALGORITHM]
        )

        return payload

    except jwt.InvalidTokenError:
        return None
