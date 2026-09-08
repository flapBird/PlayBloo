// Compatibility re-export for older imports. New code should use user-library.
export {
  addPlayRecord,
  clearHistory,
  getRecentPlays,
  removePlayRecord,
} from "@/lib/user-library";
export type { RecentPlayRecord as PlayHistoryItem } from "@/lib/user-library";
