import { DataOfPayment } from '@/features/payments/api/paymentsApi.types';
import { Typography } from '@/shared/ui';
import s from './PaymentsTable.module.scss';

type PaymentsTableProps = {
  payments: DataOfPayment[];
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
            <th className={s.headCell}>Date of Payment</th>
            <th className={s.headCell}>End date of subscription</th>
            <th className={s.headCell}>Prise</th>
            <th className={s.headCell}>Currency</th>
            <th className={s.headCell}>Subscription Type</th>
          </tr>
        </thead>
        <tbody>
          {payments.map((payment) => (
            <tr key={payment.datePayment} className={s.row}>
              <td className={s.cell}>
                {new Date(payment.datePayment).toLocaleDateString()}
              </td>
              <td className={s.cell}>
                {new Date(payment.endDate).toLocaleDateString()}
              </td>
              <td className={s.cell}>{payment.amount}</td>
              <td className={s.cell}>{payment.currency}</td>
              <td className={s.cell}>{payment.subscriptionType}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};
