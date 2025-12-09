'use client';
import TabsDemo from '@/shared/ui/Tabs/Tabs';
import TextArea from '@/shared/ui/TextArea';

export default function Home() {
  return (
    <div>
      <h1>MAIN PAGE</h1>
      <TextArea placeholder="Text-area" />
      <TabsDemo />
    </div>
  );
}
