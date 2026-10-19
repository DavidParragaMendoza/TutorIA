from datetime import datetime

from sqlalchemy import CheckConstraint, Column, ForeignKey, Index, UniqueConstraint, text
from sqlalchemy.dialects.mysql import BIGINT, DATETIME, INTEGER, VARCHAR
from sqlmodel import Field, SQLModel


class Paralelo(SQLModel, table=True):
    __tablename__ = "paralelos"
    __table_args__ = (
        UniqueConstraint(
            "cursoId",
            "periodoAcademicoId",
            "nombreParalelo",
            name="uq_paralelos_curso_periodo_nombre",
        ),
        Index("idx_paralelos_periodo", "periodoAcademicoId"),
        Index("idx_paralelos_docente", "docenteId"),
        Index("idx_paralelos_creado_por", "creadoPor"),
        CheckConstraint("cupoMaximo > 0", name="ck_paralelos_cupo"),
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
    cursoId: int = Field(
        sa_column=Column(
            BIGINT(unsigned=True),
            ForeignKey("cursos.id", name="fk_paralelos_curso", ondelete="RESTRICT", onupdate="RESTRICT"),
            nullable=False,
        ),
    )
    periodoAcademicoId: int = Field(
        sa_column=Column(
            BIGINT(unsigned=True),
            ForeignKey(
                "periodos_academicos.id",
                name="fk_paralelos_periodo",
                ondelete="RESTRICT",
                onupdate="RESTRICT",
            ),
            nullable=False,
        ),
    )
    docenteId: int = Field(
        sa_column=Column(
            BIGINT(unsigned=True),
            ForeignKey("usuarios.id", name="fk_paralelos_docente", ondelete="RESTRICT", onupdate="RESTRICT"),
            nullable=False,
        ),
    )
    nombreParalelo: str = Field(sa_column=Column(VARCHAR(50), nullable=False))
    cupoMaximo: int = Field(sa_column=Column(INTEGER(unsigned=True), nullable=False))
    horarioDescripcion: str | None = Field(default=None, sa_column=Column(VARCHAR(255), nullable=True))
    creadoPor: int | None = Field(
        default=None,
        sa_column=Column(
            BIGINT(unsigned=True),
            ForeignKey("usuarios.id", name="fk_paralelos_creado_por", ondelete="RESTRICT", onupdate="RESTRICT"),
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
