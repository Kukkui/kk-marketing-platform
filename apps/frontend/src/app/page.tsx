'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';

export default function Index() {
  const router = useRouter();

  useEffect(() => {
    // Check if a login token exists in local storage
    const token = localStorage.getItem('authToken');
    if (token) {
      // If logged in, redirect to /home
      router.push('/home');
    } else {
      // If not logged in, redirect to /login
      router.push('/login');
    }
  }, [router]);

  // Render nothing or a loading state while redirecting
  return null;
}