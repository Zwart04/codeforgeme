import RoomDetailClient from './RoomDetailClient';

export async function generateStaticParams() {
  return [{ id: 'demo-room' }];
}

export default function RoomDetailPage({ params }: { params: { id: string } }) {
  return <RoomDetailClient params={params} />;
}
