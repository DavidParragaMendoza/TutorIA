from typing import Any

from sqlalchemy import JSON, CheckConstraint, Column, ForeignKey, Index
from sqlalchemy.dialects.mysql import BIGINT, VARCHAR
from sqlmodel import Field, SQLModel


class PreguntaContingenciaHsk1(SQLModel, table=True):
    __tablename__ = "preguntas_contingencia_hsk1"
    __table_args__ = (
        Index("idx_preguntas_glosario", "glosarioId"),
        CheckConstraint("opcionCorrecta IN ('A', 'B', 'C', 'D')", name="ck_preguntas_opcion"),
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
    glosarioId: int = Field(
        sa_column=Column(
            BIGINT(unsigned=True),
            ForeignKey("glosario_hsk1.id", name="fk_preguntas_glosario", ondelete="RESTRICT", onupdate="RESTRICT"),
            nullable=False,
        ),
    )
    preguntaTexto: str = Field(sa_column=Column(VARCHAR(500), nullable=False))
    opcionesJson: list[dict[str, Any]] = Field(sa_column=Column(JSON, nullable=False))
    opcionCorrecta: str = Field(sa_column=Column(VARCHAR(1), nullable=False))
    explicacionBase: str = Field(sa_column=Column(VARCHAR(500), nullable=False))
