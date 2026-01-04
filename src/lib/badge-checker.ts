import { UserGamification, BadgeDefinition, PointTransaction } from "@/models/gamificationModel";
import { BADGE_DEFINITIONS } from "./badge-definitions";

/**
 * Check and award badges based on user's current stats
 * Returns array of newly earned badges
 */
export async function checkAndAwardBadges(
  userId: string,
  triggerType: "lecture" | "quiz" | "quiz_perfect" | "course" | "level" | "streak"
) {
  try {
    const profile = await UserGamification.findOne({ user: userId });
    if (!profile) return [];

    const newBadges: any[] = [];

    // Get all badge definitions that match the trigger type
    const relevantBadges = BADGE_DEFINITIONS.filter((badge) => {
      const criteria = badge.criteria;
      
      switch (triggerType) {
        case "lecture":
          return criteria.type === "lectures_completed";
        case "quiz":
          return criteria.type === "quizzes_passed";
        case "quiz_perfect":
          return criteria.type === "perfect_quizzes";
        case "course":
          return criteria.type === "courses_completed";
        case "level":
          return criteria.type === "level";
        case "streak":
          return criteria.type === "streak";
        default:
          return false;
      }
    });

    // Check each badge's criteria
    for (const badgeDef of relevantBadges) {
      // Check if user already has this badge
      const hasBadge = profile.badges.some((b) => b.badgeId === badgeDef.badgeId);
      if (hasBadge) continue;

      // Check if criteria is met
      let criteriaMet = false;
      const criteria = badgeDef.criteria;

      switch (criteria.type) {
        case "lectures_completed":
          criteriaMet = (profile.totalLecturesCompleted || 0) >= criteria.count;
          break;
        case "quizzes_passed":
          criteriaMet = (profile.totalQuizzesPassed || 0) >= criteria.count;
          break;
        case "perfect_quizzes":
          // We'll need to track this separately - for now, estimate
          criteriaMet = false; // TODO: Add perfect quiz counter
          break;
        case "courses_completed":
          criteriaMet = (profile.totalCoursesCompleted || 0) >= criteria.count;
          break;
        case "level":
          criteriaMet = profile.level >= criteria.count;
          break;
        case "streak":
          criteriaMet = profile.currentStreak >= criteria.count;
          break;
      }

      // Award badge if criteria met
      if (criteriaMet) {
        // Add badge to profile
        profile.badges.push({
          badgeId: badgeDef.badgeId,
          earnedAt: new Date(),
          progress: 100,
        });

        // Award bonus points
        if (badgeDef.points > 0) {
          profile.totalPoints += badgeDef.points;
          profile.currentLevelPoints += badgeDef.points;

          // Check for level up from badge points
          while (profile.currentLevelPoints >= profile.pointsToNextLevel) {
            profile.currentLevelPoints -= profile.pointsToNextLevel;
            profile.level += 1;
            profile.pointsToNextLevel = Math.floor(profile.pointsToNextLevel * 1.5);
          }

          // Create transaction record
          await PointTransaction.create({
            user: userId,
            points: badgeDef.points,
            type: "milestone_reached",
            description: `Earned badge: ${badgeDef.name}`,
          });
        }

        // Store badge definition in database if it doesn't exist
        const existingBadge = await BadgeDefinition.findOne({ badgeId: badgeDef.badgeId });
        if (!existingBadge) {
          await BadgeDefinition.create({
            ...badgeDef,
            criteria: JSON.stringify(badgeDef.criteria),
          });
        }

        newBadges.push(badgeDef);
      }
    }

    // Save profile if badges were awarded
    if (newBadges.length > 0) {
      await profile.save();
    }

    return newBadges;
  } catch (error) {
    console.error("Error checking badges:", error);
    return [];
  }
}

/**
 * Initialize all badge definitions in database
 * Call this once to seed the badges
 */
export async function initializeBadgeDefinitions() {
  try {
    for (const badge of BADGE_DEFINITIONS) {
      const exists = await BadgeDefinition.findOne({ badgeId: badge.badgeId });
      if (!exists) {
        await BadgeDefinition.create({
          ...badge,
          criteria: JSON.stringify(badge.criteria),
        });
        console.log(`✓ Created badge: ${badge.name}`);
      }
    }
    console.log("Badge definitions initialized successfully");
  } catch (error) {
    console.error("Error initializing badges:", error);
  }
}

/**
 * Check for special time-based badges
 */
export async function checkTimeBasedBadges(userId: string, hour: number) {
  try {
    const profile = await UserGamification.findOne({ user: userId });
    if (!profile) return [];

    const newBadges: any[] = [];

    // Early bird badge (before 8 AM)
    if (hour < 8) {
      const earlyBirdBadge = BADGE_DEFINITIONS.find(b => b.badgeId === "early_bird");
      const hasBadge = profile.badges.some(b => b.badgeId === "early_bird");
      
      if (!hasBadge && earlyBirdBadge) {
        // For now, just award it after first early morning lecture
        // In production, you'd track count
        profile.badges.push({
          badgeId: "early_bird",
          earnedAt: new Date(),
          progress: 100,
        });
        
        profile.totalPoints += earlyBirdBadge.points;
        profile.currentLevelPoints += earlyBirdBadge.points;
        
        await PointTransaction.create({
          user: userId,
          points: earlyBirdBadge.points,
          type: "milestone_reached",
          description: `Earned badge: ${earlyBirdBadge.name}`,
        });
        
        newBadges.push(earlyBirdBadge);
      }
    }

    // Night owl badge (after 10 PM)
    if (hour >= 22) {
      const nightOwlBadge = BADGE_DEFINITIONS.find(b => b.badgeId === "night_owl");
      const hasBadge = profile.badges.some(b => b.badgeId === "night_owl");
      
      if (!hasBadge && nightOwlBadge) {
        profile.badges.push({
          badgeId: "night_owl",
          earnedAt: new Date(),
          progress: 100,
        });
        
        profile.totalPoints += nightOwlBadge.points;
        profile.currentLevelPoints += nightOwlBadge.points;
        
        await PointTransaction.create({
          user: userId,
          points: nightOwlBadge.points,
          type: "milestone_reached",
          description: `Earned badge: ${nightOwlBadge.name}`,
        });
        
        newBadges.push(nightOwlBadge);
      }
    }

    if (newBadges.length > 0) {
      await profile.save();
    }

    return newBadges;
  } catch (error) {
    console.error("Error checking time-based badges:", error);
    return [];
  }
}
