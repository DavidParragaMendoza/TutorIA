from sqlalchemy import CheckConstraint, Column, ForeignKey, Index, UniqueConstraint, text
from sqlalchemy.dialects.mysql import BIGINT, SMALLINT, VARCHAR
from sqlmodel import Field, SQLModel


class DetalleIntervencionGlosario(SQLModel, table=True):
    __tablename__ = "detalle_intervencion_glosario"
    __table_args__ = (
        UniqueConstraint(
            "auditoriaId",
            "glosarioId",
            name="uq_detalle_intervencion_auditoria_glosario",
        ),
        Index("idx_detalle_glosario", "glosarioId"),
        Index("idx_detalle_estado", "estadoRefuerzo"),
        CheckConstraint("prioridadDocente BETWEEN 1 AND 5", name="ck_detalle_prioridad"),
        CheckConstraint(
            "estadoRefuerzo IN ('PENDIENTE', 'EN_REFUERZO', 'COMPLETADO')",
            name="ck_detalle_estado",
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
    auditoriaId: int = Field(
        sa_column=Column(
            BIGINT(unsigned=True),
            ForeignKey(
                "auditoria_ruta_aprendizaje.id",
                name="fk_detalle_auditoria",
                ondelete="RESTRICT",
                onupdate="RESTRICT",
            ),
            nullable=False,
        ),
    )
    glosarioId: int = Field(
        sa_column=Column(
            BIGINT(unsigned=True),
            ForeignKey("glosario_hsk1.id", name="fk_detalle_glosario", ondelete="RESTRICT", onupdate="RESTRICT"),
            nullable=False,
        ),
    )
    prioridadDocente: int = Field(
        default=3,
        sa_column=Column(SMALLINT(unsigned=True), nullable=False, server_default=text("3")),
    )
    estadoRefuerzo: str = Field(
        default="PENDIENTE",
        sa_column=Column(VARCHAR(20), nullable=False, server_default=text("'PENDIENTE'")),
    )
