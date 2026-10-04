import { mutationGeneric, queryGeneric } from "convex/server";
import { v } from "convex/values";

export const create = mutationGeneric({
  args: {
    name: v.optional(v.string()),
    wish: v.optional(v.string()),
    photoUrl: v.optional(v.string()),
    photoPublicId: v.optional(v.string()),
    videoUrl: v.optional(v.string()),
    videoPublicId: v.optional(v.string()),
  },
  returns: v.id("submissions"),
  handler: async (ctx, args) => {
    const name = args.name?.trim() || undefined;
    const wish = args.wish?.trim() || undefined;

    if (!name && !wish && !args.photoUrl && !args.videoUrl) {
      throw new Error("A submission must contain at least one birthday contribution.");
    }

    if (name && name.length > 80) {
      throw new Error("Name is too long.");
    }

    if (wish && wish.length > 2000) {
      throw new Error("Wish is too long.");
    }

    return ctx.db.insert("submissions", {
      ...args,
      name,
      wish,
      createdAt: Date.now(),
    });
  },
});

export const list = queryGeneric({
  args: {
    token: v.string(),
  },
  returns: v.array(
    v.object({
      _id: v.id("submissions"),
      _creationTime: v.number(),
      name: v.optional(v.string()),
      wish: v.optional(v.string()),
      photoUrl: v.optional(v.string()),
      photoPublicId: v.optional(v.string()),
      videoUrl: v.optional(v.string()),
      videoPublicId: v.optional(v.string()),
      createdAt: v.number(),
    }),
  ),
  handler: async (ctx, { token }) => {
    const expectedToken = process.env.ADMIN_ACCESS_TOKEN;

    if (!expectedToken || token !== expectedToken) {
      throw new Error("Not authorized.");
    }

    return ctx.db.query("submissions").order("desc").collect();
  },
});
