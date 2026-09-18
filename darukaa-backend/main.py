
from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from sqlalchemy import (
    create_engine,
    Column,
    Integer,
    String,
    Float,
    ForeignKey,
)
from sqlalchemy.orm import declarative_base, sessionmaker


# =========================================================
# DATABASE
# =========================================================

DATABASE_URL = "postgresql://postgres:kanchan123@127.0.0.1:5432/darukaa_earth"

engine = create_engine(DATABASE_URL)
SessionLocal = sessionmaker(bind=engine)
Base = declarative_base()


# =========================================================
# FASTAPI
# =========================================================

app = FastAPI(
    title="Darukaa Earth API",
    description="Backend API for carbon and biodiversity project analytics",
    version="1.0.0",
)


# =========================================================
# CORS
# =========================================================

app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:5173",
        "http://127.0.0.1:5173",
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


# =========================================================
# DATABASE MODELS
# =========================================================

class Project(Base):
    __tablename__ = "projects"

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String, nullable=False)
    description = Column(String)
    location = Column(String)


class Site(Base):
    __tablename__ = "sites"

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String, nullable=False)

    latitude = Column(Float, nullable=False)
    longitude = Column(Float, nullable=False)

    project_id = Column(
        Integer,
        ForeignKey("projects.id"),
        nullable=False,
    )

    project_name = Column(String)

    carbon = Column(Float, default=0)
    biodiversity = Column(Float, default=0)

    status = Column(String, default="Active")


# Create tables automatically
Base.metadata.create_all(bind=engine)


# =========================================================
# REQUEST MODELS
# =========================================================

class ProjectCreate(BaseModel):
    name: str
    description: str
    location: str


class SiteCreate(BaseModel):
    name: str
    latitude: float
    longitude: float
    project_id: int
    project_name: str
    carbon: float = 0
    biodiversity: float = 0


# =========================================================
# BASIC
# =========================================================

@app.get("/")
def root():
    return {
        "message": "Darukaa Earth API is running"
    }


@app.get("/health")
def health_check():
    return {
        "status": "healthy"
    }


# =========================================================
# PROJECT APIs
# =========================================================

@app.post("/projects")
def create_project(project: ProjectCreate):

    db = SessionLocal()

    try:
        new_project = Project(
            name=project.name,
            description=project.description,
            location=project.location,
        )

        db.add(new_project)
        db.commit()
        db.refresh(new_project)

        return {
            "message": "Project created successfully",
            "project": {
                "id": new_project.id,
                "name": new_project.name,
                "description": new_project.description,
                "location": new_project.location,
            },
        }

    finally:
        db.close()


@app.get("/projects")
def get_projects():

    db = SessionLocal()

    try:
        projects = db.query(Project).all()

        return [
            {
                "id": project.id,
                "name": project.name,
                "description": project.description,
                "location": project.location,
            }
            for project in projects
        ]

    finally:
        db.close()


# =========================================================
# SITE APIs
# =========================================================

@app.post("/sites")
def create_site(site: SiteCreate):

    db = SessionLocal()

    try:
        # Check project exists
        project = (
            db.query(Project)
            .filter(Project.id == site.project_id)
            .first()
        )

        if not project:
            raise HTTPException(
                status_code=404,
                detail="Project not found",
            )

        new_site = Site(
            name=site.name,
            latitude=site.latitude,
            longitude=site.longitude,
            project_id=site.project_id,
            project_name=project.name,
            carbon=site.carbon,
            biodiversity=site.biodiversity,
            status="Active",
        )

        db.add(new_site)
        db.commit()
        db.refresh(new_site)

        return {
            "message": "Site created successfully",
            "site": {
                "id": new_site.id,
                "name": new_site.name,
                "latitude": new_site.latitude,
                "longitude": new_site.longitude,
                "project_id": new_site.project_id,
                "project_name": new_site.project_name,
                "carbon": new_site.carbon,
                "biodiversity": new_site.biodiversity,
                "status": new_site.status,
            },
        }

    finally:
        db.close()


@app.get("/sites")
def get_sites():

    db = SessionLocal()

    try:
        sites = db.query(Site).all()

        return [
            {
                "id": site.id,
                "name": site.name,
                "latitude": site.latitude,
                "longitude": site.longitude,
                "project_id": site.project_id,
                "project_name": site.project_name,
                "carbon": site.carbon,
                "biodiversity": site.biodiversity,
                "status": site.status,
            }
            for site in sites
        ]

    finally:
        db.close()


# =========================================================
# SINGLE SITE
# =========================================================

@app.get("/sites/{site_id}")
def get_site(site_id: int):

    db = SessionLocal()

    try:
        site = (
            db.query(Site)
            .filter(Site.id == site_id)
            .first()
        )

        if not site:
            raise HTTPException(
                status_code=404,
                detail="Site not found",
            )

        return {
            "id": site.id,
            "name": site.name,
            "latitude": site.latitude,
            "longitude": site.longitude,
            "project_id": site.project_id,
            "project_name": site.project_name,
            "carbon": site.carbon,
            "biodiversity": site.biodiversity,
            "status": site.status,
        }

    finally:
        db.close()


# =========================================================
# SITE ANALYTICS
# =========================================================

@app.get("/sites/{site_id}/analytics")
def get_site_analytics(site_id: int):

    db = SessionLocal()

    try:
        site = (
            db.query(Site)
            .filter(Site.id == site_id)
            .first()
        )

        if not site:
            raise HTTPException(
                status_code=404,
                detail="Site not found",
            )

        return {
            "site_id": site.id,
            "site_name": site.name,
            "carbon": site.carbon,
            "biodiversity": site.biodiversity,
            "status": site.status,

            "carbon_history": [
                {
                    "year": 2022,
                    "value": round(site.carbon * 0.55, 2),
                },
                {
                    "year": 2023,
                    "value": round(site.carbon * 0.65, 2),
                },
                {
                    "year": 2024,
                    "value": round(site.carbon * 0.78, 2),
                },
                {
                    "year": 2025,
                    "value": round(site.carbon * 0.90, 2),
                },
                {
                    "year": 2026,
                    "value": site.carbon,
                },
            ],

            "biodiversity_history": [
                {
                    "year": 2022,
                    "value": round(site.biodiversity * 0.60, 2),
                },
                {
                    "year": 2023,
                    "value": round(site.biodiversity * 0.70, 2),
                },
                {
                    "year": 2024,
                    "value": round(site.biodiversity * 0.80, 2),
                },
                {
                    "year": 2025,
                    "value": round(site.biodiversity * 0.90, 2),
                },
                {
                    "year": 2026,
                    "value": site.biodiversity,
                },
            ],
        }

    finally:
        db.close()