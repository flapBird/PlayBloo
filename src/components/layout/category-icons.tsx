import {
  Brain,
  Car,
  CircleHelp,
  Cog,
  Compass,
  Crosshair,
  Dices,
  Flag,
  Gamepad2,
  Ghost,
  GraduationCap,
  Hourglass,
  MousePointerClick,
  Music,
  PersonStanding,
  Puzzle,
  Shapes,
  Shield,
  Smile,
  Spade,
  Swords,
  Tent,
  Trophy,
  Users,
  Zap,
  type LucideIcon,
} from "lucide-react";

/**
 * Decorative icon per category slug. Unknown or future slugs fall back to
 * Shapes, so adding a new category never requires touching this map.
 */
const CATEGORY_ICONS: Record<string, LucideIcon> = {
  action: Zap,
  adventure: Compass,
  arcade: Gamepad2,
  "board-game": Dices,
  card: Spade,
  casual: Smile,
  clicker: MousePointerClick,
  driving: Car,
  educational: GraduationCap,
  fighting: Swords,
  horror: Ghost,
  idle: Hourglass,
  multiplayer: Users,
  music: Music,
  platformer: PersonStanding,
  puzzle: Puzzle,
  racing: Flag,
  rpg: Shield,
  shooting: Crosshair,
  simulation: Cog,
  sports: Trophy,
  strategy: Brain,
  survival: Tent,
  trivia: CircleHelp,
};

export function getCategoryIcon(slug: string): LucideIcon {
  return CATEGORY_ICONS[slug] || Shapes;
}

export function CategoryIcon({ slug, className }: { slug: string; className?: string }) {
  const Icon = getCategoryIcon(slug);
  return <Icon className={className} aria-hidden="true" />;
}
