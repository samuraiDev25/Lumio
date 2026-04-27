import { Typography } from '@/shared/ui';
import { SearchEmptyState } from '@/pages_fsd/search/ui/RecentRequestsSection/SearchEnptyState/SearchEmptyState';
import s from '../Search.module.scss';

type Props = {
  recentRequests: string[];
  onSelectRequest: (request: string) => void;
};

export const RecentRequestsSection = ({
  recentRequests,
  onSelectRequest,
}: Props) => (
  <>
    <Typography as="h2" variant="h2">
      Recent requests
    </Typography>

    <div className={s.sectionBlock}>
      {recentRequests.length > 0 ? (
        <ul className={s.recentList}>
          {recentRequests.map((request) => (
            <li key={request}>
              <button
                type="button"
                className={s.recentButton}
                onClick={() => onSelectRequest(request)}
              >
                {request}
              </button>
            </li>
          ))}
        </ul>
      ) : (
        <SearchEmptyState description="No recent requests." />
      )}
    </div>
  </>
);
