from fastapi import FastAPI
from app.core.config import settings
from app.api.routes import router
from fastapi.middleware.cors import CORSMiddleware
from app.api.auth import router as auth_router

def create_app() -> FastAPI:
    app = FastAPI(
        title=settings.app_name,
        debug=settings.debug,
    )

    app.add_middleware(
        CORSMiddleware,
        allow_origins=["http://localhost:3000"],
        allow_methods=["*"],
        allow_headers=["*"],
        allow_credentials=True
        )

    app.include_router(router, prefix=settings.api_prefix)
    app.include_router(auth_router, prefix=settings.api_prefix + "/auth")

    return app


app = create_app()
