import { Tabs } from 'radix-ui';
import s from './Tabs.module.scss';

type Props = {
  asChild?: boolean;
  value?: string;
};

const TabsDemo = ({ asChild, value }: Props) => (
  <Tabs.Root className={s.Root} defaultValue={value}>
    <Tabs.List>
      <Tabs.Trigger className={s.Trigger} value={value}>
        General information
      </Tabs.Trigger>
      <Tabs.Trigger className={s.Trigger} value="12">
        Too
      </Tabs.Trigger>
    </Tabs.List>

    <Tabs.Content value={value}>
      <p>General information</p>
    </Tabs.Content>
    <Tabs.Content value="12">
      <p>Too</p>
    </Tabs.Content>
  </Tabs.Root>
);

export default TabsDemo;
