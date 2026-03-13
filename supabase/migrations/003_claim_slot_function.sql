-- 003: Race-condition-safe signup slot claim

create or replace function claim_signup_slot(
  p_list_id uuid,
  p_slot_index integer,
  p_values jsonb
) returns jsonb language plpgsql as $$
declare
  v_slots_needed integer;
  v_current_count integer;
  v_new_entry signup_entries%rowtype;
begin
  -- Get the list's slot capacity
  select slots_needed into v_slots_needed
  from signup_lists
  where id = p_list_id;

  if v_slots_needed is null then
    return jsonb_build_object('error', 'List not found');
  end if;

  -- Count existing entries
  select count(*) into v_current_count
  from signup_entries
  where list_id = p_list_id;

  if v_current_count >= v_slots_needed then
    return jsonb_build_object('error', 'All slots are filled');
  end if;

  -- Check if this specific slot is already taken
  if exists (
    select 1 from signup_entries
    where list_id = p_list_id and slot_index = p_slot_index
  ) then
    return jsonb_build_object('error', 'This slot was just filled — try another');
  end if;

  -- Insert the new entry
  insert into signup_entries (list_id, slot_index, "values")
  values (p_list_id, p_slot_index, p_values)
  returning * into v_new_entry;

  return jsonb_build_object(
    'entry', jsonb_build_object(
      'id', v_new_entry.id,
      'slotIndex', v_new_entry.slot_index,
      'values', v_new_entry."values",
      'signedUpAt', v_new_entry.signed_up_at
    )
  );
end;
$$;
