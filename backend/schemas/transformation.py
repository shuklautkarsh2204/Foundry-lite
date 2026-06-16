from pydantic import BaseModel

class FilterRequest(BaseModel):
    column: str
    value: str
    
class SelectColumnRequest(BaseModel):
    columns: list[str]