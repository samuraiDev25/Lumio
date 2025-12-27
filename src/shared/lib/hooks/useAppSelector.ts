import { useSelector } from 'react-redux';
import { AppStateTypes } from '@/shared/types/lib/appState.types';

export const useAppSelector = useSelector.withTypes<AppStateTypes>();
