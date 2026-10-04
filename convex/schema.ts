import { defineSchema, defineTable } from "convex/server";
import { v } from "convex/values";

export default defineSchema({
  submissions: defineTable({
    name: v.optional(v.string()),
    wish: v.optional(v.string()),
    photoUrl: v.optional(v.string()),
    photoPublicId: v.optional(v.string()),
    videoUrl: v.optional(v.string()),
    videoPublicId: v.optional(v.string()),
    createdAt: v.number(),
  }),
});
