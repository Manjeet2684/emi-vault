export type ProductListItem = {
  id: number
  slug: string
  name: string
  brand: string
  startingPrice: number
  image: string | null
  variantCount: number
}

export type EmiPlan = {
  id: number
  monthlyAmount: number
  tenureMonths: number
  interestRate: number
  cashbackAmount: number | null
  planLabel: string | null
}

export type ProductVariant = {
  id: number
  variantLabel: string
  color: string
  storage: string
  mrp: number
  price: number
  imageUrl: string
  availableStock: number
  emiPlans: EmiPlan[]
}

export type ProductDetail = {
  id: number
  slug: string
  name: string
  brand: string
  description: string
  createdAt: string
  variants: ProductVariant[]
}
