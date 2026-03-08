// Team Dashboard - shows all sign-up lists with status summary
// This is the central hub parents will bookmark and revisit.

export default async function TeamDashboardPage({
  params,
}: {
  params: Promise<{ teamSlug: string }>;
}) {
  const { teamSlug } = await params;

  return (
    <div>
      <h1>Team Dashboard</h1>
      <p>Team slug: {teamSlug}</p>
      <p>TODO: Implement dashboard with sign-up list cards and status indicators</p>
    </div>
  );
}
