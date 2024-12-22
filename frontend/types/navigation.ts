import { TypeIcon as type, LucideIcon } from 'lucide-react'

export interface SubCategory {
  id: string
  title: string
  href: string
  description?: string
}

export interface Category {
  id: string
  title: string
  icon: LucideIcon
  href: string
  isActive?: boolean
  subcategories: SubCategory[]
}

