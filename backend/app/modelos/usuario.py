from datetime import datetime

from sqlalchemy import CheckConstraint, Column, ForeignKey, Index, UniqueConstraint, text
from sqlalchemy.dialects.mysql import BIGINT, DATETIME, INTEGER, VARCHAR
from sqlmodel import Field, SQLModel


class Usuario(SQLModel, table=True):
    __tablename__ = "usuarios"
    __table_args__ = (
        UniqueConstraint("cedula", name="uq_usuarios_cedula"),
        UniqueConstraint("correoInstitucional", name="uq_usuarios_correo"),
        Index("idx_usuarios_estado", "estado"),
        Index("idx_usuarios_creado_por", "creadoPor"),
        Index("idx_usuarios_actualizado_por", "actualizadoPor"),
        CheckConstraint("estado IN ('ACTIVO', 'BLOQUEADO', 'INACTIVO')", name="ck_usuarios_estado"),
        CheckConstraint("intentosFallidos >= 0", name="ck_usuarios_intentos"),
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
    nombresCompletos: str = Field(sa_column=Column(VARCHAR(200), nullable=False))
    cedula: str = Field(sa_column=Column(VARCHAR(20), nullable=False))
    correoInstitucional: str = Field(sa_column=Column(VARCHAR(150), nullable=False))
    passwordHash: str = Field(sa_column=Column(VARCHAR(255), nullable=False))
    estado: str = Field(
        default="ACTIVO",
        sa_column=Column(VARCHAR(20), nullable=False, server_default=text("'ACTIVO'")),
    )
    intentosFallidos: int = Field(
        default=0,
        sa_column=Column(INTEGER(unsigned=True), nullable=False, server_default=text("0")),
    )
    creadoPor: int | None = Field(
        default=None,
        sa_column=Column(
            BIGINT(unsigned=True),
            ForeignKey("usuarios.id", name="fk_usuarios_creado_por", ondelete="RESTRICT", onupdate="RESTRICT"),
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
    actualizadoPor: int | None = Field(
        default=None,
        sa_column=Column(
            BIGINT(unsigned=True),
            ForeignKey("usuarios.id", name="fk_usuarios_actualizado_por", ondelete="RESTRICT", onupdate="RESTRICT"),
            nullable=True,
        ),
    )
    fechaActualizacion: datetime | None = Field(
        default=None,
        sa_column=Column(
            DATETIME(fsp=6),
            nullable=False,
            server_default=text("CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6)"),
        ),
    )
