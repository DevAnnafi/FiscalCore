from fastapi import FastAPI
from app.core.config import settings
from app.api.routes import router
from fastapi.middleware.cors import CORSMiddleware
from app.api.auth import router as auth_router
from app.api.scenarios import router as scenarios_router
from app.api.payments import router as payments_router
from app.api.profile import router as profile_router
from app.api.mfa import router as mfa_router
from app.api.contact import router as contact_router

def create_app() -> FastAPI:
    app = FastAPI(
        title=settings.app_name,
        debug=settings.debug,
    )

    app.add_middleware(
        CORSMiddleware,
        allow_origins=[
            "http://localhost:3000",
            "https://fiscalcore.net",
            ],
        allow_methods=["*"],
        allow_headers=["*"],
        allow_credentials=True
        )

    app.include_router(router, prefix=settings.api_prefix)
    app.include_router(auth_router, prefix=settings.api_prefix + "/auth")
    app.include_router(scenarios_router, prefix=settings.api_prefix)
    app.include_router(payments_router, prefix=settings.api_prefix)
    app.include_router(profile_router, prefix=settings.api_prefix)
    app.include_router(mfa_router, prefix=settings.api_prefix)
    app.include_router(contact_router, prefix=settings.api_prefix)

    return app


app = create_app()
