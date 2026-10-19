from sqlalchemy import Column, UniqueConstraint
from sqlalchemy.dialects.mysql import BIGINT, VARCHAR
from sqlmodel import Field, SQLModel


class Rol(SQLModel, table=True):
    __tablename__ = "roles"
    __table_args__ = (
        UniqueConstraint("nombre", name="uq_roles_nombre"),
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
    nombre: str = Field(sa_column=Column(VARCHAR(50), nullable=False))
    descripcion: str | None = Field(default=None, sa_column=Column(VARCHAR(255), nullable=True))
