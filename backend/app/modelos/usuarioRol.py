from datetime import datetime

from sqlalchemy import Column, ForeignKey, Index, UniqueConstraint, text
from sqlalchemy.dialects.mysql import BIGINT, DATETIME
from sqlmodel import Field, SQLModel


class UsuarioRol(SQLModel, table=True):
    __tablename__ = "usuario_rol"
    __table_args__ = (
        UniqueConstraint("usuarioId", "rolId", name="uq_usuario_rol_usuario_rol"),
        Index("idx_usuario_rol_rol", "rolId"),
        Index("idx_usuario_rol_asignado_por", "asignadoPor"),
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
    usuarioId: int = Field(
        sa_column=Column(
            BIGINT(unsigned=True),
            ForeignKey("usuarios.id", name="fk_usuario_rol_usuario", ondelete="RESTRICT", onupdate="RESTRICT"),
            nullable=False,
        ),
    )
    rolId: int = Field(
        sa_column=Column(
            BIGINT(unsigned=True),
            ForeignKey("roles.id", name="fk_usuario_rol_rol", ondelete="RESTRICT", onupdate="RESTRICT"),
            nullable=False,
        ),
    )
    asignadoPor: int | None = Field(
        default=None,
        sa_column=Column(
            BIGINT(unsigned=True),
            ForeignKey("usuarios.id", name="fk_usuario_rol_asignado_por", ondelete="RESTRICT", onupdate="RESTRICT"),
            nullable=True,
        ),
    )
    fechaAsignacion: datetime | None = Field(
        default=None,
        sa_column=Column(
            DATETIME(fsp=6),
            nullable=False,
            server_default=text("CURRENT_TIMESTAMP(6)"),
        ),
    )
