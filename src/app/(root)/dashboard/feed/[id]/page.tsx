import React from 'react'
import ListingDetailsPage from '@/components/dashboard/Feed/ListingDetailsPage'

// 1. Change type to Promise
export default async function Page({ 
  params 
}: { 
  params: Promise<{ id: string }> 
}) {
  // 2. Await the params to get the actual ID
  const { id } = await params;

  // 3. Pass the raw ID string to the component
  return <ListingDetailsPage id={id} />
}