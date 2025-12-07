# 🎯 Money n Play - Technical Architecture Document

## 📋 Table of Contents
1. [Project Overview](#project-overview)
2. [Data Architecture](#data-architecture)
3. [Feature Implementation Guide](#feature-implementation-guide)
4. [Security & Safety](#security--safety)
5. [Development Roadmap](#development-roadmap)

---

## Project Overview

**Money n Play** is a kid-friendly financial education app where:
- Parents add **real money** (non-withdrawable)
- Kids learn through **gamification**, **missions**, and **decisions**
- Kids earn **virtual coins** to spend on avatars and items
- All real-money actions require **parent approval**
- **Safe social features** with parental oversight

---

## Data Architecture

### ✅ Completed: Core Database Schema

The foundation is built! We have 18 interconnected tables:

#### **Users & Accounts**
- `users` - Parent and child accounts
- `avatars` - Customizable character profiles

#### **Financial System**
- `wallets` - Dual balance (real money + virtual coins)
- `transactions` - All money movements with approval flow
- `allowances` - Recurring deposits from parents

#### **Learning & Missions**
- `missions` - Financial challenges and tasks
- `userMissions` - Progress tracking
- `learningContent` - Videos, articles, stories, tips
- `userLearningProgress` - Completion tracking

#### **Gamification**
- `shopItems` - Avatar items, accessories, badges
- `userInventory` - Items owned by users
- `achievements` - Milestones and rewards
- `userAchievements` - Unlocked achievements

#### **Social & Marketplace**
- `marketplaceListing` - Virtual item trading
- `friendships` - Safe, parent-approved connections

#### **Parental Controls**
- `parentalApprovals` - Action approval queue
- `activityLog` - Complete audit trail

---

## Feature Implementation Guide

### 🎨 **Phase 1: Core UI & Navigation** (Next Step)

**What to build:**
1. **Parent Dashboard**
   - View all children
   - Approve pending actions
   - Add money to child wallets
   - Set up allowances
   - View activity logs

2. **Kid Dashboard**
   - Money zones: Wallet, Savings, Investments, Marketplace
   - Mission board
   - Avatar showcase
   - Progress indicators

3. **Onboarding Flow**
   - Parent signup
   - Add first child
   - Create child's avatar
   - Set initial PIN
   - Tour of features

**Components to create:**
```
/app/[locale]/
  /parent/
    dashboard/page.tsx
    children/page.tsx
    approvals/page.tsx
    settings/page.tsx
  /child/
    dashboard/page.tsx
    missions/page.tsx
    avatar/page.tsx
    shop/page.tsx
    marketplace/page.tsx
  /onboarding/
    parent/page.tsx
    child/page.tsx
```

**Convex functions needed:**
- ✅ `convex/users.ts` - User management (DONE)
- ✅ `convex/wallets.ts` - Wallet operations (DONE)
- ⏳ `convex/missions.ts` - Mission logic
- ⏳ `convex/avatars.ts` - Avatar customization
- ⏳ `convex/shop.ts` - Shop & inventory
- ⏳ `convex/approvals.ts` - Approval workflows

---

### 🎮 **Phase 2: Missions System**

**Mission Types to Implement:**

1. **Save Money** - "Save $5 this week"
2. **Watch Learning Video** - Educational content
3. **Make Decisions** - Needs vs Wants quiz
4. **Predict Investment** - Guess stock market outcome
5. **Complete Task** - Parent-assigned chores
6. **Daily Streak** - Login consistency
7. **Quiz** - Financial literacy questions

**Workflow:**
```
1. Kid sees available missions
2. Kid accepts a mission
3. System tracks progress automatically
4. On completion, virtual coins are awarded
5. Badge/achievement unlocked (if applicable)
```

**Sample Mission Data:**
```typescript
{
  title: { en: "Save $5 This Week", es: "Ahorra $5 Esta Semana" },
  type: "save_money",
  targetValue: 500, // 500 cents = $5
  rewardCoins: 100,
  durationDays: 7,
  difficulty: "easy",
  ageRange: { min: 6, max: 14 }
}
```

---

### 💰 **Phase 3: Wallet & Money Flows**

**Real Money Rules:**
- Only parents can add real money
- Kids CANNOT withdraw real money
- Real money can be:
  - Kept in wallet
  - Moved to savings (earns interest simulation)
  - Moved to investments (market simulation)
- All movements are logged

**Virtual Coins:**
- Earned through:
  - Completing missions
  - Watching learning content
  - Good financial decisions
  - Achievements
- Spent on:
  - Avatar items
  - Accessories
  - Marketplace purchases

**Approval Flow:**
```
Kid initiates action → Transaction created (status: pending)
→ Parent receives notification → Parent approves/rejects
→ Transaction executes or cancels
```

---

### 🎭 **Phase 4: Avatar System**

**Avatar Components:**
- Skin tone (5 options)
- Hair style (10+ options)
- Hair color (8 colors)
- Outfit (20+ options)
- Accessories (hats, glasses, badges)
- Background themes

**Shop System:**
- Items categorized by type
- Rarity levels: Common, Rare, Epic, Legendary
- Price in virtual coins
- Preview before purchase
- Inventory management

**Sample Items:**
```typescript
{
  name: { en: "Cool Sunglasses", es: "Gafas de Sol" },
  category: "accessory",
  priceCoins: 50,
  rarity: "rare",
  imageUrl: "/items/sunglasses-01.svg"
}
```

---

### 🏪 **Phase 5: Marketplace**

**Features:**
- Kids can list inventory items for sale
- Set price in virtual coins
- Only friends can see listings
- Parent must approve large purchases
- Safe, moderated environment

**Workflow:**
```
1. Kid lists item for X coins
2. Friend sees listing
3. Friend clicks "Buy"
4. If price > threshold, parent approval needed
5. On approval, coins transfer, item moves to buyer
6. Seller receives coins
```

---

### 📚 **Phase 6: Learning Content**

**Content Types:**

1. **Videos** (2-5 minutes)
   - "What is Saving?"
   - "Needs vs Wants"
   - "How Banks Work"
   - "Starting a Business"

2. **Stories** (Age-appropriate scenarios)
   - "Emma's Lemonade Stand"
   - "The Broken Toy Decision"
   - "Saving for a Dream"

3. **Tips** (Quick advice)
   - "Save 10% of everything you get"
   - "Compare prices before buying"
   - "Set goals for big purchases"

4. **Interactive Quizzes**
   - Multiple choice
   - Scenario-based decisions
   - Instant feedback

**Adaptive Learning:**
- Track what content kids view
- Recommend based on age and progress
- Adjust difficulty over time

---

### 👨‍👩‍👧‍👦 **Phase 7: Parental Controls**

**Parent Dashboard Features:**

1. **Children Overview**
   - List of all children
   - Balance summary (real + virtual)
   - Recent activity
   - Active missions

2. **Approval Center**
   - Pending transactions
   - Marketplace purchases
   - Friend requests
   - Quick approve/reject

3. **Allowance Manager**
   - Set recurring deposits
   - Frequency: Daily, Weekly, Biweekly, Monthly
   - Auto-deposit with notifications

4. **Activity Log**
   - Complete audit trail
   - Filter by child, action type, date
   - Export reports

5. **Settings**
   - Set spending limits
   - Configure approval thresholds
   - Manage notifications
   - Child account management

---

### 🛡️ **Phase 8: Security & Safety**

**Implemented Safeguards:**

1. **COPPA Compliance**
   - No personal data collection from kids under 13
   - Parent verification required
   - Data minimization

2. **Authentication**
   - Parent: Email + password
   - Child: PIN (4-6 digits)
   - Session management

3. **Social Safety**
   - Friend requests require parent approval
   - No direct messaging (future: parent-monitored)
   - Marketplace limited to approved friends
   - Report/block features

4. **Financial Safety**
   - Real money never withdrawable
   - All real-money actions logged
   - Parent approval for large actions
   - Transaction limits

5. **Data Privacy**
   - Encrypted data at rest
   - Secure API calls
   - No third-party sharing
   - Parent can export/delete data

---

## 🎨 Design System

### **Theme**
- Primary color: Fun purple (#8B5CF6)
- Secondary: Bright yellow (#FCD34D)
- Success: Green (#10B981)
- Danger: Red (#EF4444)
- Dark mode: Deep purple backgrounds
- Light mode: Soft pastels

### **Typography**
- Headlines: Bold, playful
- Body: Clear, readable (16px minimum)
- Kid-friendly language throughout

### **Mascot: "Cash" (Happy Money Character)**
```
Personality: Friendly, encouraging, wise
Expressions: Happy, surprised, thinking, celebrating
Appears: 
  - Welcome screens
  - Mission completion
  - Learning moments
  - Achievements
```

### **Animations**
- Coin earning: Sparkle + bounce
- Mission complete: Confetti
- Level up: Celebration
- Money transfer: Smooth transition
- Avatar change: Spin transition

---

## 🚀 Development Roadmap

### **Sprint 1: Foundation** ✅ (COMPLETED)
- [x] Project setup
- [x] Database schema
- [x] Type definitions
- [x] User management functions
- [x] Wallet management functions

### **Sprint 2: Core UI** (CURRENT)
- [ ] Parent dashboard
- [ ] Kid dashboard
- [ ] Onboarding flow
- [ ] Navigation & layout
- [ ] Theme integration

### **Sprint 3: Financial Features**
- [ ] Deposit flow
- [ ] Transfer to savings
- [ ] Allowance scheduler
- [ ] Transaction history
- [ ] Approval workflows

### **Sprint 4: Missions & Learning**
- [ ] Mission board
- [ ] Mission tracking
- [ ] Learning content viewer
- [ ] Progress indicators
- [ ] Rewards system

### **Sprint 5: Gamification**
- [ ] Avatar creator
- [ ] Shop system
- [ ] Inventory management
- [ ] Achievements
- [ ] Badges

### **Sprint 6: Social Features**
- [ ] Friendship system
- [ ] Marketplace
- [ ] Safe interactions
- [ ] Parent approvals

### **Sprint 7: Polish & Launch**
- [ ] Animations
- [ ] Sound effects
- [ ] Onboarding tutorial
- [ ] Help & support
- [ ] Analytics
- [ ] Testing
- [ ] Deployment

---

## 🛠️ How to Proceed

### **Immediate Next Steps:**

1. **Run Convex Dev Server**
   ```bash
   npx convex dev
   ```

2. **Test Schema**
   ```bash
   # Check Convex dashboard
   # Verify all tables created
   ```

3. **Build Parent Onboarding**
   - Create signup flow
   - Add child creation form
   - Test user creation

4. **Build Basic Dashboards**
   - Parent view with child list
   - Kid view with balance display

5. **Implement First Mission**
   - Create mission data
   - Build UI to display missions
   - Test completion flow

---

## 📞 Questions to Consider

As we build, we should discuss:

1. **Payment Integration**: Which payment provider? (Stripe, PayPal?)
2. **Age Verification**: How to verify parents?
3. **Investment Simulation**: Real stock data or simplified?
4. **Content Moderation**: Manual review or automated?
5. **Notifications**: Push, email, or in-app only?
6. **Multi-currency**: Start with USD only?
7. **Mascot Design**: Commission illustrator or use stock?

---

## 💡 Pro Tips

- **Keep it simple**: Kids should understand everything instantly
- **Celebrate wins**: Positive reinforcement everywhere
- **Make it fun**: Animations, sounds, playful copy
- **Safety first**: When in doubt, add parent approval
- **Test with kids**: Real user feedback is invaluable
- **Localize everything**: All text in messages/ folder
- **Log everything**: Activity log for transparency

---

**You're now ready to build Money n Play! Let me know which feature you want to tackle first, and I'll provide complete code, components, and guidance.** 🚀
