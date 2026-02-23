from fastapi import FastAPI

from app.core.config import settings
from app.api.routes import router


def create_app() -> FastAPI:
    app = FastAPI(
        title=settings.app_name,
        debug=settings.debug,
    )

    app.include_router(router, prefix=settings.api_prefix)

    return app


app = create_app()
