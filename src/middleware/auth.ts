import { createClient } from "@supabase/supabase-js";
import type { APIRoute } from "astro";

const supabase = createClient(import.meta.env.PUBLIC_SUPABASE_URL, import.meta.env.PUBLIC_SUPABASE_ANON_KEY);

export type AuthenticatedAPIRoute = (
  context: Parameters<APIRoute>[0] & {
    locals: {
      userId: string;
    };
  }
) => ReturnType<APIRoute>;

export async function authenticateUser(request: Request): Promise<{ userId: string } | null> {
  const authHeader = request.headers.get("Authorization");

  if (!authHeader?.startsWith("Bearer ")) {
    return null;
  }

  const token = authHeader.split(" ")[1];

  try {
    const {
      data: { user },
      error,
    } = await supabase.auth.getUser(token);

    if (error || !user) {
      return null;
    }

    return { userId: user.id };
  } catch (error) {
    console.error("Błąd autoryzacji:", error);
    return null;
  }
}

export function withAuth(handler: AuthenticatedAPIRoute): APIRoute {
  return async (context) => {
    const auth = await authenticateUser(context.request);

    if (!auth) {
      return new Response(
        JSON.stringify({
          error: "Nieautoryzowany dostęp",
        }),
        {
          status: 401,
          headers: {
            "Content-Type": "application/json",
          },
        }
      );
    }

    context.locals = auth;
    return handler(context);
  };
}
