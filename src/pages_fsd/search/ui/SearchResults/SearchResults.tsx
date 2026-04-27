import { SearchUser } from '@/entities/user';
import { Typography } from '@/shared/ui';
import { SearchEmptyState } from '@/pages_fsd/search/ui/RecentRequestsSection/SearchEnptyState/SearchEmptyState';
import { UserItem } from './UserItem/UserItem';
import s from '../Search.module.scss';

type Props = {
  isFetching: boolean;
  showEmptyResult: boolean;
  users: SearchUser[];
};

export const SearchResults = ({
  isFetching,
  showEmptyResult,
  users,
}: Props) => {
  return (
    <div className={s.sectionBlock}>
      {isFetching && (
        <Typography color="secondary" variant="regular_text_14">
          Searching...
        </Typography>
      )}

      {showEmptyResult && <SearchEmptyState description="No users found." />}

      {users.length > 0 && (
        <ul className={s.userList}>
          {users.map((user) => (
            <UserItem key={user.id} user={user} />
          ))}
        </ul>
      )}
    </div>
  );
};
