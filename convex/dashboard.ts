import { v } from "convex/values";
import { query } from "./_generated/server";

// ============================================
// KID DASHBOARD DATA
// ============================================

export const getKidDashboard = query({
  args: { userId: v.id("users") },
  handler: async (ctx, args) => {
    // Get user info
    const user = await ctx.db.get(args.userId);
    if (!user || user.role !== "child") {
      throw new Error("User not found or not a child");
    }

    // Get wallet
    const wallet = await ctx.db
      .query("wallets")
      .withIndex("by_user", (q) => q.eq("userId", args.userId))
      .first();

    if (!wallet) {
      throw new Error("Wallet not found");
    }

    // Get active missions
    const activeMissions = await ctx.db
      .query("userMissions")
      .withIndex("by_user", (q) => q.eq("userId", args.userId))
      .filter((q) => q.eq(q.field("status"), "active"))
      .collect();

    // Get mission details for active missions
    const missionsWithDetails = await Promise.all(
      activeMissions.map(async (um) => {
        const mission = await ctx.db.get(um.missionId);
        return {
          userMission: um,
          mission: mission,
        };
      })
    );

    // Get recent transactions (last 5)
    const recentTransactions = await ctx.db
      .query("transactions")
      .withIndex("by_user", (q) => q.eq("userId", args.userId))
      .order("desc")
      .take(5);

    // Get avatar
    const avatar = await ctx.db
      .query("avatars")
      .withIndex("by_user", (q) => q.eq("userId", args.userId))
      .first();

    // Get recent achievements (last 3)
    const recentAchievements = await ctx.db
      .query("userAchievements")
      .withIndex("by_user", (q) => q.eq("userId", args.userId))
      .order("desc")
      .take(3);

    // Get achievement details
    const achievementsWithDetails = await Promise.all(
      recentAchievements.map(async (ua) => {
        const achievement = await ctx.db.get(ua.achievementId);
        return {
          userAchievement: ua,
          achievement: achievement,
        };
      })
    );

    return {
      user,
      wallet,
      activeMissions: missionsWithDetails,
      recentTransactions,
      avatar,
      recentAchievements: achievementsWithDetails,
    };
  },
});

// ============================================
// AVAILABLE MISSIONS FOR KID
// ============================================

export const getAvailableMissions = query({
  args: { userId: v.id("users") },
  handler: async (ctx, args) => {
    const user = await ctx.db.get(args.userId);
    if (!user || user.role !== "child") {
      throw new Error("User not found or not a child");
    }

    // Get all active missions suitable for child's age
    const allMissions = await ctx.db
      .query("missions")
      .withIndex("by_active", (q) => q.eq("isActive", true))
      .filter((q) =>
        q.and(
          q.lte(q.field("ageRange.min"), user.age || 10),
          q.gte(q.field("ageRange.max"), user.age || 10)
        )
      )
      .collect();

    // Get user's current missions
    const userMissions = await ctx.db
      .query("userMissions")
      .withIndex("by_user", (q) => q.eq("userId", args.userId))
      .collect();

    const userMissionIds = new Set(userMissions.map((um) => um.missionId));

    // Filter out missions user already has
    const availableMissions = allMissions.filter(
      (mission) => !userMissionIds.has(mission._id)
    );

    return availableMissions;
  },
});

// ============================================
// ACTIVITY SUMMARY
// ============================================

export const getActivitySummary = query({
  args: { userId: v.id("users"), days: v.optional(v.number()) },
  handler: async (ctx, args) => {
    const days = args.days || 7;
    const cutoffDate = Date.now() - days * 24 * 60 * 60 * 1000;

    const recentActivity = await ctx.db
      .query("activityLog")
      .withIndex("by_user", (q) => q.eq("userId", args.userId))
      .filter((q) => q.gte(q.field("createdAt"), cutoffDate))
      .order("desc")
      .collect();

    // Count missions completed in period
    const completedMissions = await ctx.db
      .query("userMissions")
      .withIndex("by_user", (q) => q.eq("userId", args.userId))
      .filter((q) =>
        q.and(
          q.eq(q.field("status"), "completed"),
          q.gte(q.field("completedAt"), cutoffDate)
        )
      )
      .collect();

    // Calculate coins earned
    const coinTransactions = await ctx.db
      .query("transactions")
      .withIndex("by_user", (q) => q.eq("userId", args.userId))
      .filter((q) =>
        q.and(
          q.eq(q.field("currency"), "virtual"),
          q.eq(q.field("type"), "mission_reward"),
          q.gte(q.field("createdAt"), cutoffDate)
        )
      )
      .collect();

    const coinsEarned = coinTransactions.reduce(
      (sum, tx) => sum + tx.amount,
      0
    );

    return {
      recentActivity,
      stats: {
        missionsCompleted: completedMissions.length,
        coinsEarned,
        activeDays: new Set(
          recentActivity.map((a) =>
            new Date(a.createdAt).toDateString()
          )
        ).size,
      },
    };
  },
});
