import type { Team, SignupList, FieldDefinition } from "@/lib/types";

// Helper to compute dates relative to today
function daysFromNow(days: number): string {
  const d = new Date();
  d.setDate(d.getDate() + days);
  return d.toISOString().split("T")[0];
}

// --- Field definitions for reuse ---

const volunteerFields: FieldDefinition[] = [
  { key: "name", label: "Your Name", type: "text", required: true },
];

const walkupSongFields: FieldDefinition[] = [
  { key: "playerName", label: "Player Name", type: "text", required: true },
  { key: "artistName", label: "Artist Name", type: "text", required: true },
  { key: "songName", label: "Song Name", type: "text", required: true },
  {
    key: "startAt",
    label: "Where to Start the Song",
    type: "text",
    required: false,
  },
];

// --- Teams ---

export const teams: Team[] = [
  {
    id: "team-1",
    name: "12U Xplosion",
    slug: "xplosion-12u",
    coachLastName: "Smith",
    seasonYear: 2026,
  },
];

// --- Sign-up Lists ---

export const signupLists: SignupList[] = [
  // EVENT-TIED: Game 1 - this week (urgent if unfilled)
  {
    id: "list-fp-1",
    teamId: "team-1",
    name: "Field Prep",
    slug: "field-prep-game-1",
    category: "event-tied",
    event: {
      date: daysFromNow(2),
      time: "6:00 PM",
      opponent: "Thunder",
      location: "Riverside Field #3",
      isHome: true,
    },
    fields: volunteerFields,
    slotsNeeded: 2,
    entries: [
      {
        id: "e1",
        slotIndex: 0,
        values: { name: "Mike Johnson" },
        signedUpAt: new Date().toISOString(),
      },
    ],
  },
  {
    id: "list-fs-1",
    teamId: "team-1",
    name: "Field Shutdown",
    slug: "field-shutdown-game-1",
    category: "event-tied",
    event: {
      date: daysFromNow(2),
      time: "6:00 PM",
      opponent: "Thunder",
      location: "Riverside Field #3",
      isHome: true,
    },
    fields: volunteerFields,
    slotsNeeded: 2,
    entries: [],
  },
  {
    id: "list-sn-1",
    teamId: "team-1",
    name: "Snacks",
    slug: "snacks-game-1",
    category: "event-tied",
    event: {
      date: daysFromNow(2),
      time: "6:00 PM",
      opponent: "Thunder",
      location: "Riverside Field #3",
      isHome: true,
    },
    fields: volunteerFields,
    slotsNeeded: 1,
    entries: [
      {
        id: "e2",
        slotIndex: 0,
        values: { name: "Sarah Davis" },
        signedUpAt: new Date().toISOString(),
      },
    ],
  },
  {
    id: "list-mow-1",
    teamId: "team-1",
    name: "Mowing",
    slug: "mowing-game-1",
    category: "event-tied",
    event: {
      date: daysFromNow(2),
      time: "6:00 PM",
      opponent: "Thunder",
      location: "Riverside Field #3",
      isHome: true,
    },
    fields: volunteerFields,
    slotsNeeded: 1,
    entries: [],
  },

  // EVENT-TIED: Game 2 - ~10 days out (high priority if unfilled)
  {
    id: "list-fp-2",
    teamId: "team-1",
    name: "Field Prep",
    slug: "field-prep-game-2",
    category: "event-tied",
    event: {
      date: daysFromNow(10),
      time: "1:00 PM",
      opponent: "Vipers",
      location: "Oak Park Diamond",
      isHome: false,
    },
    fields: volunteerFields,
    slotsNeeded: 2,
    entries: [],
  },
  {
    id: "list-fs-2",
    teamId: "team-1",
    name: "Field Shutdown",
    slug: "field-shutdown-game-2",
    category: "event-tied",
    event: {
      date: daysFromNow(10),
      time: "1:00 PM",
      opponent: "Vipers",
      location: "Oak Park Diamond",
      isHome: false,
    },
    fields: volunteerFields,
    slotsNeeded: 2,
    entries: [
      {
        id: "e3",
        slotIndex: 0,
        values: { name: "Tom Williams" },
        signedUpAt: new Date().toISOString(),
      },
      {
        id: "e4",
        slotIndex: 1,
        values: { name: "Lisa Chen" },
        signedUpAt: new Date().toISOString(),
      },
    ],
  },
  {
    id: "list-sn-2",
    teamId: "team-1",
    name: "Snacks",
    slug: "snacks-game-2",
    category: "event-tied",
    event: {
      date: daysFromNow(10),
      time: "1:00 PM",
      opponent: "Vipers",
      location: "Oak Park Diamond",
      isHome: false,
    },
    fields: volunteerFields,
    slotsNeeded: 1,
    entries: [],
  },

  // EVENT-TIED: Game 3 - ~18 days out (warning if unfilled)
  {
    id: "list-fp-3",
    teamId: "team-1",
    name: "Field Prep",
    slug: "field-prep-game-3",
    category: "event-tied",
    event: {
      date: daysFromNow(18),
      time: "10:00 AM",
      opponent: "Hurricanes",
      location: "Riverside Field #3",
      isHome: true,
    },
    fields: volunteerFields,
    slotsNeeded: 2,
    entries: [
      {
        id: "e5",
        slotIndex: 0,
        values: { name: "Dan Martinez" },
        signedUpAt: new Date().toISOString(),
      },
    ],
  },
  {
    id: "list-fs-3",
    teamId: "team-1",
    name: "Field Shutdown",
    slug: "field-shutdown-game-3",
    category: "event-tied",
    event: {
      date: daysFromNow(18),
      time: "10:00 AM",
      opponent: "Hurricanes",
      location: "Riverside Field #3",
      isHome: true,
    },
    fields: volunteerFields,
    slotsNeeded: 2,
    entries: [
      {
        id: "e6",
        slotIndex: 0,
        values: { name: "Amy Rodriguez" },
        signedUpAt: new Date().toISOString(),
      },
      {
        id: "e7",
        slotIndex: 1,
        values: { name: "Chris Taylor" },
        signedUpAt: new Date().toISOString(),
      },
    ],
  },

  // EVENT-TIED: Game 4 - ~25 days out (informational)
  {
    id: "list-fp-4",
    teamId: "team-1",
    name: "Field Prep",
    slug: "field-prep-game-4",
    category: "event-tied",
    event: {
      date: daysFromNow(25),
      time: "3:00 PM",
      opponent: "Wildcats",
      location: "Central Sports Complex",
      isHome: true,
    },
    fields: volunteerFields,
    slotsNeeded: 2,
    entries: [],
  },
  {
    id: "list-sn-4",
    teamId: "team-1",
    name: "Snacks",
    slug: "snacks-game-4",
    category: "event-tied",
    event: {
      date: daysFromNow(25),
      time: "3:00 PM",
      opponent: "Wildcats",
      location: "Central Sports Complex",
      isHome: true,
    },
    fields: volunteerFields,
    slotsNeeded: 1,
    entries: [
      {
        id: "e8",
        slotIndex: 0,
        values: { name: "Jenny Park" },
        signedUpAt: new Date().toISOString(),
      },
    ],
  },

  // STANDALONE: Walk-Up Songs (base)
  {
    id: "list-walkup-base",
    teamId: "team-1",
    name: "Walk-Up Songs",
    slug: "walkup-songs",
    category: "standalone",
    fields: walkupSongFields,
    slotsNeeded: 12,
    entries: [
      {
        id: "w1",
        slotIndex: 0,
        values: {
          playerName: "Jake Smith",
          artistName: "Imagine Dragons",
          songName: "Thunder",
          startAt: "0:30",
        },
        signedUpAt: new Date().toISOString(),
      },
      {
        id: "w2",
        slotIndex: 1,
        values: {
          playerName: "Ethan Johnson",
          artistName: "AC/DC",
          songName: "Thunderstruck",
          startAt: "0:05",
        },
        signedUpAt: new Date().toISOString(),
      },
      {
        id: "w3",
        slotIndex: 2,
        values: {
          playerName: "Ryan Davis",
          artistName: "Kernkraft 400",
          songName: "Zombie Nation",
          startAt: "0:00",
        },
        signedUpAt: new Date().toISOString(),
      },
      {
        id: "w4",
        slotIndex: 3,
        values: {
          playerName: "Noah Williams",
          artistName: "Queen",
          songName: "We Will Rock You",
          startAt: "0:00",
        },
        signedUpAt: new Date().toISOString(),
      },
      {
        id: "w5",
        slotIndex: 4,
        values: {
          playerName: "Liam Martinez",
          artistName: "",
          songName: "",
          startAt: "",
        },
        signedUpAt: new Date().toISOString(),
      },
      {
        id: "w6",
        slotIndex: 5,
        values: {
          playerName: "Aiden Chen",
          artistName: "",
          songName: "",
          startAt: "",
        },
        signedUpAt: new Date().toISOString(),
      },
      {
        id: "w7",
        slotIndex: 6,
        values: {
          playerName: "Mason Taylor",
          artistName: "Jock Jams",
          songName: "Get Ready for This",
          startAt: "0:15",
        },
        signedUpAt: new Date().toISOString(),
      },
      {
        id: "w8",
        slotIndex: 7,
        values: {
          playerName: "Logan Rodriguez",
          artistName: "",
          songName: "",
          startAt: "",
        },
        signedUpAt: new Date().toISOString(),
      },
      {
        id: "w9",
        slotIndex: 8,
        values: {
          playerName: "Carter Park",
          artistName: "Guns N' Roses",
          songName: "Welcome to the Jungle",
          startAt: "0:00",
        },
        signedUpAt: new Date().toISOString(),
      },
      {
        id: "w10",
        slotIndex: 9,
        values: {
          playerName: "Owen Brown",
          artistName: "",
          songName: "",
          startAt: "",
        },
        signedUpAt: new Date().toISOString(),
      },
      {
        id: "w11",
        slotIndex: 10,
        values: {
          playerName: "Jackson Lee",
          artistName: "Eminem",
          songName: "Lose Yourself",
          startAt: "0:10",
        },
        signedUpAt: new Date().toISOString(),
      },
      {
        id: "w12",
        slotIndex: 11,
        values: {
          playerName: "Luke Anderson",
          artistName: "",
          songName: "",
          startAt: "",
        },
        signedUpAt: new Date().toISOString(),
      },
    ],
  },

  // STANDALONE: Walk-Up Songs (Halloween Special)
  {
    id: "list-walkup-halloween",
    teamId: "team-1",
    name: "Halloween Walk-Up Songs",
    slug: "walkup-songs-halloween",
    category: "standalone",
    fields: walkupSongFields,
    slotsNeeded: 12,
    entries: [
      {
        id: "h1",
        slotIndex: 0,
        values: {
          playerName: "Jake Smith",
          artistName: "Michael Jackson",
          songName: "Thriller",
          startAt: "0:00",
        },
        signedUpAt: new Date().toISOString(),
      },
      {
        id: "h2",
        slotIndex: 1,
        values: {
          playerName: "Ethan Johnson",
          artistName: "Ray Parker Jr.",
          songName: "Ghostbusters",
          startAt: "0:00",
        },
        signedUpAt: new Date().toISOString(),
      },
    ],
  },
];
