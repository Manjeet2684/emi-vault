import {
  Column,
  Entity,
  Index,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { ProductVariant } from './product-variant.entity.js';

@Entity({ name: 'emi_plans' })
@Index('IDX_EMI_PLANS_VARIANT_ID', ['variantId'])
export class EMIPlan {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'int' })
  variantId: number;

  @ManyToOne(() => ProductVariant, (variant) => variant.emiPlans, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'variantId' })
  variant: ProductVariant;

  @Column({ type: 'numeric', precision: 12, scale: 2 })
  monthlyAmount: string;

  @Column({ type: 'int' })
  tenureMonths: number;

  @Column({ type: 'numeric', precision: 5, scale: 2, default: 0 })
  interestRate: string;

  @Column({ type: 'numeric', precision: 12, scale: 2, nullable: true })
  cashbackAmount: string | null;

  @Column({ type: 'varchar', length: 160, nullable: true })
  planLabel: string | null;
}
