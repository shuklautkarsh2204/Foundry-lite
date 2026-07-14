from sqlalchemy import Column, Integer, String
from backend.database.base import Base

class DatasetLineage(Base):
    __tablename__ = "dataset_lineage"
    id = Column(Integer, primary_key = True, index = True)
    parent_dataset_id = Column(Integer)
    child_dataset_id = Column(Integer)
    operation = Column(String)
