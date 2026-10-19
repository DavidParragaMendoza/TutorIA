from datetime import datetime
from decimal import Decimal

from sqlalchemy import CheckConstraint, Column, ForeignKey, Index, UniqueConstraint, text
from sqlalchemy.dialects.mysql import BIGINT, DATETIME, DECIMAL, INTEGER, VARCHAR
from sqlmodel import Field, SQLModel


class EstadoDominioEstudiante(SQLModel, table=True):
    __tablename__ = "estado_dominio_estudiante"
    __table_args__ = (
        UniqueConstraint("matriculaId", "glosarioId", name="uq_estado_dominio_matricula_glosario"),
        Index("idx_estado_dominio_glosario", "glosarioId"),
        Index("idx_estado_dominio_proxima", "proximaFechaRepaso"),
        Index("idx_estado_dominio_estado", "estadoDominio"),
        Index("idx_estado_dominio_ultima_sesion", "ultimaSesionId"),
        CheckConstraint("estadoDominio IN ('DEBIL', 'EN_PROGRESO', 'DOMINADO')", name="ck_estado_dominio"),
        CheckConstraint("contadorFallos >= 0", name="ck_estado_dominio_fallos"),
        CheckConstraint("pesoSrs BETWEEN 0.00 AND 100.00", name="ck_estado_dominio_peso"),
        CheckConstraint("intervaloDias >= 1", name="ck_estado_dominio_intervalo"),
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
            ForeignKey(
                "matriculas.id",
                name="fk_estado_dominio_matricula",
                ondelete="RESTRICT",
                onupdate="RESTRICT",
            ),
            nullable=False,
        ),
    )
    glosarioId: int = Field(
        sa_column=Column(
            BIGINT(unsigned=True),
            ForeignKey(
                "glosario_hsk1.id",
                name="fk_estado_dominio_glosario",
                ondelete="RESTRICT",
                onupdate="RESTRICT",
            ),
            nullable=False,
        ),
    )
    estadoDominio: str = Field(
        default="DEBIL",
        sa_column=Column(VARCHAR(20), nullable=False, server_default=text("'DEBIL'")),
    )
    contadorFallos: int = Field(
        default=0,
        sa_column=Column(INTEGER(unsigned=True), nullable=False, server_default=text("0")),
    )
    fechaUltimoError: datetime | None = Field(
        default=None,
        sa_column=Column(DATETIME(fsp=6), nullable=True),
    )
    ultimaSesionId: int | None = Field(
        default=None,
        sa_column=Column(
            BIGINT(unsigned=True),
            ForeignKey(
                "sesiones_usuario.id",
                name="fk_estado_dominio_ultima_sesion",
                ondelete="RESTRICT",
                onupdate="RESTRICT",
            ),
            nullable=True,
        ),
    )
    pesoSrs: Decimal = Field(
        default=Decimal("0.00"),
        sa_column=Column(DECIMAL(5, 2), nullable=False, server_default=text("0.00")),
    )
    intervaloDias: int = Field(
        default=1,
        sa_column=Column(INTEGER(unsigned=True), nullable=False, server_default=text("1")),
    )
    proximaFechaRepaso: datetime | None = Field(
        default=None,
        sa_column=Column(DATETIME(fsp=6), nullable=True),
    )
    fechaActualizacion: datetime | None = Field(
        default=None,
        sa_column=Column(
            DATETIME(fsp=6),
            nullable=False,
            server_default=text("CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6)"),
        ),
    )
