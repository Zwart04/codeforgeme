import SnapshotDetailClient from './SnapshotDetailClient';

export async function generateStaticParams() {
  return [{ slug: 'demo-snapshot' }];
}

export default async function SnapshotDetailPage({ params }: { params: Promise<{ slug: string }> }) {
  return <SnapshotDetailClient params={await params} />;
}
