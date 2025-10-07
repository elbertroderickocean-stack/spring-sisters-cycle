export interface Product {
  id: string;
  name: string;
  nameRu: string;
  description: string;
  price: string;
  image: string;
  line: 'bloom' | 'harmony' | 'precision';
}

export const products: Product[] = [
  {
    id: 'cleanser',
    name: 'Gentle Cleanser',
    nameRu: 'Мягкий Очищающий Гель',
    description: 'Деликатное очищение без пересушивания для всех типов кожи',
    price: '$32.00',
    image: '/images/products/cleanser.jpg',
    line: 'harmony',
  },
  {
    id: 'moisturizer',
    name: 'Daily Moisturizer',
    nameRu: 'Ежедневный Увлажняющий Крем',
    description: 'Легкая, но насыщенная формула для поддержания баланса кожи',
    price: '$48.00',
    image: '/images/products/moisturizer.jpg',
    line: 'harmony',
  },
  {
    id: 'eye-cream',
    name: 'Eye Cream',
    nameRu: 'Крем для Век',
    description: 'Специальный уход для деликатной области вокруг глаз',
    price: '$42.00',
    image: '/images/products/eye-cream.jpg',
    line: 'harmony',
  },
  {
    id: 'serum-trio',
    name: 'Bloom Cycle Serum Trio',
    nameRu: 'Трио Сывороток Bloom Cycle',
    description: 'Интеллектуальная система из трех сывороток, которая адаптируется к вашему циклу',
    price: '$85.00',
    image: '/images/products/serum-trio.jpg',
    line: 'bloom',
  },
  {
    id: 'mask-trio',
    name: 'Bloom Cycle Mask Trio',
    nameRu: 'Трио Масок Bloom Cycle',
    description: 'Три уникальные маски для каждой фазы вашего цикла',
    price: '$78.00',
    image: '/images/products/mask-trio.jpg',
    line: 'bloom',
  },
  {
    id: 'vitamin-c',
    name: 'Vitamin C Concentrate',
    nameRu: 'Концентрат Витамина C',
    description: 'Мощный антиоксидант для сияния и защиты кожи',
    price: '$52.00',
    image: '/images/products/vitamin-c.jpg',
    line: 'precision',
  },
  {
    id: 'ceramide',
    name: 'Ceramide Concentrate',
    nameRu: 'Керамидный Концентрат',
    description: 'Восстанавливает защитный барьер и удерживает влагу',
    price: '$56.00',
    image: '/images/products/ceramide.jpg',
    line: 'precision',
  },
];
