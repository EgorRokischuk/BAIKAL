import { TypedUseSelectorHook, useSelector } from 'react-redux';
import { RootState } from '@/app/providers/store';

const useAppSelector: TypedUseSelectorHook<RootState> = useSelector;

export { useAppSelector };
