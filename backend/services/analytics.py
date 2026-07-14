import pandas as pd
import numpy as np


def build_profile(df: pd.DataFrame) -> dict:
    profile = {}
    for column in df.columns:
        series = df[column]
        non_null = series.dropna()
        profile[column] = {
            "dtype": str(series.dtype),
            "null_count": int(series.isna().sum()),
            "unique_count": int(non_null.nunique()),
            "min": None,
            "max": None,
            "mean": None,
        }
        if pd.api.types.is_numeric_dtype(series):
            profile[column]["min"] = float(non_null.min()) if not non_null.empty else None
            profile[column]["max"] = float(non_null.max()) if not non_null.empty else None
            profile[column]["mean"] = float(non_null.mean()) if not non_null.empty else None
        else:
            profile[column]["min"] = str(non_null.min()) if not non_null.empty else None
            profile[column]["max"] = str(non_null.max()) if not non_null.empty else None
    return profile


def build_quality_report(df: pd.DataFrame) -> dict:
    duplicate_rows = int(df.duplicated().sum())
    empty_string_count = {}
    for column in df.columns:
        empty_string_count[column] = int(((df[column].astype(str).str.strip() == "") & (df[column].notna())).sum())
    return {
        "duplicate_rows": duplicate_rows,
        "empty_string_count": empty_string_count,
        "missing_value_count": int(df.isna().sum().sum()),
    }


def build_ontology(df: pd.DataFrame, filename: str) -> dict:
    lower_columns = [column.lower() for column in df.columns]
    joined_columns = " ".join(lower_columns)
    if any(keyword in joined_columns for keyword in ["customer", "client", "customer_name", "cust"]):
        entity_name = "Customer"
    elif any(keyword in joined_columns for keyword in ["product", "sku", "item", "inventory"]):
        entity_name = "Product"
    elif any(keyword in joined_columns for keyword in ["order", "invoice", "sale", "payment"]):
        entity_name = "Order"
    else:
        entity_name = "Dataset"

    return {
        "entity_name": entity_name,
        "source_file": filename,
        "columns": list(df.columns),
        "confidence": 0.8,
    }
