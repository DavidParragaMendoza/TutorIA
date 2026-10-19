from sqlalchemy import Column, ForeignKey, Index, UniqueConstraint
from sqlalchemy.dialects.mysql import BIGINT, VARCHAR
from sqlmodel import Field, SQLModel


class GlosarioHsk1(SQLModel, table=True):
    __tablename__ = "glosario_hsk1"
    __table_args__ = (
        UniqueConstraint(
            "nivelId",
            "caracterHanzi",
            "pinyin",
            name="uq_glosario_nivel_hanzi_pinyin",
        ),
        Index("idx_glosario_categoria", "categoriaId"),
        Index("idx_glosario_nivel", "nivelId"),
        Index("idx_glosario_hanzi", "caracterHanzi"),
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
    nivelId: int = Field(
        sa_column=Column(
            BIGINT(unsigned=True),
            ForeignKey("niveles.id", name="fk_glosario_nivel", ondelete="RESTRICT", onupdate="RESTRICT"),
            nullable=False,
        ),
    )
    categoriaId: int = Field(
        sa_column=Column(
            BIGINT(unsigned=True),
            ForeignKey(
                "categorias_glosario.id",
                name="fk_glosario_categoria",
                ondelete="RESTRICT",
                onupdate="RESTRICT",
            ),
            nullable=False,
        ),
    )
    caracterHanzi: str = Field(sa_column=Column(VARCHAR(10), nullable=False))
    pinyin: str = Field(sa_column=Column(VARCHAR(100), nullable=False))
    traduccionEspanol: str = Field(sa_column=Column(VARCHAR(255), nullable=False))
