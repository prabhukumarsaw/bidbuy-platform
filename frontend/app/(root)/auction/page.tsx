import { Suspense } from 'react';
import Layout from '@/components/auction/Layout';
import ProductGrid from '@/components/auction/ProductGrid';
import MobileActionBar from '@/components/auction/MobileActionBar';
import productsData from '@/assets/products.json';
import { Product } from '@/types/product';

export default function Home() {
  const products: Product[] = productsData.products;

  return (
    <Layout
      categories={productsData.categories}
      conditions={productsData.conditions}
      sellers={productsData.sellers}
    >
      <div className="">
        <Suspense fallback={<div>Loading...</div>}>
          <ProductGrid initialProducts={products} />
        </Suspense>
      </div>
      <MobileActionBar
        categories={productsData.categories}
        conditions={productsData.conditions}
        sellers={productsData.sellers}
      />
    </Layout>
  );
}
