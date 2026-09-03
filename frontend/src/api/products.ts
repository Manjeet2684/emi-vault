import { apiClient } from './client'
import type { ProductDetail, ProductListItem, ProductVariant } from '../types/product'

export async function fetchProducts(): Promise<ProductListItem[]> {
  const { data } = await apiClient.get<ProductListItem[]>('/api/products')
  return data
}

export async function fetchProductBySlug(slug: string): Promise<ProductDetail> {
  const { data } = await apiClient.get<ProductDetail>(`/api/products/${slug}`)
  return data
}

export async function fetchProductVariant(
  slug: string,
  variantId: number,
): Promise<ProductVariant> {
  const { data } = await apiClient.get<ProductVariant>(
    `/api/products/${slug}/variants/${variantId}`,
  )
  return data
}
