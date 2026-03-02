from pydantic_settings import BaseSettings


class Settings(BaseSettings):
    app_name: str = "FiscalCore"
    debug: bool = False
    api_prefix: str = "/api/v1"
    database_url: str 

    class Config:
        env_file = ".env"


settings = Settings()
