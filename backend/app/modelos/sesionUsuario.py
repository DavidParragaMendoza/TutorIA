from datetime import datetime

from sqlalchemy import CheckConstraint, Column, ForeignKey, Index, text
from sqlalchemy.dialects.mysql import BIGINT, CHAR, DATETIME
from sqlmodel import Field, SQLModel


class SesionUsuario(SQLModel, table=True):
    __tablename__ = "sesiones_usuario"
    __table_args__ = (
        Index("idx_sesiones_usuario", "usuarioId"),
        Index("idx_sesiones_hash", "pseudonimoHash"),
        Index("idx_sesiones_expiracion", "fechaExpiracionToken"),
        CheckConstraint("fechaExpiracionToken > fechaInicio", name="ck_sesiones_expiracion"),
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
            ForeignKey("usuarios.id", name="fk_sesiones_usuario", ondelete="RESTRICT", onupdate="RESTRICT"),
            nullable=False,
        ),
    )
    pseudonimoHash: str = Field(
        sa_column=Column(CHAR(64, charset="ascii", collation="ascii_bin"), nullable=False),
    )
    fechaInicio: datetime | None = Field(
        default=None,
        sa_column=Column(
            DATETIME(fsp=6),
            nullable=False,
            server_default=text("CURRENT_TIMESTAMP(6)"),
        ),
    )
    fechaExpiracionToken: datetime = Field(
        sa_column=Column(DATETIME(fsp=6), nullable=False),
    )
