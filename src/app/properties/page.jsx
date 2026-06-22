'use client'

import UserLayout from '@/components/UserLayout'
import Properties from '@/components/Properties'

export default function PropertiesPage() {
  return (
    <UserLayout>
      <Properties category="all" />
    </UserLayout>
  )
}
