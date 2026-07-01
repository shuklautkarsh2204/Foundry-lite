import pandas as pd

from services.analytics import build_profile, build_quality_report, build_ontology


def test_build_profile_reports_missing_and_numeric_stats():
    df = pd.DataFrame(
        {
            "customer_id": [1, 2, None],
            "amount": [10.5, 20.0, 30.0],
            "segment": ["A", "", "A"],
        }
    )

    profile = build_profile(df)

    assert profile["customer_id"]["null_count"] == 1
    assert profile["amount"]["min"] == 10.5
    assert profile["segment"]["unique_count"] == 2


def test_build_quality_report_detects_duplicates_and_empty_strings():
    df = pd.DataFrame({"name": ["Alice", "Alice", ""], "amount": [10, 10, 5]})

    report = build_quality_report(df)

    assert report["duplicate_rows"] == 1
    assert report["empty_string_count"]["name"] == 1


def test_build_ontology_infers_customer_entity():
    df = pd.DataFrame(
        {"customer_name": ["Alice"], "email": ["a@example.com"], "total_spend": [100]}
    )

    ontology = build_ontology(df, "customers.csv")

    assert ontology["entity_name"] == "Customer"
