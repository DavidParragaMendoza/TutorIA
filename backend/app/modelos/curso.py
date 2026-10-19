from datetime import datetime

from sqlalchemy import CheckConstraint, Column, ForeignKey, Index, UniqueConstraint, text
from sqlalchemy.dialects.mysql import BIGINT, DATETIME, VARCHAR
from sqlmodel import Field, SQLModel


class Curso(SQLModel, table=True):
    __tablename__ = "cursos"
    __table_args__ = (
        UniqueConstraint(
            "idiomaId",
            "nivelId",
            "institucionId",
            "modalidadId",
            "tituloPromocional",
            name="uq_cursos_convocatoria",
        ),
        Index("idx_cursos_idioma", "idiomaId"),
        Index("idx_cursos_nivel", "nivelId"),
        Index("idx_cursos_institucion", "institucionId"),
        Index("idx_cursos_modalidad", "modalidadId"),
        Index("idx_cursos_estado", "estadoConvocatoria"),
        Index("idx_cursos_creado_por", "creadoPor"),
        CheckConstraint(
            "estadoConvocatoria IN ('BORRADOR', 'PUBLICADA', 'CERRADA', 'CANCELADA')",
            name="ck_cursos_estado",
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
    idiomaId: int = Field(
        sa_column=Column(
            BIGINT(unsigned=True),
            ForeignKey("idiomas.id", name="fk_cursos_idioma", ondelete="RESTRICT", onupdate="RESTRICT"),
            nullable=False,
        ),
    )
    nivelId: int = Field(
        sa_column=Column(
            BIGINT(unsigned=True),
            ForeignKey("niveles.id", name="fk_cursos_nivel", ondelete="RESTRICT", onupdate="RESTRICT"),
            nullable=False,
        ),
    )
    institucionId: int = Field(
        sa_column=Column(
            BIGINT(unsigned=True),
            ForeignKey(
                "instituciones_aliadas.id",
                name="fk_cursos_institucion",
                ondelete="RESTRICT",
                onupdate="RESTRICT",
            ),
            nullable=False,
        ),
    )
    modalidadId: int = Field(
        sa_column=Column(
            BIGINT(unsigned=True),
            ForeignKey("modalidades.id", name="fk_cursos_modalidad", ondelete="RESTRICT", onupdate="RESTRICT"),
            nullable=False,
        ),
    )
    tituloPromocional: str = Field(sa_column=Column(VARCHAR(200), nullable=False))
    requisitoAcademico: str | None = Field(default=None, sa_column=Column(VARCHAR(500), nullable=True))
    fechaCierrePostulacion: datetime | None = Field(
        default=None,
        sa_column=Column(DATETIME(fsp=6), nullable=True),
    )
    estadoConvocatoria: str = Field(
        default="BORRADOR",
        sa_column=Column(VARCHAR(20), nullable=False, server_default=text("'BORRADOR'")),
    )
    creadoPor: int | None = Field(
        default=None,
        sa_column=Column(
            BIGINT(unsigned=True),
            ForeignKey("usuarios.id", name="fk_cursos_creado_por", ondelete="RESTRICT", onupdate="RESTRICT"),
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
