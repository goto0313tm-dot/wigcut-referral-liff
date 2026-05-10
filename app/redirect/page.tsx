'use client';

import { Suspense, useEffect, useState } from 'react';
import { useSearchParams } from 'next/navigation';
import { getLineProfile } from '@/lib/liff';
import { linkBeneficiary } from '@/lib/gas-client';
import LoadingSpinner from '@/components/LoadingSpinner';
import ErrorMessage from '@/components/ErrorMessage';

const FALLBACK_LSTEP_URL = process.env.NEXT_PUBLIC_LSTEP_REDIRECT_URL ?? '';

function RedirectInner() {
  const params = useSearchParams();
  const ref = params.get('ref');
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!ref) {
      setError('紹介リンクが正しくありません');
      return;
    }

    let cancelled = false;
    (async () => {
      try {
        const profile = await getLineProfile();
        const result = await linkBeneficiary(profile, ref);
        if (cancelled) return;

        if (result.error) {
          setError(result.error);
          return;
        }

        const target = result.redirect_to || FALLBACK_LSTEP_URL;
        if (!target) {
          setError('リダイレクト先が設定されていません');
          return;
        }

        window.location.href = target;
      } catch (e: unknown) {
        if (cancelled) return;

        // GAS が落ちていたとしても LINE 友達追加は通したい
        const fallback = FALLBACK_LSTEP_URL;
        if (fallback) {
          window.location.href = fallback;
          return;
        }

        const message = e instanceof Error ? e.message : String(e);
        setError(message);
      }
    })();

    return () => {
      cancelled = true;
    };
  }, [ref]);

  if (error) return <ErrorMessage message={error} />;

  return <LoadingSpinner message="WIGCUT 公式 LINE へ移動中…" />;
}

export default function RedirectPage() {
  return (
    <Suspense fallback={<LoadingSpinner message="読み込み中…" />}>
      <RedirectInner />
    </Suspense>
  );
}
