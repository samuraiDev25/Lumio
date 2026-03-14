import { Payment } from '@/features/payments/api/paymentsApi.types';
import { Typography } from '@/shared/ui';
import s from './PaymentsTable.module.scss';

type PaymentsTableProps = {
  payments: Payment[];
};

export const PaymentsTable = ({ payments }: PaymentsTableProps) => {
  if (!payments.length) {
    return (
      <div className={s.empty}>
        <Typography variant="regular_text_16">
          You don&apos;t have any payments yet.
        </Typography>
      </div>
    );
  }

  return (
    <div className={s.wrapper}>
      <table className={s.table}>
        <thead>
          <tr className={s.headRow}>
            <th className={s.headCell}>Date</th>
            <th className={s.headCell}>Amount</th>
            <th className={s.headCell}>Subscription type</th>
            <th className={s.headCell}>Payment service</th>
          </tr>
        </thead>
        <tbody>
          {payments.map((payment) => (
            <tr key={payment.id} className={s.row}>
              <td className={s.cell}>
                {new Date(payment.createdAt).toLocaleDateString()}
              </td>
              <td className={s.cell}>{payment.amount}</td>
              <td className={s.cell}>{payment.subscriptionType}</td>
              <td className={s.cell}>{payment.paymentService}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};
