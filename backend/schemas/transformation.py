from pydantic import BaseModel

class FilterRequest(BaseModel):
    column: str
    value: str
    
class SelectColumnRequest(BaseModel):
    columns: list[str]

class RenameColumnRequest(BaseModel):
    old_column: str
    new_column: str
    
class SortRequest(BaseModel):
    column: str
    ascending: bool