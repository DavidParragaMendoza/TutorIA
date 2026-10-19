from datetime import date, datetime

from sqlalchemy import CheckConstraint, Column, Date, ForeignKey, Index, UniqueConstraint, text
from sqlalchemy.dialects.mysql import BIGINT, DATETIME, VARCHAR
from sqlmodel import Field, SQLModel


class PeriodoAcademico(SQLModel, table=True):
    __tablename__ = "periodos_academicos"
    __table_args__ = (
        UniqueConstraint("codigo", name="uq_periodos_codigo"),
        Index("idx_periodos_estado", "estado"),
        Index("idx_periodos_creado_por", "creadoPor"),
        CheckConstraint("fechaFin > fechaInicio", name="ck_periodos_rango"),
        CheckConstraint("estado IN ('PLANIFICADO', 'ACTIVO', 'CERRADO')", name="ck_periodos_estado"),
        {
            "mysql_engine": "InnoDB",
            "mysql_charset": "utf8mb4",
            "mysql_collate": "utf8mb4_unicode_ci",
        },
    )

    id: int | None = Field(
        default=None,
        sa_column=Column(BIGINT(unsigned=True), primary_key=True, autoincrement=True, nullable=False),
    )
    codigo: str = Field(sa_column=Column(VARCHAR(20), nullable=False))
    fechaInicio: date = Field(sa_column=Column(Date, nullable=False))
    fechaFin: date = Field(sa_column=Column(Date, nullable=False))
    estado: str = Field(
        default="ACTIVO",
        sa_column=Column(VARCHAR(20), nullable=False, server_default=text("'ACTIVO'")),
    )
    creadoPor: int | None = Field(
        default=None,
        sa_column=Column(
            BIGINT(unsigned=True),
            ForeignKey("usuarios.id", name="fk_periodos_creado_por", ondelete="RESTRICT", onupdate="RESTRICT"),
            nullable=True,
        ),
    )
    fechaCreacion: datetime | None = Field(
        default=None,
        sa_column=Column(
            DATETIME(fsp=6),
            nullable=False,
            server_default=text("CURRENT_TIMESTAMP(6)"),
        ),
    )
