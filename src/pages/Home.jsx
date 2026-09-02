import React from 'react'
import { HeroCarousel } from '../components/HeroCarousel'
import { FeatureCollections, QuickDesigns, RingBanners } from '../components/CategoryGrid'
import { ShopTheLook } from '../components/ShopTheLook'

export default function Home() {
  return (
    <>
      <HeroCarousel />
      <FeatureCollections />
      <QuickDesigns />
      <ShopTheLook />
      <RingBanners />
    </>
  )
}
