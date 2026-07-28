from pydantic_settings import BaseSettings, SettingsConfigDict

class Settings(BaseSettings):
    PROJECT_NAME: str = "CreatorFlow AI"
    VERSION: str = "1.0.0"
    API_V1_STR: str = "/api/v1"
    
    # Database
    DATABASE_URL: str = "sqlite:///./creatorflow.db"
    
    # Backblaze B2
    B2_KEY_ID: str
    B2_APP_KEY: str
    B2_BUCKET: str
    B2_REGION: str = ""
    
    # Genblaze & Google AI
    GOOGLE_API_KEY: str = ""
    GENBLAZE_PROJECT_ID: str = ""

    model_config = SettingsConfigDict(env_file=".env", case_sensitive=True)

settings = Settings()
