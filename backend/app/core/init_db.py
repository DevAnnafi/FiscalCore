from app.core.database import Base, engine
from app.models.user import User
from app.models.scenario import Scenario

Base.metadata.create_all(bind=engine)