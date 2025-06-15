"use client";

import React from 'react';

// This component can be used to wrap your application with context providers,
// theme providers, etc. For now, it's a simple pass-through.
export default function AppProviders({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
