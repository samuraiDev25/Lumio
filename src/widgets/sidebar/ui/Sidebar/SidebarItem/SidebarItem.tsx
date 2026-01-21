import s from '@/widgets/sidebar/ui/Sidebar/Sidebar.module.scss';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { ReactNode } from 'react';
import { Button } from '@/shared/ui';

type Props = {
  title: string;
  href?: string;
  startDecoration: ReactNode;
  onclick?: () => void;
  className?: string;
};

export const SidebarItem = ({
  title,
  href,
  startDecoration,
  onclick,
  className,
}: Props) => {
  const pathname = usePathname();
  const isActive = pathname === href;

  return (
    <>
      {href ? (
        <Link
          href={href}
          className={`${s.link} ${isActive ? s.active : ''}`}
          aria-label={title}
        >
          {startDecoration}
          {title}
        </Link>
      ) : (
        <Button className={className} variant={'link'} onClick={onclick}>
          {startDecoration}
          Log out
        </Button>
      )}
    </>
  );
};
