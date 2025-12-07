import { v } from "convex/values";
import { mutation } from "./_generated/server";

// ============================================
// SEED DATABASE WITH DEMO DATA
// ============================================

export const seedDemoData = mutation({
  args: {},
  handler: async (ctx) => {
    // Check if data already exists
    const existingUsers = await ctx.db.query("users").collect();
    if (existingUsers.length > 0) {
      return { message: "Demo data already exists" };
    }

    // Create parent user
    const parentId = await ctx.db.insert("users", {
      email: "parent@demo.com",
      name: "Demo Parent",
      role: "parent",
      createdAt: Date.now(),
      isActive: true,
    });

    // Create child user
    const childId = await ctx.db.insert("users", {
      email: "child@demo.com",
      name: "Alex",
      role: "child",
      parentId: parentId,
      age: 10,
      pin: "1234", // In production, this should be hashed
      createdAt: Date.now(),
      isActive: true,
    });

    // Create wallet for child
    await ctx.db.insert("wallets", {
      userId: childId,
      realMoneyBalance: 2500, // $25.00
      virtualCoinsBalance: 150,
      savingsBalance: 1000, // $10.00
      investmentBalance: 500, // $5.00
      createdAt: Date.now(),
      updatedAt: Date.now(),
    });

    // Create avatar for child
    const avatarId = await ctx.db.insert("avatars", {
      userId: childId,
      name: "Alex",
      skinTone: "medium",
      hairStyle: "short",
      hairColor: "brown",
      outfit: "casual",
      accessories: ["sunglasses", "cap"],
      createdAt: Date.now(),
      updatedAt: Date.now(),
    });

    // Update user with avatar
    await ctx.db.patch(childId, { avatarId });

    // Create sample missions
    const mission1 = await ctx.db.insert("missions", {
      title: {
        en: "Save $5 This Week",
        es: "Ahorra $5 Esta Semana",
      },
      description: {
        en: "Put aside $5 in your savings this week!",
        es: "¡Guarda $5 en tus ahorros esta semana!",
      },
      type: "save_money",
      difficulty: "easy",
      rewardCoins: 50,
      targetValue: 500,
      durationDays: 7,
      isActive: true,
      ageRange: { min: 6, max: 14 },
      createdAt: Date.now(),
    });

    const mission2 = await ctx.db.insert("missions", {
      title: {
        en: "Watch: What is a Bank?",
        es: "Ver: ¿Qué es un Banco?",
      },
      description: {
        en: "Learn about how banks work in this fun video!",
        es: "¡Aprende cómo funcionan los bancos en este divertido video!",
      },
      type: "learn_video",
      difficulty: "easy",
      rewardCoins: 25,
      durationDays: 1,
      isActive: true,
      ageRange: { min: 6, max: 14 },
      createdAt: Date.now(),
    });

    const mission3 = await ctx.db.insert("missions", {
      title: {
        en: "Needs vs Wants Quiz",
        es: "Cuestionario: Necesidades vs Deseos",
      },
      description: {
        en: "Can you tell the difference between needs and wants?",
        es: "¿Puedes diferenciar entre necesidades y deseos?",
      },
      type: "make_decision",
      difficulty: "medium",
      rewardCoins: 75,
      isActive: true,
      ageRange: { min: 8, max: 14 },
      createdAt: Date.now(),
    });

    // Create active mission for child
    await ctx.db.insert("userMissions", {
      userId: childId,
      missionId: mission1,
      status: "active",
      progress: 60,
      currentValue: 300,
      startedAt: Date.now() - 3 * 24 * 60 * 60 * 1000, // Started 3 days ago
      expiresAt: Date.now() + 4 * 24 * 60 * 60 * 1000, // Expires in 4 days
      rewardClaimed: false,
    });

    await ctx.db.insert("userMissions", {
      userId: childId,
      missionId: mission2,
      status: "active",
      progress: 0,
      startedAt: Date.now(),
      expiresAt: Date.now() + 1 * 24 * 60 * 60 * 1000,
      rewardClaimed: false,
    });

    // Create sample transactions
    await ctx.db.insert("transactions", {
      userId: childId,
      type: "deposit",
      amount: 2000,
      currency: "real",
      description: "Weekly allowance from Mom",
      status: "completed",
      parentApprovalRequired: false,
      approvedBy: parentId,
      approvedAt: Date.now() - 2 * 24 * 60 * 60 * 1000,
      createdAt: Date.now() - 2 * 24 * 60 * 60 * 1000,
    });

    await ctx.db.insert("transactions", {
      userId: childId,
      type: "mission_reward",
      amount: 50,
      currency: "virtual",
      description: "Completed: Learn About Saving",
      status: "completed",
      parentApprovalRequired: false,
      createdAt: Date.now() - 1 * 24 * 60 * 60 * 1000,
    });

    await ctx.db.insert("transactions", {
      userId: childId,
      type: "transfer_to_savings",
      amount: 500,
      currency: "real",
      description: "Saved money for future goals",
      status: "completed",
      parentApprovalRequired: false,
      createdAt: Date.now() - 1 * 24 * 60 * 60 * 1000,
    });

    // Create sample shop items
    await ctx.db.insert("shopItems", {
      name: {
        en: "Cool Sunglasses",
        es: "Gafas de Sol Geniales",
      },
      description: {
        en: "Look stylish with these awesome shades!",
        es: "¡Luce con estilo con estas gafas increíbles!",
      },
      category: "accessory",
      priceCoins: 50,
      imageUrl: "/items/sunglasses.svg",
      isActive: true,
      rarity: "rare",
      createdAt: Date.now(),
    });

    await ctx.db.insert("shopItems", {
      name: {
        en: "Superhero Cape",
        es: "Capa de Superhéroe",
      },
      description: {
        en: "Feel like a superhero with this epic cape!",
        es: "¡Siéntete como un superhéroe con esta capa épica!",
      },
      category: "outfit",
      priceCoins: 100,
      imageUrl: "/items/cape.svg",
      isActive: true,
      rarity: "epic",
      createdAt: Date.now(),
    });

    // Create sample achievement
    const achievement = await ctx.db.insert("achievements", {
      name: {
        en: "First Steps",
        es: "Primeros Pasos",
      },
      description: {
        en: "Welcome to Money n Play!",
        es: "¡Bienvenido a Money n Play!",
      },
      icon: "🎉",
      category: "milestone",
      requirement: { type: "signup" },
      rewardCoins: 10,
      isActive: true,
    });

    await ctx.db.insert("userAchievements", {
      userId: childId,
      achievementId: achievement,
      unlockedAt: Date.now(),
      progress: 100,
    });

    // Create activity logs
    await ctx.db.insert("activityLog", {
      userId: childId,
      actorId: parentId,
      actionType: "account_created",
      description: "Account created by parent",
      createdAt: Date.now() - 7 * 24 * 60 * 60 * 1000,
    });

    await ctx.db.insert("activityLog", {
      userId: childId,
      actorId: childId,
      actionType: "mission_started",
      description: "Started mission: Save $5 This Week",
      createdAt: Date.now() - 3 * 24 * 60 * 60 * 1000,
    });

    return {
      message: "Demo data seeded successfully!",
      parentId,
      childId,
    };
  },
});

// Helper to clear all data (for testing)
export const clearAllData = mutation({
  args: {},
  handler: async (ctx) => {
    const tables = [
      "users",
      "wallets",
      "transactions",
      "missions",
      "userMissions",
      "learningContent",
      "userLearningProgress",
      "avatars",
      "shopItems",
      "userInventory",
      "marketplaceListing",
      "parentalApprovals",
      "allowances",
      "friendships",
      "activityLog",
      "achievements",
      "userAchievements",
    ];

    for (const table of tables) {
      const items = await ctx.db.query(table as any).collect();
      for (const item of items) {
        await ctx.db.delete(item._id);
      }
    }

    return { message: "All data cleared" };
  },
});
