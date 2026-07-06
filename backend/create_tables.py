from backend.database.connection import engine
from backend.database.base import Base
from backend.models.datasrc import DataSource
from backend.models.lineage import DatasetLineage

Base.metadata.create_all(bind=engine)

print("Tables Created")