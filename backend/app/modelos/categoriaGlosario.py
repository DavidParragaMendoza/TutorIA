from sqlalchemy import Column, UniqueConstraint
from sqlalchemy.dialects.mysql import BIGINT, VARCHAR
from sqlmodel import Field, SQLModel


class CategoriaGlosario(SQLModel, table=True):
    __tablename__ = "categorias_glosario"
    __table_args__ = (
        UniqueConstraint("nombreCategoria", name="uq_categorias_nombre"),
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
    nombreCategoria: str = Field(sa_column=Column(VARCHAR(100), nullable=False))
    descripcion: str | None = Field(default=None, sa_column=Column(VARCHAR(255), nullable=True))
