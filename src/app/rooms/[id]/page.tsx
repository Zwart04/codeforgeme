import RoomDetailClient from './RoomDetailClient';

export async function generateStaticParams() {
  return [{ id: 'demo-room' }];
}

export default async function RoomDetailPage({ params }: { params: Promise<{ id: string }> }) {
  return <RoomDetailClient params={await params} />;
}
