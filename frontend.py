import streamlit as st
import requests
import pandas as pd
import json
from typing import Optional

# Configuration
API_BASE_URL = "http://localhost:8000"

# Page configuration
st.set_page_config(
    page_title="GraphForge AI - Frontend",
    page_icon="📊",
    layout="wide",
    initial_sidebar_state="expanded"
)

st.title("📊 GraphForge AI - Data Discovery & Transformation")
st.markdown("---")

# Sidebar navigation
with st.sidebar:
    st.header("Navigation")
    page = st.radio(
        "Select an option:",
        [
            "🏠 Dashboard",
            "📤 Upload Dataset",
            "📋 View Datasets",
            "🔍 Dataset Analysis",
            "🔄 Transform Data",
            "🔗 Relationships",
            "📍 Lineage",
        ]
    )
    st.markdown("---")
    st.info("Backend URL: " + API_BASE_URL)
    
    # Health check
    try:
        response = requests.get(f"{API_BASE_URL}/")
        if response.status_code == 200:
            st.success("✅ Backend is running")
        else:
            st.error("❌ Backend is not responding correctly")
    except:
        st.error("❌ Cannot reach backend")


def handle_api_error(response):
    """Display API errors in Streamlit"""
    if response.status_code != 200 and response.status_code != 201:
        try:
            error_data = response.json()
            st.error(f"API Error: {error_data}")
        except:
            st.error(f"API Error {response.status_code}: {response.text}")
        return False
    return True


# ======================== DASHBOARD ========================
if page == "🏠 Dashboard":
    st.header("Dashboard")
    col1, col2 = st.columns(2)
    
    with col1:
        st.subheader("📊 Quick Stats")
        try:
            response = requests.get(f"{API_BASE_URL}/sources")
            if handle_api_error(response):
                datasets = response.json()
                st.metric("Total Datasets", len(datasets))
        except Exception as e:
            st.error(f"Error fetching datasets: {e}")
    
    with col2:
        st.subheader("🔗 System Status")
        try:
            health = requests.get(f"{API_BASE_URL}/")
            if health.status_code == 200:
                st.success("Backend: Running")
                data = health.json()
                st.json(data)
        except Exception as e:
            st.error(f"Error: {e}")


# ======================== UPLOAD DATASET ========================
elif page == "📤 Upload Dataset":
    st.header("Upload a Dataset")
    
    uploaded_file = st.file_uploader(
        "Choose a CSV file",
        type="csv",
        help="Upload a CSV file to analyze"
    )
    
    if uploaded_file is not None:
        st.write(f"📁 File: **{uploaded_file.name}**")
        st.write(f"📏 Size: **{uploaded_file.size / 1024:.2f} KB**")
        
        if st.button("🚀 Upload", key="upload_btn"):
            with st.spinner("Uploading..."):
                try:
                    files = {"file": (uploaded_file.name, uploaded_file)}
                    response = requests.post(
                        f"{API_BASE_URL}/sources/upload",
                        files=files
                    )
                    
                    if handle_api_error(response):
                        result = response.json()
                        st.success(f"✅ Dataset uploaded successfully!")
                        st.json(result)
                        
                        # Display preview
                        st.subheader("📋 Data Preview")
                        if "preview" in result:
                            preview_df = pd.DataFrame(result["preview"])
                            st.dataframe(preview_df)
                except Exception as e:
                    st.error(f"Upload failed: {e}")


# ======================== VIEW DATASETS ========================
elif page == "📋 View Datasets":
    st.header("Available Datasets")
    
    try:
        response = requests.get(f"{API_BASE_URL}/sources")
        if handle_api_error(response):
            datasets = response.json()
            
            if not datasets:
                st.info("No datasets uploaded yet. Upload one in the 'Upload Dataset' section.")
            else:
                st.write(f"Found **{len(datasets)}** dataset(s)")
                
                # Display as table
                datasets_df = pd.DataFrame(datasets)
                st.dataframe(datasets_df, use_container_width=True)
                
                # Select dataset for detailed view
                if datasets:
                    st.subheader("View Details")
                    dataset_ids = [str(d["id"]) for d in datasets]
                    selected_id = st.selectbox(
                        "Select a dataset:",
                        dataset_ids,
                        format_func=lambda x: f"ID {x}: {[d['filename'] for d in datasets if str(d['id']) == x][0]}"
                    )
                    
                    if selected_id:
                        response = requests.get(f"{API_BASE_URL}/sources/{selected_id}")
                        if handle_api_error(response):
                            details = response.json()
                            st.json(details)
                            
                            # Display preview
                            col1, col2 = st.columns(2)
                            with col1:
                                if st.button(f"📊 Preview Dataset {selected_id}"):
                                    preview_response = requests.get(
                                        f"{API_BASE_URL}/sources/{selected_id}/preview"
                                    )
                                    if handle_api_error(preview_response):
                                        preview = preview_response.json()
                                        preview_df = pd.DataFrame(preview["preview"])
                                        st.dataframe(preview_df)
    except Exception as e:
        st.error(f"Error fetching datasets: {e}")


# ======================== DATASET ANALYSIS ========================
elif page == "🔍 Dataset Analysis":
    st.header("Dataset Analysis")
    
    try:
        response = requests.get(f"{API_BASE_URL}/sources")
        if handle_api_error(response):
            datasets = response.json()
            
            if not datasets:
                st.info("No datasets available. Please upload one first.")
            else:
                dataset_ids = [str(d["id"]) for d in datasets]
                selected_id = st.selectbox(
                    "Select a dataset to analyze:",
                    dataset_ids,
                    format_func=lambda x: f"ID {x}: {[d['filename'] for d in datasets if str(d['id']) == x][0]}"
                )
                
                if selected_id:
                    analysis_type = st.radio(
                        "Choose analysis type:",
                        ["Profile", "Quality Report", "Ontology", "Metrics", "Graph", "AI Context"]
                    )
                    
                    if st.button("📊 Run Analysis"):
                        with st.spinner("Running analysis..."):
                            try:
                                if analysis_type == "Profile":
                                    response = requests.get(
                                        f"{API_BASE_URL}/sources/{selected_id}/profile"
                                    )
                                elif analysis_type == "Quality Report":
                                    response = requests.get(
                                        f"{API_BASE_URL}/sources/{selected_id}/quality-report"
                                    )
                                elif analysis_type == "Ontology":
                                    response = requests.post(
                                        f"{API_BASE_URL}/sources/{selected_id}/ontology/generate"
                                    )
                                elif analysis_type == "Metrics":
                                    response = requests.get(
                                        f"{API_BASE_URL}/sources/{selected_id}/metrics"
                                    )
                                elif analysis_type == "Graph":
                                    response = requests.get(
                                        f"{API_BASE_URL}/sources/{selected_id}/graph"
                                    )
                                else:  # AI Context
                                    response = requests.get(
                                        f"{API_BASE_URL}/sources/{selected_id}/ai-context"
                                    )
                                
                                if handle_api_error(response):
                                    result = response.json()
                                    st.json(result)
                            except Exception as e:
                                st.error(f"Analysis failed: {e}")
    except Exception as e:
        st.error(f"Error: {e}")


# ======================== TRANSFORM DATA ========================
elif page == "🔄 Transform Data":
    st.header("Data Transformations")
    
    try:
        response = requests.get(f"{API_BASE_URL}/sources")
        if handle_api_error(response):
            datasets = response.json()
            
            if not datasets:
                st.info("No datasets available. Please upload one first.")
            else:
                transform_type = st.selectbox(
                    "Select transformation:",
                    ["Filter", "Select Columns", "Rename Column", "Sort", "Join", "Aggregate"]
                )
                
                dataset_ids = [str(d["id"]) for d in datasets]
                
                if transform_type == "Filter":
                    st.subheader("Filter Dataset")
                    source_id = st.selectbox(
                        "Select dataset:",
                        dataset_ids,
                        key="filter_dataset"
                    )
                    
                    # Get dataset details to show columns
                    details_response = requests.get(f"{API_BASE_URL}/sources/{source_id}")
                    if handle_api_error(details_response):
                        details = details_response.json()
                        columns = details.get("columns", [])
                        
                        column = st.selectbox("Select column to filter:", columns)
                        value = st.text_input("Filter value:")
                        
                        if st.button("🚀 Apply Filter"):
                            with st.spinner("Filtering..."):
                                try:
                                    payload = {"column": column, "value": value}
                                    response = requests.post(
                                        f"{API_BASE_URL}/sources/{source_id}/filter",
                                        json=payload
                                    )
                                    if handle_api_error(response):
                                        result = response.json()
                                        st.success("✅ Filter applied!")
                                        st.json(result)
                                except Exception as e:
                                    st.error(f"Filter failed: {e}")
                
                elif transform_type == "Select Columns":
                    st.subheader("Select Columns")
                    source_id = st.selectbox(
                        "Select dataset:",
                        dataset_ids,
                        key="select_dataset"
                    )
                    
                    details_response = requests.get(f"{API_BASE_URL}/sources/{source_id}")
                    if handle_api_error(details_response):
                        details = details_response.json()
                        columns = details.get("columns", [])
                        
                        selected_columns = st.multiselect(
                            "Select columns to keep:",
                            columns
                        )
                        
                        if st.button("🚀 Apply Selection"):
                            with st.spinner("Selecting columns..."):
                                try:
                                    payload = {"columns": selected_columns}
                                    response = requests.post(
                                        f"{API_BASE_URL}/sources/{source_id}/select-columns",
                                        json=payload
                                    )
                                    if handle_api_error(response):
                                        result = response.json()
                                        st.success("✅ Columns selected!")
                                        st.json(result)
                                except Exception as e:
                                    st.error(f"Selection failed: {e}")
                
                elif transform_type == "Rename Column":
                    st.subheader("Rename Column")
                    source_id = st.selectbox(
                        "Select dataset:",
                        dataset_ids,
                        key="rename_dataset"
                    )
                    
                    details_response = requests.get(f"{API_BASE_URL}/sources/{source_id}")
                    if handle_api_error(details_response):
                        details = details_response.json()
                        columns = details.get("columns", [])
                        
                        old_column = st.selectbox("Select column to rename:", columns)
                        new_column = st.text_input("New column name:")
                        
                        if st.button("🚀 Apply Rename"):
                            with st.spinner("Renaming..."):
                                try:
                                    payload = {
                                        "old_column": old_column,
                                        "new_column": new_column
                                    }
                                    response = requests.post(
                                        f"{API_BASE_URL}/sources/{source_id}/rename-column",
                                        json=payload
                                    )
                                    if handle_api_error(response):
                                        result = response.json()
                                        st.success("✅ Column renamed!")
                                        st.json(result)
                                except Exception as e:
                                    st.error(f"Rename failed: {e}")
                
                elif transform_type == "Sort":
                    st.subheader("Sort Dataset")
                    source_id = st.selectbox(
                        "Select dataset:",
                        dataset_ids,
                        key="sort_dataset"
                    )
                    
                    details_response = requests.get(f"{API_BASE_URL}/sources/{source_id}")
                    if handle_api_error(details_response):
                        details = details_response.json()
                        columns = details.get("columns", [])
                        
                        column = st.selectbox("Select column to sort by:", columns)
                        ascending = st.radio("Sort order:", ["Ascending", "Descending"]) == "Ascending"
                        
                        if st.button("🚀 Apply Sort"):
                            with st.spinner("Sorting..."):
                                try:
                                    payload = {
                                        "column": column,
                                        "ascending": ascending
                                    }
                                    response = requests.post(
                                        f"{API_BASE_URL}/sources/{source_id}/sort",
                                        json=payload
                                    )
                                    if handle_api_error(response):
                                        result = response.json()
                                        st.success("✅ Dataset sorted!")
                                        st.json(result)
                                except Exception as e:
                                    st.error(f"Sort failed: {e}")
                
                elif transform_type == "Join":
                    st.subheader("Join Datasets")
                    col1, col2 = st.columns(2)
                    with col1:
                        left_id = st.selectbox(
                            "Select left dataset:",
                            dataset_ids,
                            key="join_left"
                        )
                    with col2:
                        right_id = st.selectbox(
                            "Select right dataset:",
                            dataset_ids,
                            key="join_right"
                        )
                    
                    # Get columns from left dataset
                    left_response = requests.get(f"{API_BASE_URL}/sources/{left_id}")
                    if handle_api_error(left_response):
                        left_columns = left_response.json().get("columns", [])
                        join_column = st.selectbox("Join column:", left_columns)
                        
                        if st.button("🚀 Apply Join"):
                            with st.spinner("Joining datasets..."):
                                try:
                                    payload = {
                                        "left_dataset_id": int(left_id),
                                        "right_dataset_id": int(right_id),
                                        "join_column": join_column
                                    }
                                    response = requests.post(
                                        f"{API_BASE_URL}/sources/join",
                                        json=payload
                                    )
                                    if handle_api_error(response):
                                        result = response.json()
                                        st.success("✅ Datasets joined!")
                                        st.json(result)
                                except Exception as e:
                                    st.error(f"Join failed: {e}")
                
                elif transform_type == "Aggregate":
                    st.subheader("Aggregate Dataset")
                    source_id = st.selectbox(
                        "Select dataset:",
                        dataset_ids,
                        key="agg_dataset"
                    )
                    
                    details_response = requests.get(f"{API_BASE_URL}/sources/{source_id}")
                    if handle_api_error(details_response):
                        details = details_response.json()
                        columns = details.get("columns", [])
                        
                        group_by = st.selectbox("Group by column:", columns)
                        target_column = st.selectbox("Target column:", columns)
                        operation = st.selectbox(
                            "Aggregation operation:",
                            ["sum", "mean", "max", "min", "count"]
                        )
                        
                        if st.button("🚀 Apply Aggregation"):
                            with st.spinner("Aggregating..."):
                                try:
                                    payload = {
                                        "group_by": group_by,
                                        "target_column": target_column,
                                        "operation": operation
                                    }
                                    response = requests.post(
                                        f"{API_BASE_URL}/sources/{source_id}/aggregate",
                                        json=payload
                                    )
                                    if handle_api_error(response):
                                        result = response.json()
                                        st.success("✅ Aggregation applied!")
                                        st.json(result)
                                except Exception as e:
                                    st.error(f"Aggregation failed: {e}")
    except Exception as e:
        st.error(f"Error: {e}")


# ======================== RELATIONSHIPS ========================
elif page == "🔗 Relationships":
    st.header("Discover Data Relationships")
    
    try:
        response = requests.get(f"{API_BASE_URL}/sources")
        if handle_api_error(response):
            datasets = response.json()
            
            if len(datasets) < 2:
                st.info("Need at least 2 datasets to discover relationships.")
            else:
                dataset_ids = [str(d["id"]) for d in datasets]
                
                col1, col2 = st.columns(2)
                with col1:
                    dataset1_id = st.selectbox(
                        "Select first dataset:",
                        dataset_ids,
                        format_func=lambda x: f"ID {x}: {[d['filename'] for d in datasets if str(d['id']) == x][0]}",
                        key="rel_ds1"
                    )
                with col2:
                    dataset2_id = st.selectbox(
                        "Select second dataset:",
                        dataset_ids,
                        format_func=lambda x: f"ID {x}: {[d['filename'] for d in datasets if str(d['id']) == x][0]}",
                        key="rel_ds2"
                    )
                
                if st.button("🔍 Discover Relationships"):
                    with st.spinner("Analyzing relationships..."):
                        try:
                            payload = {
                                "dataset1_id": int(dataset1_id),
                                "dataset2_id": int(dataset2_id)
                            }
                            response = requests.post(
                                f"{API_BASE_URL}/sources/relationships/discover",
                                json=payload
                            )
                            if handle_api_error(response):
                                result = response.json()
                                st.success("✅ Relationships discovered!")
                                
                                if "relationships" in result:
                                    relationships_df = pd.DataFrame(result["relationships"])
                                    st.dataframe(relationships_df, use_container_width=True)
                                    st.json(result)
                        except Exception as e:
                            st.error(f"Relationship discovery failed: {e}")
    except Exception as e:
        st.error(f"Error: {e}")


# ======================== LINEAGE ========================
elif page == "📍 Lineage":
    st.header("Dataset Lineage")
    
    try:
        response = requests.get(f"{API_BASE_URL}/sources")
        if handle_api_error(response):
            datasets = response.json()
            
            if not datasets:
                st.info("No datasets available.")
            else:
                dataset_ids = [str(d["id"]) for d in datasets]
                selected_id = st.selectbox(
                    "Select a dataset to view lineage:",
                    dataset_ids,
                    format_func=lambda x: f"ID {x}: {[d['filename'] for d in datasets if str(d['id']) == x][0]}"
                )
                
                if st.button("📍 Get Lineage"):
                    with st.spinner("Fetching lineage..."):
                        try:
                            response = requests.get(
                                f"{API_BASE_URL}/sources/{selected_id}/lineage"
                            )
                            if handle_api_error(response):
                                result = response.json()
                                st.json(result)
                                
                                if "history" in result and result["history"]:
                                    history_df = pd.DataFrame(result["history"])
                                    st.subheader("Transformation History")
                                    st.dataframe(history_df, use_container_width=True)
                                else:
                                    st.info("No transformation history for this dataset.")
                        except Exception as e:
                            st.error(f"Lineage fetch failed: {e}")
    except Exception as e:
        st.error(f"Error: {e}")

st.markdown("---")
st.caption("GraphForge AI Frontend - Built with Streamlit")
