import { AppDispatch } from '@/app/providers/store';
import { useDispatch } from 'react-redux';

const useAppDispatch: () => AppDispatch = useDispatch;

export { useAppDispatch };
