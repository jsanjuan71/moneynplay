import { v } from "convex/values";
import { mutation, query } from "./_generated/server";
import { Doc, Id } from "./_generated/dataModel";

// ============================================
// WALLET QUERIES
// ============================================

export const getWalletByUserId = query({
  args: { userId: v.id("users") },
  handler: async (ctx, args) => {
    return await ctx.db
      .query("wallets")
      .withIndex("by_user", (q) => q.eq("userId", args.userId))
      .first();
  },
});

export const getWalletBalance = query({
  args: { userId: v.id("users") },
  handler: async (ctx, args) => {
    const wallet = await ctx.db
      .query("wallets")
      .withIndex("by_user", (q) => q.eq("userId", args.userId))
      .first();

    if (!wallet) {
      throw new Error("Wallet not found");
    }

    return {
      realMoney: wallet.realMoneyBalance,
      virtualCoins: wallet.virtualCoinsBalance,
      savings: wallet.savingsBalance,
      investment: wallet.investmentBalance,
      totalReal: wallet.realMoneyBalance + wallet.savingsBalance + wallet.investmentBalance,
    };
  },
});

// ============================================
// TRANSACTION QUERIES
// ============================================

export const getTransactionsByUser = query({
  args: { 
    userId: v.id("users"),
    limit: v.optional(v.number()),
  },
  handler: async (ctx, args) => {
    const query = ctx.db
      .query("transactions")
      .withIndex("by_user", (q) => q.eq("userId", args.userId))
      .order("desc");

    if (args.limit) {
      return await query.take(args.limit);
    }

    return await query.collect();
  },
});

export const getPendingApprovals = query({
  args: { parentId: v.id("users") },
  handler: async (ctx, args) => {
    // Get all children of this parent
    const children = await ctx.db
      .query("users")
      .withIndex("by_parent", (q) => q.eq("parentId", args.parentId))
      .collect();

    const childIds = children.map(c => c._id);

    // Get pending transactions for all children
    const pendingTransactions = [];
    for (const childId of childIds) {
      const transactions = await ctx.db
        .query("transactions")
        .withIndex("by_user", (q) => q.eq("userId", childId))
        .filter((q) => 
          q.and(
            q.eq(q.field("status"), "pending"),
            q.eq(q.field("parentApprovalRequired"), true)
          )
        )
        .collect();
      
      pendingTransactions.push(...transactions);
    }

    return pendingTransactions;
  },
});

// ============================================
// WALLET MUTATIONS
// ============================================

export const depositRealMoney = mutation({
  args: {
    parentId: v.id("users"),
    childId: v.id("users"),
    amount: v.number(), // in cents
    description: v.string(),
  },
  handler: async (ctx, args) => {
    // Verify parent-child relationship
    const child = await ctx.db.get(args.childId);
    if (!child || child.parentId !== args.parentId) {
      throw new Error("Unauthorized");
    }

    if (args.amount <= 0) {
      throw new Error("Amount must be positive");
    }

    // Get wallet
    const wallet = await ctx.db
      .query("wallets")
      .withIndex("by_user", (q) => q.eq("userId", args.childId))
      .first();

    if (!wallet) {
      throw new Error("Wallet not found");
    }

    // Update wallet
    await ctx.db.patch(wallet._id, {
      realMoneyBalance: wallet.realMoneyBalance + args.amount,
      updatedAt: Date.now(),
    });

    // Create transaction record
    await ctx.db.insert("transactions", {
      userId: args.childId,
      type: "deposit",
      amount: args.amount,
      currency: "real",
      description: args.description,
      status: "completed",
      parentApprovalRequired: false,
      approvedBy: args.parentId,
      approvedAt: Date.now(),
      createdAt: Date.now(),
    });

    // Log activity
    await ctx.db.insert("activityLog", {
      userId: args.childId,
      actorId: args.parentId,
      actionType: "deposit",
      description: `Parent deposited $${(args.amount / 100).toFixed(2)}`,
      metadata: { amount: args.amount },
      createdAt: Date.now(),
    });

    return { success: true, newBalance: wallet.realMoneyBalance + args.amount };
  },
});

export const transferToSavings = mutation({
  args: {
    userId: v.id("users"),
    amount: v.number(), // in cents
  },
  handler: async (ctx, args) => {
    const wallet = await ctx.db
      .query("wallets")
      .withIndex("by_user", (q) => q.eq("userId", args.userId))
      .first();

    if (!wallet) {
      throw new Error("Wallet not found");
    }

    if (args.amount <= 0) {
      throw new Error("Amount must be positive");
    }

    if (wallet.realMoneyBalance < args.amount) {
      throw new Error("Insufficient balance");
    }

    // Update wallet
    await ctx.db.patch(wallet._id, {
      realMoneyBalance: wallet.realMoneyBalance - args.amount,
      savingsBalance: wallet.savingsBalance + args.amount,
      updatedAt: Date.now(),
    });

    // Create transaction
    await ctx.db.insert("transactions", {
      userId: args.userId,
      type: "transfer_to_savings",
      amount: args.amount,
      currency: "real",
      description: `Transferred $${(args.amount / 100).toFixed(2)} to savings`,
      status: "completed",
      parentApprovalRequired: false,
      createdAt: Date.now(),
    });

    // Log activity
    await ctx.db.insert("activityLog", {
      userId: args.userId,
      actorId: args.userId,
      actionType: "transfer_to_savings",
      description: `Saved $${(args.amount / 100).toFixed(2)}`,
      metadata: { amount: args.amount },
      createdAt: Date.now(),
    });

    return { success: true };
  },
});

export const awardVirtualCoins = mutation({
  args: {
    userId: v.id("users"),
    amount: v.number(),
    reason: v.string(),
  },
  handler: async (ctx, args) => {
    const wallet = await ctx.db
      .query("wallets")
      .withIndex("by_user", (q) => q.eq("userId", args.userId))
      .first();

    if (!wallet) {
      throw new Error("Wallet not found");
    }

    await ctx.db.patch(wallet._id, {
      virtualCoinsBalance: wallet.virtualCoinsBalance + args.amount,
      updatedAt: Date.now(),
    });

    await ctx.db.insert("transactions", {
      userId: args.userId,
      type: "mission_reward",
      amount: args.amount,
      currency: "virtual",
      description: args.reason,
      status: "completed",
      parentApprovalRequired: false,
      createdAt: Date.now(),
    });

    return { success: true, newBalance: wallet.virtualCoinsBalance + args.amount };
  },
});

export const spendVirtualCoins = mutation({
  args: {
    userId: v.id("users"),
    amount: v.number(),
    description: v.string(),
  },
  handler: async (ctx, args) => {
    const wallet = await ctx.db
      .query("wallets")
      .withIndex("by_user", (q) => q.eq("userId", args.userId))
      .first();

    if (!wallet) {
      throw new Error("Wallet not found");
    }

    if (wallet.virtualCoinsBalance < args.amount) {
      throw new Error("Insufficient virtual coins");
    }

    await ctx.db.patch(wallet._id, {
      virtualCoinsBalance: wallet.virtualCoinsBalance - args.amount,
      updatedAt: Date.now(),
    });

    await ctx.db.insert("transactions", {
      userId: args.userId,
      type: "purchase",
      amount: args.amount,
      currency: "virtual",
      description: args.description,
      status: "completed",
      parentApprovalRequired: false,
      createdAt: Date.now(),
    });

    return { success: true, newBalance: wallet.virtualCoinsBalance - args.amount };
  },
});
