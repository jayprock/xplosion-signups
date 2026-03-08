// Core data model types for the sign-up platform.
// These types define the shape of data throughout the app,
// whether backed by mock data or a real database.

export type Team = {
  id: string;
  name: string;
  slug: string;
  coachLastName: string;
  seasonYear: number;
};

export type SignupListCategory = "event-tied" | "standalone";

export type SignupList = {
  id: string;
  teamId: string;
  name: string;
  slug: string;
  category: SignupListCategory;
  /** For event-tied lists: the event details */
  event?: EventInfo;
  /** The fields each signup entry collects */
  fields: FieldDefinition[];
  /** How many slots/entries are needed */
  slotsNeeded: number;
  /** Current entries */
  entries: SignupEntry[];
};

export type EventInfo = {
  date: string; // ISO date string
  time?: string; // e.g. "6:00 PM"
  opponent?: string;
  location?: string;
  isHome: boolean;
};

export type FieldDefinition = {
  key: string;
  label: string;
  type: "text" | "textarea";
  required: boolean;
};

export type SignupEntry = {
  id: string;
  slotIndex: number;
  values: Record<string, string>;
  signedUpAt: string; // ISO datetime
};

// Status model for the dashboard

export type UrgencyLevel =
  | "urgent" // current week, unfilled
  | "high" // 2 weeks out, unfilled
  | "warning" // 3 weeks out, unfilled
  | "info" // 3+ weeks out, unfilled
  | "complete"; // all filled

export type ListStatus = {
  level: UrgencyLevel;
  filled: number;
  total: number;
};
