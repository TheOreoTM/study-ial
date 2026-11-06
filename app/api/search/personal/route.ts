import { getPersonalSearch } from "@/lib/queries/search-personal";
import { getUser } from "@/lib/session";

// A signed-in student's own search data (mastery, recent topics, answered questions, mock papers). Private: never
// cached anywhere, so it can't be served to someone else.
const PRIVATE = { "Cache-Control": "private, no-store" };

export async function GET() {
    const user = await getUser();
    if (!user) return Response.json({ error: "Not signed in" }, { status: 401, headers: PRIVATE });
    return Response.json(await getPersonalSearch(user.id), { headers: PRIVATE });
}
