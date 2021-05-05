import { PAGINATION_QUERY } from '../components/Pagination';

export default function paginationField() {
  return {
    keyArgs: false, // tells Apollo we will handle everything
    read(existing = [], { args, cache }) {
      const { skip, first } = args;
      // Read the number of items on the page from the cache
      const data = cache.readQuery({
        query: PAGINATION_QUERY,
      });
      const count = data?._allProductsMeta?.count;
      const page = skip / first + 1;
      const pages = Math.ceil(count / first);
      //   console.log(data);
      // First thing it does it asks the read function for those items
      const items = existing.slice(skip, skip + first).filter((x) => x);
      // If there are items AND there aren't enough items as requested AND last page, just send it
      if (items.length && items.length !== first && page === pages) {
        return items;
      }
      if (items.length !== first) {
        // We don't have items, must fetch from network
        return false;
      }
      // If there are items, return from cache
      if (items.length) {
        console.log(`There are ${items.length} items in the cache`);
        return items;
      }
      return false; // fallback to network
      // We can either do one of two things
      // First thing return items because they are already in cache
      // Second option: return false from here (network request)
    },
    merge(existing, incoming, { args }) {
      const { skip, first } = args;
      // This runs when Apollo client comes back from the network with our product
      console.log(`Merging items from network ${incoming.length}`);

      const merged = existing ? existing.slice(0) : [];

      for (let i = skip; i < skip + incoming.length; ++i) {
        merged[i] = incoming[i - skip];
      }
      // Return from the cache
      return merged;
    },
  };
}
