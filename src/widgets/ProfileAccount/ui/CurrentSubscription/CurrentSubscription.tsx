import s from '@/widgets/ProfileAccount/ui/ProfileAccount.module.scss';
import { UpdateAutoRenewal } from '@/widgets/ProfileAccount/ui/UpdateAutoRenewal/UpdateAutoRenewal';
import { AccountType } from '@/features/payments/model/types/paymentsTypes';

type Props = {
  endDate?: string;
  nextPaymentDate?: string;
  autoRenewal?: boolean;
  accountType?: AccountType;
  onAutoRenewalChange: (
    autoRenewal: boolean,
    newAccountType?: AccountType,
  ) => void;
};

export const CurrentSubscription = ({
  endDate,
  nextPaymentDate,
  autoRenewal = true,
  accountType,
  onAutoRenewalChange,
}: Props) => {
  return (
    <div className={s.section}>
      <p className={s.sectionTitle}>Current Subscription:</p>

      <div className={s.flexCard}>
        <div className={s.expireCard}>
          <div className={s.header}>Expire at</div>
          <div className={s.date}>
            {endDate ? new Date(endDate).toLocaleDateString() : '--.--.----'}
          </div>
        </div>
        <div className={s.nextPayment}>
          <div className={s.header}>Next payment</div>
          <div className={s.date}>
            {nextPaymentDate
              ? new Date(nextPaymentDate).toLocaleDateString()
              : '--.--.----'}
          </div>
        </div>
      </div>

      <div className={s.autoRenewal}>
        <UpdateAutoRenewal
          autoRenewal={autoRenewal}
          accountType={accountType}
          onAutoRenewalChangeAction={onAutoRenewalChange}
        />
      </div>
    </div>
  );
};
