from sqlalchemy import Column
from sqlalchemy import Integer
from sqlalchemy import String
from sqlalchemy import JSON
from sqlalchemy import DateTime
from datetime import datetime, UTC

from database.base import Base


class DataSource(Base):

    __tablename__ = "data_sources"

    id = Column(Integer, primary_key=True, index=True)

    filename = Column(String)

    row_count = Column(Integer)

    columns = Column(JSON)

    schema = Column(JSON)
    
    file_path = Column(String)

    uploaded_at = Column(
        DateTime,
        default= lambda: datetime.now(UTC)
    )