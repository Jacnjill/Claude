'use client';

import { useEffect, useState } from 'react';
import { createClient } from '@/lib/supabase/client';
import type { User } from '@supabase/supabase-js';
import type { UserProfile } from '@/types';

interface AuthState {
  user:    User | null;
  profile: UserProfile | null;
  loading: boolean;
}

/**
 * Hook that returns the current Supabase user and their profile.
 * Subscribes to auth state changes for reactivity.
 */
export function useAuth(): AuthState {
  const [state, setState] = useState<AuthState>({ user: null, profile: null, loading: true });
  const supabase = createClient();

  useEffect(() => {
    const fetchProfile = async (user: User | null) => {
      if (!user) {
        setState({ user: null, profile: null, loading: false });
        return;
      }

      const { data } = await supabase
        .from('user_profiles')
        .select('*')
        .eq('id', user.id)
        .single();

      setState({ user, profile: data ?? null, loading: false });
    };

    // Initial session
    supabase.auth.getSession().then(({ data: { session } }) => {
      fetchProfile(session?.user ?? null);
    });

    // Subscribe to changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      fetchProfile(session?.user ?? null);
    });

    return () => subscription.unsubscribe();
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  return state;
}
