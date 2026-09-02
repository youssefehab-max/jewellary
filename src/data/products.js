// Mock product catalog. Replace `image` paths with real product photography.
export const CATEGORIES = [
  { id: 'mens', label: "Men's Collection", slug: 'mens-collection' },
  { id: 'rings', label: 'Rings', slug: 'rings' },
  { id: 'necklaces', label: 'Necklaces', slug: 'necklaces' },
  { id: 'bracelets', label: 'Bracelets', slug: 'bracelets' },
  { id: 'diamonds', label: 'Diamonds', slug: 'diamonds' },
  { id: 'gold', label: 'Gold', slug: 'gold' },
]

export const GOLD_COLORS = ['Yellow', 'White', 'Rose']
export const RING_SIZES = ['48', '50', '52', '54', '56', '58', '60']

export const PRODUCTS = [
  {
    id: 'p-001',
    title: 'Eternity Diamond Band',
    price: 24500,
    compareAtPrice: 27800,
    category: 'rings',
    tags: ['diamonds', 'gold', 'just-arrived'],
    inStock: true,
    goldColors: ['Yellow', 'White', 'Rose'],
    sizes: RING_SIZES,
    images: [
      'https://images.unsplash.com/photo-1605100804763-247f67b3557e?w=800&q=80',
      'https://images.unsplash.com/photo-1596944924616-7b38e7cfac36?w=800&q=80',
    ],
    material: '18K Gold, 0.75ct Natural Diamonds',
    weight: '3.2g (size 54)',
    description: 'A continuous line of brilliant-cut diamonds set in warm 18K gold, designed to sit flush against any stacking ring.',
  },
  {
    id: 'p-002',
    title: 'Heart Signet Ring',
    price: 8900,
    category: 'rings',
    tags: ['gold', 'signet'],
    inStock: true,
    goldColors: ['Yellow', 'Rose'],
    sizes: RING_SIZES,
    images: [
      'https://images.unsplash.com/photo-1612459284970-e8bf4e5a6f7a?w=800&q=80',
    ],
    material: '18K Gold',
    weight: '4.1g',
    description: 'A modern take on the signet ring, hand-engraved with a soft heart motif at its face.',
  },
  {
    id: 'p-003',
    title: "Men's Curb Chain Bracelet",
    price: 15200,
    category: 'mens',
    tags: ['gold', 'bracelets'],
    inStock: false,
    goldColors: ['Yellow', 'White'],
    sizes: [],
    images: [
      'https://images.unsplash.com/photo-1611591437281-460bfbe1220a?w=800&q=80',
    ],
    material: '18K Gold',
    weight: '11.5g',
    description: 'Heavy curb-link construction in solid 18K gold, built for everyday wear.',
  },
  {
    id: 'p-004',
    title: 'Pearl Drop Necklace',
    price: 11800,
    category: 'necklaces',
    tags: ['pearls', 'just-arrived'],
    inStock: true,
    goldColors: ['Yellow'],
    sizes: [],
    images: [
      'https://images.unsplash.com/photo-1620656798579-1984d9e87df7?w=800&q=80',
    ],
    material: '18K Gold, Freshwater Pearl',
    weight: '2.8g',
    description: 'A single freshwater pearl suspended from a fine gold chain — quietly elegant on its own or layered.',
  },
  {
    id: 'p-005',
    title: 'CZ Tennis Bracelet',
    price: 13400,
    category: 'bracelets',
    tags: ['cz', 'diamonds'],
    inStock: true,
    goldColors: ['White', 'Yellow'],
    sizes: [],
    images: [
      'https://images.unsplash.com/photo-1599459183200-59c7687a0275?w=800&q=80',
    ],
    material: '18K Gold, Cubic Zirconia',
    weight: '6.0g',
    description: 'A continuous line of hand-set cubic zirconia stones with the brilliance of fine diamonds.',
  },
  {
    id: 'p-006',
    title: 'Gourmet Link Chain',
    price: 9600,
    category: 'necklaces',
    tags: ['gourmets', 'gold'],
    inStock: true,
    goldColors: ['Yellow', 'Rose'],
    sizes: [],
    images: [
      'https://images.unsplash.com/photo-1599643477877-530eb83abc8e?w=800&q=80',
    ],
    material: '18K Gold',
    weight: '5.4g',
    description: 'Chunky gourmet links in polished gold — a statement chain that layers beautifully.',
  },
  {
    id: 'p-007',
    title: 'Diamond Halo Studs',
    price: 18700,
    category: 'diamonds',
    tags: ['diamonds', 'earrings'],
    inStock: true,
    goldColors: ['White', 'Yellow'],
    sizes: [],
    images: [
      'https://images.unsplash.com/photo-1617038260897-41a1f14a8ca0?w=800&q=80',
    ],
    material: '18K Gold, 0.4ct Natural Diamonds',
    weight: '1.6g/pair',
    description: 'Round brilliant diamonds framed in a delicate halo — an everyday classic.',
  },
  {
    id: 'p-008',
    title: 'Beaded Gold Bracelet',
    price: 6200,
    category: 'bracelets',
    tags: ['beads', 'gold'],
    inStock: true,
    goldColors: ['Yellow', 'White', 'Rose'],
    sizes: [],
    images: [
      'https://images.unsplash.com/photo-1611085583191-a3b181a88401?w=800&q=80',
    ],
    material: '18K Gold',
    weight: '3.0g',
    description: 'Polished gold beads on a fine flexible chain, easy to stack with everything else you wear.',
  },
]

export const getProductById = (id) => PRODUCTS.find((p) => p.id === id)

// Hotspot data for the "Shop the Look" homepage feature.
// x/y are percentages relative to the image container, used to position hotspots.
export const SHOP_THE_LOOK = [
  {
    id: 'stl-001',
    image: 'https://images.unsplash.com/photo-1515562141207-7a88fb7ce338?w=1200&q=80',
    hotspots: [
      { id: 'hs-1', x: 38, y: 55, productId: 'p-004' },
      { id: 'hs-2', x: 62, y: 40, productId: 'p-007' },
    ],
  },
  {
    id: 'stl-002',
    image: 'https://images.unsplash.com/photo-1611652022419-a9419f74343d?w=1200&q=80',
    hotspots: [
      { id: 'hs-3', x: 50, y: 62, productId: 'p-001' },
      { id: 'hs-4', x: 28, y: 30, productId: 'p-005' },
    ],
  },
]
