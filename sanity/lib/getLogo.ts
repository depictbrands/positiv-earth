import { cache } from "react";

import { DEFAULT_LOGO_CONTENT, type LogoContent } from "@/types/logo-content";

import { client } from "./client";
import { mapLogo } from "./mapLogo";
import { LOGO_QUERY } from "./queries";

export const getLogo = cache(async (): Promise<LogoContent> => {
  if (!client) {
    return DEFAULT_LOGO_CONTENT;
  }

  const data = await client.fetch(LOGO_QUERY);
  return mapLogo(data);
});
