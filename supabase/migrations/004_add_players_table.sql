-- Team roster: players (kids) on each team
CREATE TABLE players (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  team_id uuid NOT NULL REFERENCES teams(id) ON DELETE CASCADE,
  name text NOT NULL,
  created_at timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX idx_players_team_id ON players(team_id);

-- RLS
ALTER TABLE players ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Players are publicly readable"
  ON players FOR SELECT
  USING (true);

CREATE POLICY "Players are publicly writable"
  ON players FOR ALL
  USING (true)
  WITH CHECK (true);
