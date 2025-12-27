import { useDispatch } from 'react-redux';
import { AppDispatch } from '@/shared/types/lib/appState.types';

export const useAppDispatch = useDispatch.withTypes<AppDispatch>();
