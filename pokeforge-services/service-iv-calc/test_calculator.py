import pytest
from fastapi.testclient import TestClient
from main import app


client = TestClient(app)


def test_successfull_calculation():
    payload = {
        "pokemon_id": 6,
        "level": 50,
        "nature": "Adamant",
        "stats": {
            "hp": 153,
            "attack": 149,
            "defense": 98,
            "sp_attack": 102,
            "sp_defense": 105,
            "speed": 120,
        },
        "evs": {
            "hp": 0,
            "attack": 252,
            "defense": 0,
            "sp_attack": 0,
            "sp_defense": 0,
            "speed": 252,
        },
    }

    response = client.post("/api/v1/iv/calculate", json=payload)
    assert response.status_code == 200

    data = response.json()
    assert data["status"] == "success"
    assert data["iv_ranges"]["attack"]["min_iv"] == 31
    assert data["iv_ranges"]["attack"]["max_iv"] == 31


def test_ev_limit_validation_error():
    payload = {
        "pokemon_id": 6,
        "level": 50,
        "nature": "Adamant",
        "stats": {
            "hp": 153,
            "attack": 149,
            "defense": 98,
            "sp_attack": 102,
            "sp_defense": 105,
            "speed": 120,
        },
        "evs": {
            "hp": 0,
            "attack": 252,
            "defense": 10,
            "sp_attack": 0,
            "sp_defense": 0,
            "speed": 252,
        },
    }

    response = client.post("/api/v1/iv/calculate", json=payload)
    assert response.status_code == 422
    assert "Value error" in response.text


def test_invalid_nature_error():
    payload = {
        "pokemon_id": 6,
        "level": 50,
        "nature": "noNature",
        "stats": {
            "hp": 153,
            "attack": 149,
            "defense": 98,
            "sp_attack": 102,
            "sp_defense": 105,
            "speed": 120,
        },
        "evs": {
            "hp": 0,
            "attack": 252,
            "defense": 0,
            "sp_attack": 0,
            "sp_defense": 0,
            "speed": 252,
        },
    }

    response = client.post("/api/v1/iv/calculate", json=payload)
    assert response.status_code == 400
    assert response.json().get("detail") == "Nature noNature is not valid"


def test_invalid_pokemon_error():
    payload = {
        "pokemon_id": 6000,
        "level": 50,
        "nature": "Adamant",
        "stats": {
            "hp": 153,
            "attack": 149,
            "defense": 98,
            "sp_attack": 102,
            "sp_defense": 105,
            "speed": 120,
        },
        "evs": {
            "hp": 0,
            "attack": 252,
            "defense": 0,
            "sp_attack": 0,
            "sp_defense": 0,
            "speed": 252,
        },
    }

    response = client.post("/api/v1/iv/calculate", json=payload)
    assert response.status_code == 422
