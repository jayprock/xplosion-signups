import type { SignupListCategory, FieldDefinition } from "@/lib/types";

export type ListTemplate = {
  id: string;
  name: string;
  description: string;
  category: SignupListCategory;
  fields: FieldDefinition[];
  slotsNeeded: number;
  note?: string;
};

export type ListTemplateData = {
  name: string;
  category: SignupListCategory;
  fields: FieldDefinition[];
  slotsNeeded: number;
  note?: string;
};

export const LIST_TEMPLATES: ListTemplate[] = [
  {
    id: "walk-up-songs",
    name: "Walk-Up Songs",
    description:
      "Players pick their at-bat entrance music — artist, song, and start time",
    category: "standalone",
    fields: [
      { key: "playerName", label: "Player Name", type: "text", required: true },
      {
        key: "artistName",
        label: "Artist Name",
        type: "text",
        required: true,
      },
      { key: "songName", label: "Song Name", type: "text", required: true },
      {
        key: "startAt",
        label: "Start At (e.g., 1:15)",
        type: "text",
        required: false,
      },
    ],
    slotsNeeded: 15,
  },
  {
    id: "snack-duty",
    name: "Snack Duty",
    description: "Parents sign up to bring snacks and drinks on game day",
    category: "dated",
    fields: [
      { key: "name", label: "Your Name", type: "text", required: true },
    ],
    slotsNeeded: 2,
    note: "Game day",
  },
];
