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
    
class JoinRequest(BaseModel):
    left_dataset_id: int
    right_dataset_id: int
    join_column: str    

class AggregateRequest(BaseModel):
    group_by: str
    target_column: str
    operation: str    