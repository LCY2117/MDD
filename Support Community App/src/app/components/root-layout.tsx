import { Outlet } from 'react-router';
import { UserProvider } from '../contexts/user-context';

export function RootLayout() {
  return (
    <UserProvider>
      <Outlet />
    </UserProvider>
  );
}