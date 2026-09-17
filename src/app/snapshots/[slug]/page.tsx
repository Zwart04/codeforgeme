import SnapshotDetailClient from './SnapshotDetailClient';

export async function generateStaticParams() {
  return [{ slug: 'demo-snapshot' }];
}

export default function SnapshotDetailPage({ params }: { params: { slug: string } }) {
  return <SnapshotDetailClient params={params} />;
}
