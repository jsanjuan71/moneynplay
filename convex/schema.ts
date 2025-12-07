import { defineSchema, defineTable } from "convex/server";
import { v } from "convex/values";

export default defineSchema({
  // ============================================
  // USERS & ACCOUNTS
  // ============================================
  
  users: defineTable({
    email: v.string(),
    name: v.string(),
    role: v.union(v.literal("parent"), v.literal("child")),
    parentId: v.optional(v.id("users")), // For children, links to parent
    pin: v.optional(v.string()), // For children (hashed)
    age: v.optional(v.number()), // For children
    avatarId: v.optional(v.id("avatars")),
    createdAt: v.number(),
    lastLoginAt: v.optional(v.number()),
    isActive: v.boolean(),
  })
    .index("by_email", ["email"])
    .index("by_parent", ["parentId"])
    .index("by_role", ["role"]),

  // ============================================
  // WALLETS & MONEY
  // ============================================
  
  wallets: defineTable({
    userId: v.id("users"),
    realMoneyBalance: v.number(), // Cents (USD) - real money, non-withdrawable
    virtualCoinsBalance: v.number(), // Virtual coins for spending on avatars/items
    savingsBalance: v.number(), // Part of real money allocated to savings
    investmentBalance: v.number(), // Simulated investment balance
    createdAt: v.number(),
    updatedAt: v.number(),
  }).index("by_user", ["userId"]),

  transactions: defineTable({
    userId: v.id("users"),
    type: v.union(
      v.literal("deposit"), // Parent adds real money
      v.literal("withdrawal"), // Not allowed for kids
      v.literal("transfer_to_savings"),
      v.literal("transfer_to_investment"),
      v.literal("mission_reward"), // Earn virtual coins
      v.literal("purchase"), // Spend virtual coins
      v.literal("allowance"), // Recurring deposit
      v.literal("marketplace_sale"),
      v.literal("marketplace_purchase")
    ),
    amount: v.number(),
    currency: v.union(v.literal("real"), v.literal("virtual")),
    description: v.string(),
    status: v.union(
      v.literal("pending"), // Awaiting parent approval
      v.literal("approved"),
      v.literal("rejected"),
      v.literal("completed")
    ),
    parentApprovalRequired: v.boolean(),
    approvedBy: v.optional(v.id("users")),
    approvedAt: v.optional(v.number()),
    metadata: v.optional(v.any()), // For additional context
    createdAt: v.number(),
  })
    .index("by_user", ["userId"])
    .index("by_status", ["status"])
    .index("by_type", ["type"]),

  // ============================================
  // MISSIONS & LEARNING
  // ============================================
  
  missions: defineTable({
    title: v.object({
      en: v.string(),
      es: v.string(),
    }),
    description: v.object({
      en: v.string(),
      es: v.string(),
    }),
    type: v.union(
      v.literal("save_money"), // e.g., "Save $5 this week"
      v.literal("learn_video"), // Watch educational video
      v.literal("make_decision"), // Answer questions (needs vs wants)
      v.literal("predict_investment"), // Predict simulation result
      v.literal("complete_task"), // Parent-assigned task
      v.literal("streak"), // Daily login or activity
      v.literal("quiz") // Financial literacy quiz
    ),
    difficulty: v.union(v.literal("easy"), v.literal("medium"), v.literal("hard")),
    rewardCoins: v.number(),
    targetValue: v.optional(v.number()), // e.g., save $5 = 500 cents
    durationDays: v.optional(v.number()), // Mission duration
    isActive: v.boolean(),
    ageRange: v.object({
      min: v.number(),
      max: v.number(),
    }),
    createdAt: v.number(),
  })
    .index("by_active", ["isActive"])
    .index("by_type", ["type"]),

  userMissions: defineTable({
    userId: v.id("users"),
    missionId: v.id("missions"),
    status: v.union(
      v.literal("active"),
      v.literal("completed"),
      v.literal("failed"),
      v.literal("expired")
    ),
    progress: v.number(), // 0-100
    currentValue: v.optional(v.number()), // For tracking progress
    startedAt: v.number(),
    completedAt: v.optional(v.number()),
    expiresAt: v.optional(v.number()),
    rewardClaimed: v.boolean(),
  })
    .index("by_user", ["userId"])
    .index("by_mission", ["missionId"])
    .index("by_status", ["status"]),

  learningContent: defineTable({
    title: v.object({
      en: v.string(),
      es: v.string(),
    }),
    description: v.object({
      en: v.string(),
      es: v.string(),
    }),
    type: v.union(
      v.literal("video"),
      v.literal("article"),
      v.literal("story"),
      v.literal("tip")
    ),
    contentUrl: v.optional(v.string()), // For videos/external content
    content: v.optional(v.object({
      en: v.string(),
      es: v.string(),
    })), // For text content
    ageRange: v.object({
      min: v.number(),
      max: v.number(),
    }),
    rewardCoins: v.number(), // Coins earned for completing
    tags: v.array(v.string()), // e.g., ["saving", "investing", "budgeting"]
    isActive: v.boolean(),
    createdAt: v.number(),
  })
    .index("by_active", ["isActive"])
    .index("by_type", ["type"]),

  userLearningProgress: defineTable({
    userId: v.id("users"),
    contentId: v.id("learningContent"),
    completed: v.boolean(),
    completedAt: v.optional(v.number()),
    rewardClaimed: v.boolean(),
  })
    .index("by_user", ["userId"])
    .index("by_content", ["contentId"]),

  // ============================================
  // AVATARS & CUSTOMIZATION
  // ============================================
  
  avatars: defineTable({
    userId: v.id("users"),
    name: v.string(),
    skinTone: v.string(),
    hairStyle: v.string(),
    hairColor: v.string(),
    outfit: v.string(),
    accessories: v.array(v.string()),
    createdAt: v.number(),
    updatedAt: v.number(),
  }).index("by_user", ["userId"]),

  shopItems: defineTable({
    name: v.object({
      en: v.string(),
      es: v.string(),
    }),
    description: v.object({
      en: v.string(),
      es: v.string(),
    }),
    category: v.union(
      v.literal("hair"),
      v.literal("outfit"),
      v.literal("accessory"),
      v.literal("background"),
      v.literal("badge")
    ),
    priceCoins: v.number(),
    imageUrl: v.string(),
    isActive: v.boolean(),
    rarity: v.union(
      v.literal("common"),
      v.literal("rare"),
      v.literal("epic"),
      v.literal("legendary")
    ),
    createdAt: v.number(),
  })
    .index("by_category", ["category"])
    .index("by_active", ["isActive"]),

  userInventory: defineTable({
    userId: v.id("users"),
    itemId: v.id("shopItems"),
    acquiredAt: v.number(),
    isEquipped: v.boolean(),
  })
    .index("by_user", ["userId"])
    .index("by_item", ["itemId"]),

  // ============================================
  // MARKETPLACE (Virtual Trading)
  // ============================================
  
  marketplaceListing: defineTable({
    sellerId: v.id("users"),
    itemId: v.id("shopItems"),
    priceCoins: v.number(),
    description: v.optional(v.string()),
    status: v.union(
      v.literal("active"),
      v.literal("sold"),
      v.literal("cancelled")
    ),
    createdAt: v.number(),
    soldAt: v.optional(v.number()),
    soldTo: v.optional(v.id("users")),
  })
    .index("by_seller", ["sellerId"])
    .index("by_status", ["status"]),

  // ============================================
  // PARENTAL CONTROLS & APPROVALS
  // ============================================
  
  parentalApprovals: defineTable({
    parentId: v.id("users"),
    childId: v.id("users"),
    actionType: v.union(
      v.literal("transaction"),
      v.literal("marketplace_purchase"),
      v.literal("friend_request"),
      v.literal("large_purchase")
    ),
    actionId: v.string(), // Reference to the action (transaction ID, etc.)
    status: v.union(
      v.literal("pending"),
      v.literal("approved"),
      v.literal("rejected")
    ),
    requestedAt: v.number(),
    respondedAt: v.optional(v.number()),
    notes: v.optional(v.string()),
  })
    .index("by_parent", ["parentId"])
    .index("by_child", ["childId"])
    .index("by_status", ["status"]),

  allowances: defineTable({
    parentId: v.id("users"),
    childId: v.id("users"),
    amount: v.number(), // In cents
    frequency: v.union(
      v.literal("daily"),
      v.literal("weekly"),
      v.literal("biweekly"),
      v.literal("monthly")
    ),
    nextPaymentDate: v.number(),
    isActive: v.boolean(),
    createdAt: v.number(),
  })
    .index("by_child", ["childId"])
    .index("by_parent", ["parentId"]),

  // ============================================
  // SOCIAL & SAFETY
  // ============================================
  
  friendships: defineTable({
    userId: v.id("users"),
    friendId: v.id("users"),
    status: v.union(
      v.literal("pending"), // Awaiting parent approval
      v.literal("approved"),
      v.literal("blocked")
    ),
    requestedAt: v.number(),
    approvedAt: v.optional(v.number()),
    approvedBy: v.optional(v.id("users")), // Parent who approved
  })
    .index("by_user", ["userId"])
    .index("by_friend", ["friendId"])
    .index("by_status", ["status"]),

  // ============================================
  // ACTIVITY & ANALYTICS
  // ============================================
  
  activityLog: defineTable({
    userId: v.id("users"),
    actorId: v.id("users"), // Who performed the action (could be parent or child)
    actionType: v.string(),
    description: v.string(),
    metadata: v.optional(v.any()),
    createdAt: v.number(),
  }).index("by_user", ["userId"]),

  achievements: defineTable({
    name: v.object({
      en: v.string(),
      es: v.string(),
    }),
    description: v.object({
      en: v.string(),
      es: v.string(),
    }),
    icon: v.string(),
    category: v.union(
      v.literal("saving"),
      v.literal("learning"),
      v.literal("missions"),
      v.literal("social"),
      v.literal("milestone")
    ),
    requirement: v.any(), // Flexible requirements
    rewardCoins: v.number(),
    isActive: v.boolean(),
  })
    .index("by_category", ["category"])
    .index("by_active", ["isActive"]),

  userAchievements: defineTable({
    userId: v.id("users"),
    achievementId: v.id("achievements"),
    unlockedAt: v.number(),
    progress: v.number(), // 0-100
  })
    .index("by_user", ["userId"])
    .index("by_achievement", ["achievementId"]),
});
