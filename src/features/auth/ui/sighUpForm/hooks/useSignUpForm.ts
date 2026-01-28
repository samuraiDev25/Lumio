import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { toast } from 'react-toastify';
import { useRegistrationMutation } from '@/features/auth/api/authApi';
import { signUpSchema, SignUpType } from '@/features/auth/model/validation';
import { handleNetworkError } from '@/shared/lib';
import { useAppDispatch } from '@/shared/hooks';

export const useSignUpForm = () => {
  const dispatch = useAppDispatch();
  const [registration] = useRegistrationMutation();
  const [submittedEmail, setSubmittedEmail] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);

  const formMethods = useForm<SignUpType>({
    resolver: zodResolver(signUpSchema),
    mode: 'onChange',
    defaultValues: {
      username: '',
      email: '',
      password: '',
      passwordConfirmation: '',
      isAgree: true,
    },
  });

  const { reset, setError } = formMethods;

  const onSubmit = async (data: SignUpType) => {
    try {
      await registration({
        username: data.username,
        email: data.email,
        password: data.password,
      }).unwrap();

      setSubmittedEmail(data.email);
      setIsModalOpen(true);
      reset();
    } catch (error) {
      handleNetworkError({
        error,
        dispatch,
        handle400Error: (error) => {
          error.errorsMessages?.forEach((m) => {
            if (m.field) {
              setError(m.field as keyof SignUpType, {
                type: 'server',
                message: m.message,
              });
            }
          });
        },
        handle429Error: () => {
          toast.error('Too many requests. Try again later.');
        },
        handle500Error: () => {
          toast.error('Internal server error');
        },
        handleUnknownError: () => {
          toast.error('Unexpected error');
        },
      });
    }
  };

  const handleCloseModal = () => setIsModalOpen(false);

  return {
    formMethods,
    onSubmit,
    submittedEmail,
    isModalOpen,
    handleCloseModal,
  };
};
