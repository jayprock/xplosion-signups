import type { Team, SignupList, FieldDefinition } from "@/lib/types";

// Use globalThis to share mock data across all module instances
// (server actions and server components may load separate copies of this module)
const STORE_KEY = Symbol.for("x-signups-mock-store");

type MockStore = {
  teams: Team[];
  signupLists: SignupList[];
};

function getStore(): MockStore {
  const g = globalThis as unknown as Record<symbol, MockStore>;
  if (!g[STORE_KEY]) {
    g[STORE_KEY] = { teams: buildTeams(), signupLists: buildSignupLists() };
  }
  return g[STORE_KEY];
}

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

function buildTeams(): Team[] {
  return [
    {
      id: "team-1",
      name: "12U Xplosion",
      slug: "xplosion-12u",
      coachLastName: "Smith",
      seasonYear: 2026,
      adminPassword: "xplosion",
    },
  ];
}

// --- Dates for recurring mowing (weekly) ---

const mowDate1 = daysFromNow(2);
const mowDate2 = daysFromNow(9);
const mowDate3 = daysFromNow(16);
const mowDate4 = daysFromNow(23);
const mowDate5 = daysFromNow(30);
const mowDate6 = daysFromNow(37);

// --- Dates for other duties ---

const dutyDate1 = daysFromNow(2); // same day as first mowing (busy day)
const dutyDate2 = daysFromNow(12);
const dutyDate3 = daysFromNow(19);
const dutyDate4 = daysFromNow(26);

// --- Sign-up Lists ---

function buildSignupLists(): SignupList[] {
  return [
  // ============================================================
  // MOWING — weekly recurring, 1 volunteer needed
  // ============================================================
  {
    id: "mow-1",
    teamId: "team-1",
    name: "Mowing",
    slug: `mowing-${mowDate1}`,
    category: "dated",
    date: mowDate1,
    time: "4:00 PM",
    location: "Riverside Field #3",
    fields: volunteerFields,
    slotsNeeded: 1,
    entries: [],
  },
  {
    id: "mow-2",
    teamId: "team-1",
    name: "Mowing",
    slug: `mowing-${mowDate2}`,
    category: "dated",
    date: mowDate2,
    time: "4:00 PM",
    location: "Riverside Field #3",
    fields: volunteerFields,
    slotsNeeded: 1,
    entries: [
      {
        id: "mow-2-e1",
        slotIndex: 0,
        values: { name: "Tom Williams" },
        signedUpAt: new Date().toISOString(),
      },
    ],
  },
  {
    id: "mow-3",
    teamId: "team-1",
    name: "Mowing",
    slug: `mowing-${mowDate3}`,
    category: "dated",
    date: mowDate3,
    time: "4:00 PM",
    location: "Riverside Field #3",
    fields: volunteerFields,
    slotsNeeded: 1,
    entries: [],
  },
  {
    id: "mow-4",
    teamId: "team-1",
    name: "Mowing",
    slug: `mowing-${mowDate4}`,
    category: "dated",
    date: mowDate4,
    time: "4:00 PM",
    location: "Riverside Field #3",
    fields: volunteerFields,
    slotsNeeded: 1,
    entries: [],
  },
  {
    id: "mow-5",
    teamId: "team-1",
    name: "Mowing",
    slug: `mowing-${mowDate5}`,
    category: "dated",
    date: mowDate5,
    time: "4:00 PM",
    location: "Riverside Field #3",
    fields: volunteerFields,
    slotsNeeded: 1,
    entries: [
      {
        id: "mow-5-e1",
        slotIndex: 0,
        values: { name: "Dan Martinez" },
        signedUpAt: new Date().toISOString(),
      },
    ],
  },
  {
    id: "mow-6",
    teamId: "team-1",
    name: "Mowing",
    slug: `mowing-${mowDate6}`,
    category: "dated",
    date: mowDate6,
    time: "4:00 PM",
    location: "Riverside Field #3",
    fields: volunteerFields,
    slotsNeeded: 1,
    entries: [],
  },

  // ============================================================
  // FIELD PREP — as needed, 2 volunteers
  // ============================================================
  {
    id: "fp-1",
    teamId: "team-1",
    name: "Field Prep",
    slug: `field-prep-${dutyDate1}`,
    category: "dated",
    date: dutyDate1,
    time: "5:00 PM",
    location: "Riverside Field #3",
    note: "Game vs Thunder",
    fields: volunteerFields,
    slotsNeeded: 2,
    entries: [
      {
        id: "fp-1-e1",
        slotIndex: 0,
        values: { name: "Mike Johnson" },
        signedUpAt: new Date().toISOString(),
      },
    ],
  },
  {
    id: "fp-2",
    teamId: "team-1",
    name: "Field Prep",
    slug: `field-prep-${dutyDate3}`,
    category: "dated",
    date: dutyDate3,
    time: "5:30 PM",
    location: "Riverside Field #3",
    note: "Before practice",
    fields: volunteerFields,
    slotsNeeded: 2,
    entries: [],
  },
  {
    id: "fp-3",
    teamId: "team-1",
    name: "Field Prep",
    slug: `field-prep-${dutyDate4}`,
    category: "dated",
    date: dutyDate4,
    time: "12:00 PM",
    location: "Central Sports Complex",
    note: "Game vs Wildcats",
    fields: volunteerFields,
    slotsNeeded: 2,
    entries: [],
  },

  // ============================================================
  // FIELD SHUTDOWN — as needed, 2 volunteers
  // ============================================================
  {
    id: "fs-1",
    teamId: "team-1",
    name: "Field Shutdown",
    slug: `field-shutdown-${dutyDate1}`,
    category: "dated",
    date: dutyDate1,
    time: "8:30 PM",
    location: "Riverside Field #3",
    note: "After Thunder game",
    fields: volunteerFields,
    slotsNeeded: 2,
    entries: [],
  },
  {
    id: "fs-2",
    teamId: "team-1",
    name: "Field Shutdown",
    slug: `field-shutdown-${dutyDate2}`,
    category: "dated",
    date: dutyDate2,
    time: "8:00 PM",
    location: "Riverside Field #3",
    note: "After Vipers game",
    fields: volunteerFields,
    slotsNeeded: 2,
    entries: [
      {
        id: "fs-2-e1",
        slotIndex: 0,
        values: { name: "Amy Rodriguez" },
        signedUpAt: new Date().toISOString(),
      },
      {
        id: "fs-2-e2",
        slotIndex: 1,
        values: { name: "Chris Taylor" },
        signedUpAt: new Date().toISOString(),
      },
    ],
  },

  // ============================================================
  // SNACK DUTY — as needed, 1 volunteer
  // ============================================================
  {
    id: "sn-1",
    teamId: "team-1",
    name: "Snack Duty",
    slug: `snack-duty-${dutyDate1}`,
    category: "dated",
    date: dutyDate1,
    time: "5:30 PM",
    location: "Riverside Field #3",
    note: "Game vs Thunder",
    fields: volunteerFields,
    slotsNeeded: 1,
    entries: [
      {
        id: "sn-1-e1",
        slotIndex: 0,
        values: { name: "Sarah Davis" },
        signedUpAt: new Date().toISOString(),
      },
    ],
  },
  {
    id: "sn-2",
    teamId: "team-1",
    name: "Snack Duty",
    slug: `snack-duty-${dutyDate2}`,
    category: "dated",
    date: dutyDate2,
    time: "12:30 PM",
    location: "Oak Park Diamond",
    note: "Game vs Vipers",
    fields: volunteerFields,
    slotsNeeded: 1,
    entries: [],
  },
  {
    id: "sn-3",
    teamId: "team-1",
    name: "Snack Duty",
    slug: `snack-duty-${dutyDate4}`,
    category: "dated",
    date: dutyDate4,
    time: "12:00 PM",
    location: "Central Sports Complex",
    note: "Game vs Wildcats",
    fields: volunteerFields,
    slotsNeeded: 1,
    entries: [
      {
        id: "sn-3-e1",
        slotIndex: 0,
        values: { name: "Jenny Park" },
        signedUpAt: new Date().toISOString(),
      },
    ],
  },

  // ============================================================
  // STANDALONE: Walk-Up Songs (base)
  // ============================================================
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
}

// Exported arrays are backed by globalThis — mutations are visible across
// all module instances within the same Node.js process.
export const teams: Team[] = getStore().teams;
export const signupLists: SignupList[] = getStore().signupLists;
