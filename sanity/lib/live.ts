import { defineLive } from "next-sanity/live";

import { client } from "./client";

export const { sanityFetch, SanityLive } = client
  ? defineLive({ client })
  : {
      sanityFetch: async () => ({ data: null }),
      SanityLive: () => null,
    };
