/// <reference types="astro/client" />

import type { SupabaseClient } from "@supabase/supabase-js";
import type { Database } from "./db/database.types";

interface ImportMetaEnv {
  readonly PUBLIC_SUPABASE_URL: string;
  readonly PUBLIC_SUPABASE_ANON_KEY: string;
  readonly AZURE_OPENAI_API_KEY: string;
  readonly AZURE_OPENAI_ENDPOINT: string;
  readonly AZURE_OPENAI_DEPLOYMENT_NAME: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}

declare namespace App {
  interface Locals {
    supabase: SupabaseClient<Database>;
    user: {
      id: string;
      email: string;
    } | null;
  }
}
