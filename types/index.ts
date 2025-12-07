import { Doc, Id } from "./_generated/dataModel";

// ============================================
// USER TYPES
// ============================================

export type User = Doc<"users">;
export type ParentUser = User & { role: "parent" };
export type ChildUser = User & { role: "child"; parentId: Id<"users"> };

export type UserRole = "parent" | "child";

// ============================================
// WALLET & TRANSACTION TYPES
// ============================================

export type Wallet = Doc<"wallets">;

export type TransactionType =
  | "deposit"
  | "withdrawal"
  | "transfer_to_savings"
  | "transfer_to_investment"
  | "mission_reward"
  | "purchase"
  | "allowance"
  | "marketplace_sale"
  | "marketplace_purchase";

export type TransactionStatus = "pending" | "approved" | "rejected" | "completed";

export type CurrencyType = "real" | "virtual";

export type Transaction = Doc<"transactions">;

// ============================================
// MISSION TYPES
// ============================================

export type MissionType =
  | "save_money"
  | "learn_video"
  | "make_decision"
  | "predict_investment"
  | "complete_task"
  | "streak"
  | "quiz";

export type MissionDifficulty = "easy" | "medium" | "hard";

export type MissionStatus = "active" | "completed" | "failed" | "expired";

export type Mission = Doc<"missions">;
export type UserMission = Doc<"userMissions">;

// ============================================
// LEARNING TYPES
// ============================================

export type LearningContentType = "video" | "article" | "story" | "tip";

export type LearningContent = Doc<"learningContent">;
export type UserLearningProgress = Doc<"userLearningProgress">;

// ============================================
// AVATAR & SHOP TYPES
// ============================================

export type Avatar = Doc<"avatars">;

export type ShopItemCategory = "hair" | "outfit" | "accessory" | "background" | "badge";

export type ItemRarity = "common" | "rare" | "epic" | "legendary";

export type ShopItem = Doc<"shopItems">;
export type UserInventory = Doc<"userInventory">;

// ============================================
// MARKETPLACE TYPES
// ============================================

export type MarketplaceListingStatus = "active" | "sold" | "cancelled";

export type MarketplaceListing = Doc<"marketplaceListing">;

// ============================================
// PARENTAL CONTROL TYPES
// ============================================

export type ApprovalActionType =
  | "transaction"
  | "marketplace_purchase"
  | "friend_request"
  | "large_purchase";

export type ApprovalStatus = "pending" | "approved" | "rejected";

export type ParentalApproval = Doc<"parentalApprovals">;

export type AllowanceFrequency = "daily" | "weekly" | "biweekly" | "monthly";

export type Allowance = Doc<"allowances">;

// ============================================
// SOCIAL TYPES
// ============================================

export type FriendshipStatus = "pending" | "approved" | "blocked";

export type Friendship = Doc<"friendships">;

// ============================================
// ACTIVITY & ACHIEVEMENT TYPES
// ============================================

export type ActivityLog = Doc<"activityLog">;

export type AchievementCategory = "saving" | "learning" | "missions" | "social" | "milestone";

export type Achievement = Doc<"achievements">;
export type UserAchievement = Doc<"userAchievements">;

// ============================================
// LOCALIZED STRING TYPE
// ============================================

export interface LocalizedString {
  en: string;
  es: string;
}

// ============================================
// DASHBOARD DATA TYPES
// ============================================

export interface DashboardData {
  user: User;
  wallet: Wallet;
  activeMissions: UserMission[];
  recentTransactions: Transaction[];
  achievements: UserAchievement[];
  friends: User[];
}

export interface ParentDashboardData {
  parent: ParentUser;
  children: ChildUser[];
  pendingApprovals: ParentalApproval[];
  recentActivity: ActivityLog[];
  allowances: Allowance[];
}
