
import { UserProfile } from '../types';

const MAX_FREE_CALCS = 5;

export function canPerformCalculation(user: UserProfile | null): boolean {
  // Pro and Starter have unlimited
  if (user && (user.plan === 'starter' || user.plan === 'pro')) {
    return true;
  }

  // Check local storage for daily count as a first-line guest tracker
  const today = new Date().toISOString().split('T')[0];
  const usageKey = `usage_${today}`;
  const currentUsage = parseInt(localStorage.getItem(usageKey) || '0', 10);

  return currentUsage < MAX_FREE_CALCS;
}

export function recordCalculationUsage(user: UserProfile | null) {
  const today = new Date().toISOString().split('T')[0];
  const usageKey = `usage_${today}`;
  const currentUsage = parseInt(localStorage.getItem(usageKey) || '0', 10);
  
  localStorage.setItem(usageKey, (currentUsage + 1).toString());

  // In production, you would call the Supabase RPC `increment_usage` here
}
