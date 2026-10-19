from datetime import datetime
from typing import Any

from sqlalchemy import JSON, Boolean, CheckConstraint, Column, ForeignKey, Index, text
from sqlalchemy.dialects.mysql import BIGINT, DATETIME, INTEGER, TEXT, VARCHAR
from sqlmodel import Field, SQLModel


class EventoInteraccion(SQLModel, table=True):
    __tablename__ = "eventos_interaccion"
    __table_args__ = (
        Index("idx_eventos_matricula_fecha", "matriculaId", "fechaEvento"),
        Index("idx_eventos_sesion_fecha", "sesionId", "fechaEvento"),
        Index("idx_eventos_glosario", "glosarioId"),
        Index("idx_eventos_pregunta", "preguntaContingenciaId"),
        Index("idx_eventos_origen", "origenRespuesta"),
        CheckConstraint("opcionSeleccionada IN ('A', 'B', 'C', 'D')", name="ck_eventos_opcion"),
        CheckConstraint("origenRespuesta IN ('RAG', 'CONTINGENCIA')", name="ck_eventos_origen"),
        CheckConstraint(
            (
                "(origenRespuesta = 'RAG' AND preguntaContingenciaId IS NULL) "
                "OR (origenRespuesta = 'CONTINGENCIA' AND preguntaContingenciaId IS NOT NULL)"
            ),
            name="ck_eventos_origen_contingencia",
        ),
        CheckConstraint("tiempoRespuestaMs >= 0", name="ck_eventos_tiempo"),
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
            ForeignKey("matriculas.id", name="fk_eventos_matricula", ondelete="RESTRICT", onupdate="RESTRICT"),
            nullable=False,
        ),
    )
    sesionId: int = Field(
        sa_column=Column(
            BIGINT(unsigned=True),
            ForeignKey("sesiones_usuario.id", name="fk_eventos_sesion", ondelete="RESTRICT", onupdate="RESTRICT"),
            nullable=False,
        ),
    )
    glosarioId: int = Field(
        sa_column=Column(
            BIGINT(unsigned=True),
            ForeignKey("glosario_hsk1.id", name="fk_eventos_glosario", ondelete="RESTRICT", onupdate="RESTRICT"),
            nullable=False,
        ),
    )
    preguntaContingenciaId: int | None = Field(
        default=None,
        sa_column=Column(
            BIGINT(unsigned=True),
            ForeignKey(
                "preguntas_contingencia_hsk1.id",
                name="fk_eventos_pregunta_contingencia",
                ondelete="RESTRICT",
                onupdate="RESTRICT",
            ),
            nullable=True,
        ),
    )
    opcionSeleccionada: str = Field(sa_column=Column(VARCHAR(1), nullable=False))
    origenRespuesta: str = Field(sa_column=Column(VARCHAR(20), nullable=False))
    preguntaGeneradaTexto: str = Field(sa_column=Column(TEXT, nullable=False))
    opcionesPresentadasJson: list[dict[str, Any]] = Field(sa_column=Column(JSON, nullable=False))
    esCorrecto: bool = Field(sa_column=Column(Boolean, nullable=False))
    tiempoRespuestaMs: int = Field(sa_column=Column(INTEGER(unsigned=True), nullable=False))
    fechaEvento: datetime | None = Field(
        default=None,
        sa_column=Column(
            DATETIME(fsp=6),
            nullable=False,
            server_default=text("CURRENT_TIMESTAMP(6)"),
        ),
    )
