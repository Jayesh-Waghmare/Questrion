from fastapi import Request, Depends, HTTPException
from fastapi_clerk_auth import ClerkConfig, ClerkHTTPBearer, HTTPAuthorizationCredentials
from clerk_backend_api import Clerk
import os
from dotenv import load_dotenv

load_dotenv()

clerk_config = ClerkConfig(
    jwks_url=f"https://{os.getenv('CLERK_FRONTEND_API')}/.well-known/jwks.json"
)

clerk_auth_guard = ClerkHTTPBearer(config=clerk_config)

clerk_client = Clerk(os.getenv("CLERK_SECRET_KEY"))
async def auth(
    request: Request,
    credentials: HTTPAuthorizationCredentials = Depends(clerk_auth_guard)
):
    if not credentials:
        raise HTTPException(status_code=401, detail="Authorization header missing")

    sub = credentials.decoded.get("sub")
    if not sub:
        raise HTTPException(status_code=401, detail="Invalid token: no subject")

    request.state.user_id = sub
    return sub