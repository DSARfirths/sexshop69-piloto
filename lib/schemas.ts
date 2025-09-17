import { z } from 'zod'
export const ProductSchema = z.object({
  name: z.string(), price: z.number(), sku: z.string(), category: z.string()
})
