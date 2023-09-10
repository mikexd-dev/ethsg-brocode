'use client';
import { useDisconnect } from 'wagmi';

import React from 'react';
import { Button } from '@/components/ui/button';

const SignoutButton = () => {
  const { disconnectAsync } = useDisconnect();
  const handleSignout = async () => {
    disconnectAsync();
  };
  return (
    <Button variant="destructive" onClick={handleSignout}>
      Sign Out
    </Button>
  );
};

export default SignoutButton;
