import s from '@/widgets/ProfileAccount/ui/ProfileAccount.module.scss';
import { Checkbox } from '@/shared/ui';

type Props = {
  endDate?: string;
  nextPaymentDate?: string;
  autoRenewal?: boolean;
  isUpdating?: boolean;
  onToggleAutoRenewal: (checked: boolean) => void;
};

export const CurrentSubscription = ({
  endDate,
  nextPaymentDate,
  autoRenewal = false,
  isUpdating = false,
  onToggleAutoRenewal,
}: Props) => {
  return (
    <div className={s.section}>
      <p className={s.sectionTitle}>Current Subscription:</p>

      <div className={s.flexCard}>
        <div className={s.expireCard}>
          <div className={s.header}>Expire at</div>
          <div className={s.date}>{endDate || '--.--.----'}</div>
        </div>
        <div className={s.nextPayment}>
          <div className={s.header}>Next payment</div>
          <div className={s.date}>{nextPaymentDate || '--.--.----'}</div>
        </div>
      </div>

      <div className={s.autoRenewal}>
        <Checkbox
          checked={autoRenewal}
          onChangeAction={onToggleAutoRenewal}
          label="Auto-Renewal"
          disabled={isUpdating}
        />
      </div>
    </div>
  );
};
