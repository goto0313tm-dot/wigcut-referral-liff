import type {
  IssueReferrerResponse,
  LinkBeneficiaryResponse,
  GetReferrerStatusResponse,
  LineProfile,
} from './types';

const GAS_URL = process.env.NEXT_PUBLIC_GAS_WEB_APP_URL;
const GAS_API_KEY = process.env.NEXT_PUBLIC_GAS_API_KEY;

async function gasPost<T>(action: string, payload: Record<string, unknown>): Promise<T> {
  if (!GAS_URL) {
    throw new Error('NEXT_PUBLIC_GAS_WEB_APP_URL is not configured');
  }

  const url = `${GAS_URL}?action=${encodeURIComponent(action)}`;
  const body = GAS_API_KEY ? { ...payload, api_key: GAS_API_KEY } : payload;

  const res = await fetch(url, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body),
  });

  if (!res.ok) {
    throw new Error(`GAS error: ${res.status} ${res.statusText}`);
  }

  return res.json() as Promise<T>;
}

export async function issueReferrer(profile: LineProfile): Promise<IssueReferrerResponse> {
  return gasPost<IssueReferrerResponse>('issue_referrer', {
    line_user_id: profile.userId,
    display_name: profile.displayName,
  });
}

export async function linkBeneficiary(
  profile: LineProfile,
  ref: string
): Promise<LinkBeneficiaryResponse> {
  return gasPost<LinkBeneficiaryResponse>('link_beneficiary', {
    line_user_id: profile.userId,
    display_name: profile.displayName,
    ref,
  });
}

export async function getReferrerStatus(profile: LineProfile): Promise<GetReferrerStatusResponse> {
  return gasPost<GetReferrerStatusResponse>('get_referrer_status', {
    line_user_id: profile.userId,
  });
}

export async function logShare(
  ref: string,
  method: 'line' | 'twitter' | 'instagram' | 'qr' | 'copy',
  sharedCount?: number
): Promise<{ ok: boolean }> {
  return gasPost<{ ok: boolean }>('log_share', {
    ref,
    method,
    shared_count: sharedCount ?? null,
  });
}
