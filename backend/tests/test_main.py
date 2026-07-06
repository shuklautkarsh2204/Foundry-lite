from fastapi.testclient import TestClient

from backend.main import app


def test_root_endpoint_is_available():
    client = TestClient(app)
    response = client.get("/")

    assert response.status_code == 200
    assert response.json()["status"] == "running"
