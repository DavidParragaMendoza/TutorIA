from datetime import datetime

from sqlalchemy import CheckConstraint, Column, ForeignKey, Index, text
from sqlalchemy.dialects.mysql import BIGINT, DATETIME, TEXT, VARCHAR
from sqlmodel import Field, SQLModel


class AuditoriaRutaAprendizaje(SQLModel, table=True):
    __tablename__ = "auditoria_ruta_aprendizaje"
    __table_args__ = (
        Index("idx_auditoria_matricula_fecha", "matriculaId", "fechaAccion"),
        Index("idx_auditoria_docente", "docenteId"),
        Index("idx_auditoria_sesion", "sesionId"),
        Index("idx_auditoria_accion", "accionRealizada"),
        CheckConstraint(
            "accionRealizada IN ('APROBAR_AVANCE', 'ASIGNAR_REPASO', 'INTERVENIR_RUTA', 'REGISTRAR_OBSERVACION')",
            name="ck_auditoria_accion",
        ),
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
            ForeignKey("matriculas.id", name="fk_auditoria_matricula", ondelete="RESTRICT", onupdate="RESTRICT"),
            nullable=False,
        ),
    )
    docenteId: int = Field(
        sa_column=Column(
            BIGINT(unsigned=True),
            ForeignKey("usuarios.id", name="fk_auditoria_docente", ondelete="RESTRICT", onupdate="RESTRICT"),
            nullable=False,
        ),
    )
    sesionId: int | None = Field(
        default=None,
        sa_column=Column(
            BIGINT(unsigned=True),
            ForeignKey(
                "sesiones_usuario.id",
                name="fk_auditoria_sesion",
                ondelete="RESTRICT",
                onupdate="RESTRICT",
            ),
            nullable=True,
        ),
    )
    accionRealizada: str = Field(sa_column=Column(VARCHAR(30), nullable=False))
    observacion: str | None = Field(default=None, sa_column=Column(TEXT, nullable=True))
    fechaAccion: datetime | None = Field(
        default=None,
        sa_column=Column(
            DATETIME(fsp=6),
            nullable=False,
            server_default=text("CURRENT_TIMESTAMP(6)"),
        ),
    )
