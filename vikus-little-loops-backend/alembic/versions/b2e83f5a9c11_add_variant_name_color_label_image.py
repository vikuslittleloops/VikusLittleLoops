"""add variant_name color_label image to product_variants

Revision ID: b2e83f5a9c11
Revises: a1f71439efc4
Create Date: 2026-07-17 00:17:00.000000
"""
from typing import Sequence, Union

from alembic import op
import sqlalchemy as sa


revision: str = 'b2e83f5a9c11'
down_revision: Union[str, None] = 'a1f71439efc4'
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade() -> None:
    op.add_column('product_variants', sa.Column('variant_name', sa.String(length=200), nullable=True))
    op.add_column('product_variants', sa.Column('color_label', sa.String(length=80), nullable=True))
    op.add_column('product_variants', sa.Column('image_url', sa.String(length=500), nullable=True))
    op.add_column('product_variants', sa.Column('image_public_id', sa.String(length=255), nullable=True))

    # Back-fill existing rows
    op.execute("UPDATE product_variants SET variant_name = COALESCE(sku, CAST(id AS TEXT)) WHERE variant_name IS NULL")

    op.alter_column('product_variants', 'variant_name', nullable=False)

    try:
        op.drop_constraint('uq_variant_combo', 'product_variants', type_='unique')
    except Exception:
        pass

    op.create_unique_constraint('uq_variant_name', 'product_variants', ['product_id', 'variant_name'])


def downgrade() -> None:
    op.drop_constraint('uq_variant_name', 'product_variants', type_='unique')
    op.drop_column('product_variants', 'image_public_id')
    op.drop_column('product_variants', 'image_url')
    op.drop_column('product_variants', 'color_label')
    op.drop_column('product_variants', 'variant_name')
    op.create_unique_constraint('uq_variant_combo', 'product_variants', ['product_id', 'color_id', 'size_id'])
