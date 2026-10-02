import { createHash } from "node:crypto";
import { calRequest, type RequestBudget } from "./calClient";
import { isRecord, isText } from "../../src/shared/newstyle/contracts";
// Metadata only: bounded cache, isolated across API accounts and base URLs.
const cache = new Map<string, { title?: string; until: number }>();
export async function serviceTitles(
  ids: number[],
  parent: RequestBudget,
): Promise<Map<number, string>> {
  const titles = new Map<number, string>();
  const deadline = Math.min(parent.deadline, Date.now() + 2500);
  const tenant = createHash("sha256")
    .update(
      (process.env.CAL_API_BASE_URL || "") + "\0" + process.env.CAL_API_KEY,
    )
    .digest("hex");
  const pending = [...new Set(ids)];
  async function worker() {
    while (pending.length) {
      const id = pending.shift()!;
      const key = tenant + ":" + id;
      const hit = cache.get(key);
      if (hit && hit.until > Date.now()) {
        if (hit.title) titles.set(id, hit.title);
        continue;
      }
      if (Date.now() >= deadline) continue;
      let title: string | undefined;
      try {
        const event = await calRequest(
          `/event-types/${id}`,
          "2026-06-12",
          "GET",
          undefined,
          { deadline },
          1500,
        );
        if (
          isRecord(event.data) &&
          isText(event.data.title) &&
          event.data.title
        )
          title = event.data.title;
      } catch {
        /* Optional metadata must not hide valid appointments. */
      }
      if (cache.size >= 256) cache.delete(cache.keys().next().value!);
      cache.set(key, { title, until: Date.now() + (title ? 300_000 : 30_000) });
      if (title) titles.set(id, title);
    }
  }
  await Promise.all(
    Array.from({ length: Math.min(3, pending.length) }, () => worker()),
  );
  return titles;
}
