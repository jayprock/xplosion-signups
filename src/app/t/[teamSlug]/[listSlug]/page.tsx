// Individual Sign-Up List page
// Shows full details for a single sign-up list (event-tied or standalone).

export default async function SignupListPage({
  params,
}: {
  params: Promise<{ teamSlug: string; listSlug: string }>;
}) {
  const { teamSlug, listSlug } = await params;

  return (
    <div>
      <h1>Sign-Up List</h1>
      <p>Team: {teamSlug}</p>
      <p>List: {listSlug}</p>
      <p>TODO: Implement sign-up list view with slots/entries</p>
    </div>
  );
}
