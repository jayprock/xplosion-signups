-- 002: Enable RLS and create policies

alter table teams enable row level security;
alter table signup_lists enable row level security;
alter table signup_entries enable row level security;

-- Teams: public read, service-role write
create policy "teams_select" on teams for select using (true);
create policy "teams_insert" on teams for insert with check (true);
create policy "teams_update" on teams for update using (true);
create policy "teams_delete" on teams for delete using (true);

-- Signup lists: public read, service-role write
create policy "lists_select" on signup_lists for select using (true);
create policy "lists_insert" on signup_lists for insert with check (true);
create policy "lists_update" on signup_lists for update using (true);
create policy "lists_delete" on signup_lists for delete using (true);

-- Signup entries: public read/write (community trust model)
create policy "entries_select" on signup_entries for select using (true);
create policy "entries_insert" on signup_entries for insert with check (true);
create policy "entries_update" on signup_entries for update using (true);
create policy "entries_delete" on signup_entries for delete using (true);
