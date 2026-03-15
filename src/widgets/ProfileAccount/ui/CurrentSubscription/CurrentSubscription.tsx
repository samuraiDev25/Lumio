import s from '@/widgets/ProfileAccount/ui/ProfileAccount.module.scss';
import { UpdateAutoRenewal } from '@/features/payments/ui/UpdatingPayment/UpdateAutoRenewal';
import { AccountType } from '@/features/payments/model/types/paymentsTypes';
import { Checkbox } from '@/shared/ui';

type Props = {
  endDate?: string;
  nextPaymentDate?: string;
  autoRenewal?: boolean;
  accountType?: AccountType;
  onAutoRenewalChange?: (autoRenewal: boolean, newAccountType?: AccountType) => void;
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
          <div className={s.date}>{endDate || '--.--.----'}</div>
        </div>
        <div className={s.nextPayment}>
          <div className={s.header}>Next payment</div>
          <div className={s.date}>{nextPaymentDate || '--.--.----'}</div>
        </div>
      </div>

      <div className={s.autoRenewal}>
        <Checkbox checked={autoRenewal} onChangeAction={onAutoRenewalChange!} label="Auto-Renewal"/>
        <UpdateAutoRenewal 
          autoRenewal={autoRenewal} 
          accountType={accountType}
          onAutoRenewalChange={onAutoRenewalChange}
        />
      </div>
    </div>
  );
};
