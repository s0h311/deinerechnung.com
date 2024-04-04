import type { DishesByCategory } from '~/server/api/dishesByCategory/models/dishesByCategory.model'

export const useVisibleDishesByCategory = () => useState<DishesByCategory[]>('dishes-by-category')
