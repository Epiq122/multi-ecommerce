import type { Category } from '@/payload-types';
import { Footer } from './footer';
import { Navbar } from './navbar';
import { SearchFilters } from './search-filters';

import configPromise from '@payload-config';
import { getPayload } from 'payload';

interface Props {
  children: React.ReactNode;
}

const payload = await getPayload({
  config: configPromise,
});

const data = await payload.find({
  collection: 'categories',
  pagination: false,
  depth: 1, // populate subcategories, subcategories.[0] will be a type of "Category"
  where: {
    parent: {
      exists: false,
    },
  },
});

const formattedData = data.docs.map((doc) => ({
  ...doc,
  subcategories: (doc.subcategories?.docs ?? []).map((doc) => ({
    // because of "depth 1" we are confident "doc" will be a type of Category
    ...(doc as Category),
    subcategories: undefined,
  })),
}));

console.log({
  data,
  formattedData,
});

const Layout = async ({ children }: Props) => {
  return (
    <div className='flex flex-col min-h-screen'>
      <Navbar />
      <SearchFilters data={formattedData} />
      <div className='flex-1 bg-[#f4f4f0]'>{children}</div>
      <Footer />
    </div>
  );
};
export default Layout;
