import { v } from "convex/values";
import { mutation, query } from "./_generated/server";
import { Doc, Id } from "./_generated/dataModel";

// ============================================
// USER QUERIES
// ============================================

export const getUserById = query({
  args: { userId: v.id("users") },
  handler: async (ctx, args) => {
    return await ctx.db.get(args.userId);
  },
});

export const getUserByEmail = query({
  args: { email: v.string() },
  handler: async (ctx, args) => {
    return await ctx.db
      .query("users")
      .withIndex("by_email", (q) => q.eq("email", args.email))
      .first();
  },
});

export const getChildrenByParent = query({
  args: { parentId: v.id("users") },
  handler: async (ctx, args) => {
    return await ctx.db
      .query("users")
      .withIndex("by_parent", (q) => q.eq("parentId", args.parentId))
      .collect();
  },
});

// ============================================
// USER MUTATIONS
// ============================================

export const createParent = mutation({
  args: {
    email: v.string(),
    name: v.string(),
  },
  handler: async (ctx, args) => {
    const existing = await ctx.db
      .query("users")
      .withIndex("by_email", (q) => q.eq("email", args.email))
      .first();

    if (existing) {
      throw new Error("User with this email already exists");
    }

    const userId = await ctx.db.insert("users", {
      email: args.email,
      name: args.name,
      role: "parent",
      createdAt: Date.now(),
      isActive: true,
    });

    return userId;
  },
});

export const createChild = mutation({
  args: {
    parentId: v.id("users"),
    name: v.string(),
    age: v.number(),
    pin: v.string(), // Should be hashed before sending
    email: v.string(), // Child email (can be parent's email + suffix)
  },
  handler: async (ctx, args) => {
    // Verify parent exists
    const parent = await ctx.db.get(args.parentId);
    if (!parent || parent.role !== "parent") {
      throw new Error("Invalid parent ID");
    }

    // Create child user
    const childId = await ctx.db.insert("users", {
      email: args.email,
      name: args.name,
      role: "child",
      parentId: args.parentId,
      age: args.age,
      pin: args.pin,
      createdAt: Date.now(),
      isActive: true,
    });

    // Create wallet for child
    await ctx.db.insert("wallets", {
      userId: childId,
      realMoneyBalance: 0,
      virtualCoinsBalance: 0,
      savingsBalance: 0,
      investmentBalance: 0,
      createdAt: Date.now(),
      updatedAt: Date.now(),
    });

    // Create default avatar
    await ctx.db.insert("avatars", {
      userId: childId,
      name: args.name,
      skinTone: "medium",
      hairStyle: "short",
      hairColor: "brown",
      outfit: "default",
      accessories: [],
      createdAt: Date.now(),
      updatedAt: Date.now(),
    });

    // Log activity
    await ctx.db.insert("activityLog", {
      userId: childId,
      actorId: args.parentId,
      actionType: "account_created",
      description: `Account created for ${args.name}`,
      createdAt: Date.now(),
    });

    return childId;
  },
});

export const updateChildPin = mutation({
  args: {
    childId: v.id("users"),
    parentId: v.id("users"),
    newPin: v.string(), // Hashed
  },
  handler: async (ctx, args) => {
    const child = await ctx.db.get(args.childId);
    
    if (!child || child.role !== "child" || child.parentId !== args.parentId) {
      throw new Error("Unauthorized");
    }

    await ctx.db.patch(args.childId, {
      pin: args.newPin,
    });

    await ctx.db.insert("activityLog", {
      userId: args.childId,
      actorId: args.parentId,
      actionType: "pin_updated",
      description: "PIN updated by parent",
      createdAt: Date.now(),
    });

    return { success: true };
  },
});

export const verifyChildPin = query({
  args: {
    childId: v.id("users"),
    pin: v.string(), // Hashed
  },
  handler: async (ctx, args) => {
    const child = await ctx.db.get(args.childId);
    
    if (!child || child.role !== "child") {
      return false;
    }

    return child.pin === args.pin;
  },
});
