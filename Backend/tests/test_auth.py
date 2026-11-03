import os

os.environ["DATABASE_URL"] = "sqlite://"
os.environ["SECRET_KEY"] = "test-only-signing-key-with-at-least-32-characters"
os.environ["ALGORITHM"] = "HS256"
os.environ["ENVIRONMENT"] = "test"

from fastapi.testclient import TestClient
from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker
from sqlalchemy.pool import StaticPool

from App.core.database import Base, get_db
from App.main import app
from App.models.user import User
from App.services.auth_service import verify_password


def test_authentication_flow_and_protected_current_user():
    engine = create_engine(
        "sqlite://",
        connect_args={"check_same_thread": False},
        poolclass=StaticPool,
    )
    Base.metadata.create_all(bind=engine)
    test_session = sessionmaker(autocommit=False, autoflush=False, bind=engine)

    def override_get_db():
        db = test_session()
        try:
            yield db
        finally:
            db.close()

    app.dependency_overrides[get_db] = override_get_db
    try:
        with TestClient(app) as client:
            registration = client.post(
                "/auth/register",
                json={
                    "name": "Pessoa Nexus",
                    "email": "pessoa@example.com",
                    "password": "senha-segura-123",
                },
            )
            assert registration.status_code == 201
            assert "password" not in registration.json()

            with test_session() as db:
                user = db.query(User).filter_by(email="pessoa@example.com").one()
                assert user.password != "senha-segura-123"
                assert verify_password("senha-segura-123", user.password)

            duplicate = client.post(
                "/auth/register",
                json={
                    "name": "Pessoa Nexus",
                    "email": "pessoa@example.com",
                    "password": "senha-segura-123",
                },
            )
            assert duplicate.status_code == 409

            login = client.post(
                "/auth/login",
                json={"email": "pessoa@example.com", "password": "senha-segura-123"},
            )
            assert login.status_code == 200
            token = login.json()["access_token"]

            current_user = client.get(
                "/auth/me",
                headers={"Authorization": f"Bearer {token}"},
            )
            assert current_user.status_code == 200
            assert current_user.json()["email"] == "pessoa@example.com"

            assert client.get("/auth/me").status_code == 401
            assert client.get(
                "/auth/me",
                headers={"Authorization": "Bearer invalid-token"},
            ).status_code == 401
    finally:
        app.dependency_overrides.pop(get_db, None)
        Base.metadata.drop_all(bind=engine)
        engine.dispose()


def test_registration_rejects_password_over_bcrypt_byte_limit():
    response = TestClient(app).post(
        "/auth/register",
        json={
            "name": "Pessoa Nexus",
            "email": "pessoa@example.com",
            "password": "a" * 73,
        },
    )
    assert response.status_code == 422
