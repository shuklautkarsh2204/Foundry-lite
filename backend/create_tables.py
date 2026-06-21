from database.connection import engine
from database.base import Base
from models.datasrc import DataSource
from models.lineage import DatasetLineage

Base.metadata.create_all(bind=engine)

print("Tables Created")