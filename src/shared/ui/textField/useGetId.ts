import { useId } from 'react';

export const useGetId = (idFromComponentProps?: string) => {
  const generatedId = useId();

  return idFromComponentProps ?? generatedId;
};
