from database.connection import engine
from database.base import Base
import models.datasrc

Base.metadata.create_all(bind=engine)

print("Tables Created")