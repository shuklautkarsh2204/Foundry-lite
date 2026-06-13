from sqlalchemy import Column
from sqlalchemy import Integer
from sqlalchemy import String
from sqlalchemy import JSON
from sqlalchemy import DateTime
from sqlalchemy.sql import func
from datetime import datetime

from database.base import Base


class DataSource(Base):

    __tablename__ = "data_sources"

    id = Column(Integer, primary_key=True, index=True)

    filename = Column(String)

    row_count = Column(Integer)

    columns = Column(JSON)

    schema = Column(JSON)

    uploaded_at = Column(
        DateTime,
        server_default=func.now()
    )