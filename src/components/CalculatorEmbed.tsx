
'use client';

import React from 'react';
import CalculatorPage from '../pages/Calculator';
import { UserProfile } from '../types';

interface CalculatorEmbedProps {
  variant?: 'fee' | 'profit' | 'ads' | 'breakeven';
}

export default function CalculatorEmbed({ variant }: CalculatorEmbedProps) {
  // Use a null user for the embed if not logged in
  const [user, setUser] = React.useState<UserProfile | null>(null);

  React.useEffect(() => {
    const savedUser = localStorage.getItem('etsy_calc_user');
    if (savedUser) {
      setUser(JSON.parse(savedUser));
    }
  }, []);

  return (
    <div className="not-prose my-12">
      <div className="p-1 bg-gradient-to-r from-primary/20 via-transparent to-primary/20 rounded-[40px]">
        <div className="bg-white rounded-[38px] overflow-hidden shadow-2xl border border-gray-100">
           <CalculatorPage user={user} />
        </div>
      </div>
    </div>
  );
}
