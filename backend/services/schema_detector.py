import pandas as pd

def detect_schema(df):
    schema = []
    
    for column in df.columns:
        
        dtype = str(df[column].dtype)
        
        if "int" in dtype:
            schema[column] = "integer"
        
        elif "float" in dtype:
            schema[column] = "float"
        
        elif "datetime" in dtype:
            schema[column] = "datetime"
        
        else:
            schema[column] = "string"
    
    return schema