import {
  Column,
  Entity,
  Index,
  JoinColumn,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { EMIPlan } from './emi-plan.entity.js';
import { Product } from './product.entity.js';

@Entity({ name: 'product_variants' })
@Index('IDX_PRODUCT_VARIANTS_PRODUCT_ID', ['productId'])
export class ProductVariant {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'int' })
  productId: number;

  @ManyToOne(() => Product, (product) => product.variants, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'productId' })
  product: Product;

  @Column({ type: 'varchar', length: 160 })
  variantLabel: string;

  @Column({ type: 'varchar', length: 80 })
  color: string;

  @Column({ type: 'varchar', length: 80 })
  storage: string;

  @Column({ type: 'numeric', precision: 12, scale: 2 })
  mrp: string;

  @Column({ type: 'numeric', precision: 12, scale: 2 })
  price: string;

  @Column({ type: 'text' })
  imageUrl: string;

  @Column({ type: 'int', default: 0 })
  availableStock: number;

  @OneToMany(() => EMIPlan, (emiPlan) => emiPlan.variant)
  emiPlans: EMIPlan[];
}
