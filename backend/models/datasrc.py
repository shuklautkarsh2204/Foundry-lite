from sqlalchemy import Column
from sqlalchemy import Integer
from sqlalchemy import String
from sqlalchemy import JSON

from database.base import Base


class DataSource(Base):

    __tablename__ = "data_sources"

    id = Column(Integer, primary_key=True, index=True)

    filename = Column(String)

    row_count = Column(Integer)

    columns = Column(JSON)

    schema = Column(JSON)