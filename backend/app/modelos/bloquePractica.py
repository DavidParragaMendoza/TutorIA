from datetime import datetime

from sqlalchemy import CheckConstraint, Column, ForeignKey, Index, text
from sqlalchemy.dialects.mysql import BIGINT, DATETIME
from sqlmodel import Field, SQLModel


class BloquePractica(SQLModel, table=True):
    __tablename__ = "bloques_practica"
    __table_args__ = (
        Index("idx_bloques_matricula_fecha", "matriculaId", "fechaInicio"),
        Index("idx_bloques_sesion", "sesionId"),
        CheckConstraint("fechaFin IS NULL OR fechaFin >= fechaInicio", name="ck_bloques_fechas"),
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
    matriculaId: int = Field(
        sa_column=Column(
            BIGINT(unsigned=True),
            ForeignKey("matriculas.id", name="fk_bloques_matricula", ondelete="RESTRICT", onupdate="RESTRICT"),
            nullable=False,
        ),
    )
    sesionId: int = Field(
        sa_column=Column(
            BIGINT(unsigned=True),
            ForeignKey(
                "sesiones_usuario.id",
                name="fk_bloques_sesion",
                ondelete="RESTRICT",
                onupdate="RESTRICT",
            ),
            nullable=False,
        ),
    )
    fechaInicio: datetime | None = Field(
        default=None,
        sa_column=Column(
            DATETIME(fsp=6),
            nullable=False,
            server_default=text("CURRENT_TIMESTAMP(6)"),
        ),
    )
    fechaFin: datetime | None = Field(
        default=None,
        sa_column=Column(DATETIME(fsp=6), nullable=True),
    )
