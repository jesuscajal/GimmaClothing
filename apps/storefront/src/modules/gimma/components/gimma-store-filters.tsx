"use client"

import StoreCategoryNav from "@modules/demo/components/store-category-nav"
import { StoreFilterItem } from "@modules/demo/components/store-filters"

type Props = {
  basePath: string
  categories: StoreFilterItem[]
  totalCount: number
  active?: string
}

export default function GimmaStoreFilters(props: Props) {
  return <StoreCategoryNav {...props} />
}
