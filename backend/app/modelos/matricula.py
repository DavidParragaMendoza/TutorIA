from datetime import datetime

from sqlalchemy import CheckConstraint, Column, ForeignKey, Index, UniqueConstraint, text
from sqlalchemy.dialects.mysql import BIGINT, DATETIME, VARCHAR
from sqlmodel import Field, SQLModel


class Matricula(SQLModel, table=True):
    __tablename__ = "matriculas"
    __table_args__ = (
        UniqueConstraint("paraleloId", "estudianteId", name="uq_matriculas_paralelo_estudiante"),
        Index("idx_matriculas_estudiante", "estudianteId"),
        Index("idx_matriculas_estado", "estadoMatricula"),
        Index("idx_matriculas_matriculado_por", "matriculadoPor"),
        CheckConstraint("estadoMatricula IN ('ACTIVA', 'RETIRADA', 'COMPLETADA')", name="ck_matriculas_estado"),
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
    paraleloId: int = Field(
        sa_column=Column(
            BIGINT(unsigned=True),
            ForeignKey("paralelos.id", name="fk_matriculas_paralelo", ondelete="RESTRICT", onupdate="RESTRICT"),
            nullable=False,
        ),
    )
    estudianteId: int = Field(
        sa_column=Column(
            BIGINT(unsigned=True),
            ForeignKey("usuarios.id", name="fk_matriculas_estudiante", ondelete="RESTRICT", onupdate="RESTRICT"),
            nullable=False,
        ),
    )
    fechaMatricula: datetime | None = Field(
        default=None,
        sa_column=Column(
            DATETIME(fsp=6),
            nullable=False,
            server_default=text("CURRENT_TIMESTAMP(6)"),
        ),
    )
    estadoMatricula: str = Field(
        default="ACTIVA",
        sa_column=Column(VARCHAR(20), nullable=False, server_default=text("'ACTIVA'")),
    )
    matriculadoPor: int | None = Field(
        default=None,
        sa_column=Column(
            BIGINT(unsigned=True),
            ForeignKey(
                "usuarios.id",
                name="fk_matriculas_matriculado_por",
                ondelete="RESTRICT",
                onupdate="RESTRICT",
            ),
            nullable=True,
        ),
    )
