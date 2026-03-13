'use client'

import { useState } from 'react';
import { useUpdatingPaymentMutation } from '../../api/paymantsApi';

type Props = {
    subscriptionId: string;
}

export const UpdatingPayment = ({subscriptionId}: Props)=> {
const [isCancelled, setIsCancelled] = useState(true)
const updatingPayment = useUpdatingPaymentMutation()


    const handleCancel = async () => {
    try {
    }

        if (!updatingPayment.ok) throw new Error("Failed to cancel");
    
    setIsCancelled(true);
    
      // Передаём дату окончания периода, если нужно показать пользователю
    if (onCancelSuccess) onCancelSuccess();
    
    } catch (error) {
        console.error("Error:", error);
        alert("Не удалось отменить подписку. Попробуйте позже.");
    }
    }


    return (
        <>
            <Checkbox checked={isCancelled} onChangeAction={handleCancel}/>
        </>
    )
}