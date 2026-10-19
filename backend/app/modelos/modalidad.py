from sqlalchemy import CheckConstraint, Column, UniqueConstraint, text
from sqlalchemy.dialects.mysql import BIGINT, VARCHAR
from sqlmodel import Field, SQLModel


class Modalidad(SQLModel, table=True):
    __tablename__ = "modalidades"
    __table_args__ = (
        UniqueConstraint("nombreModalidad", name="uq_modalidades_nombre"),
        CheckConstraint("estado IN ('ACTIVA', 'INACTIVA')", name="ck_modalidades_estado"),
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
    nombreModalidad: str = Field(sa_column=Column(VARCHAR(100), nullable=False))
    estado: str = Field(
        default="ACTIVA",
        sa_column=Column(VARCHAR(20), nullable=False, server_default=text("'ACTIVA'")),
    )
