import { describe, expect, it } from "vitest";
import { compareProjectsByPriorityAndRecency } from "./project-sort";

describe("compareProjectsByPriorityAndRecency", () => {
  it("orders explicit positive manual priorities in ascending numeric order first", () => {
    const items = [
      { id: "c", manual_priority: 3, published_at: "2026-10-01T00:00:00Z" },
      { id: "a", manual_priority: 1, published_at: "2025-01-01T00:00:00Z" },
      { id: "b", manual_priority: 2, published_at: "2026-01-01T00:00:00Z" },
      { id: "unranked", manual_priority: null, published_at: "2026-11-24T00:00:00Z" },
    ];

    const sorted = [...items].sort(compareProjectsByPriorityAndRecency);
    expect(sorted.map((x) => x.id)).toEqual(["a", "b", "c", "unranked"]);
  });

  it("orders unprioritized projects by newest published_at then created_at then id", () => {
    const items = [
      {
        id: "older",
        manual_priority: null,
        published_at: "2026-01-01T00:00:00Z",
        created_at: "2026-01-01T00:00:00Z",
      },
      {
        id: "newer",
        manual_priority: 0,
        published_at: "2026-06-01T00:00:00Z",
        created_at: "2026-06-01T00:00:00Z",
      },
      {
        id: "tie-b",
        manualPriority: null,
        publishedAt: "2026-03-01T00:00:00Z",
        createdAt: "2026-03-01T00:00:00Z",
      },
      {
        id: "tie-a",
        manualPriority: null,
        publishedAt: "2026-03-01T00:00:00Z",
        createdAt: "2026-03-01T00:00:00Z",
      },
    ];

    const sorted = [...items].sort(compareProjectsByPriorityAndRecency);
    expect(sorted.map((x) => x.id)).toEqual(["newer", "tie-a", "tie-b", "older"]);
  });
});
