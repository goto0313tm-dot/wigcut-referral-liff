'use client';

import { useEffect, useState } from 'react';
import { getLineProfile } from '@/lib/liff';
import { issueReferrer } from '@/lib/gas-client';
import type { IssueReferrerResponse } from '@/lib/types';
import ReferralCard from '@/components/ReferralCard';
import LoadingSpinner from '@/components/LoadingSpinner';
import ErrorMessage from '@/components/ErrorMessage';

export default function ReferrerPage() {
  const [data, setData] = useState<IssueReferrerResponse | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        const profile = await getLineProfile();
        const result = await issueReferrer(profile);
        if (cancelled) return;
        if (result.error) {
          setError(result.error);
          return;
        }
        setData(result);
      } catch (e: unknown) {
        if (cancelled) return;
        const message = e instanceof Error ? e.message : String(e);
        setError(message);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, []);

  if (error) return <ErrorMessage message={error} />;
  if (!data) return <LoadingSpinner message="あなた専用の紹介リンクを準備中…" />;

  return <ReferralCard data={data} />;
}
