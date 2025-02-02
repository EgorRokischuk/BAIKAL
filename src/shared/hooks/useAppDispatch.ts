import { useDispatch } from 'react-redux';
import { AppDispatch } from '@/app/providers/store';

const useAppDispatch: () => AppDispatch = useDispatch;

export { useAppDispatch };
