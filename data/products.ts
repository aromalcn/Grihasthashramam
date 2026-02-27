export interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  image: string;
  category: string;
}

export const products: Product[] = [
  {
    id: '1',
    name: '5 Mukhi Rudraksha Mala',
    description: 'Traditional 108+1 bead mala for meditation and peace. Promotes mental clarity and reduces stress.',
    price: 1200,
    image: '/rudraksha_new.jpg',
    category: 'Mala'
  },
  {
    id: '2',
    name: '7 Mukhi Rudraksha Pendant',
    description: 'Premium quality 7 Mukhi bead set in silver. Symbolizes Goddess Mahalakshmi and attracts abundance.',
    price: 3500,
    image: '/products/pendant-7mukhi.png',
    category: 'Pendant'
  },
  {
    id: '3',
    name: 'Gauri Shankar Rudraksha',
    description: 'Two naturally joined Rudraksha beads representing Shiva and Shakti. enhances harmony in relationships.',
    price: 5100,
    image: '/products/gauri-shankar.png',
    category: 'Premium'
  },
  {
    id: '4',
    name: 'Crystal & Rudraksha Bracelet',
    description: 'A beautiful combination of Sphatik (Crystal) and Rudraksha beads for balance and cooling energy.',
    price: 850,
    image: '/products/bracelet-crystal.png',
    category: 'Bracelet'
  },
  {
    id: '5',
    name: '12 Mukhi Rudraksha (Surya)',
    description: 'Rare 12 Mukhi bead associated with Lord Surya. Brings radiance, power, and leadership qualities.',
    price: 8000,
    image: '/products/12mukhi.png',
    category: 'Premium'
  },
  {
    id: '6',
    name: 'Sandalwood & Rudraksha Mala',
    description: 'Fragrant sandalwood beads alternating with Rudraksha. Ideal for japa and wearing.',
    price: 1500,
    image: '/products/mala-sandalwood.png',
    category: 'Mala'
  }
];
