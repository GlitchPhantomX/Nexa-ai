import { CallView } from "@/modules/meetings/ui/views/call-view";

interface PageProps {
  params: Promise<{
    meetingId: string;
  }>;
}

export default async function Page({ params }: PageProps) {
  const { meetingId } = await params;

  return <CallView meetingId={meetingId} />;
}
