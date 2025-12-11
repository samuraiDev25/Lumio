'use client';

import { Checkbox, Pagination, TextArea, TextField } from '@/shared/ui';
import Tab from '@/shared/ui/tab/Tab';

export default function Home() {
  return (
    <div>
      <h1>MAIN PAGE</h1>
      <Tab
        items={[
          {
            label: 'checkbox',
            value: 'checkbox',
            children: <Checkbox checked={true} onChange={() => true} />,
          },
          {
            label: 'textarea',
            value: 'textarea',
            children: <TextArea />,
          },
          {
            label: 'pagination',
            value: 'pagination',
            children: <Pagination totalPages={1} />,
          },
          {
            label: 'textfield',
            value: 'textfield',
            children: <TextField />,
          },
        ]}
      />
    </div>
  );
}
