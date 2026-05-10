export type LineProfile = {
  userId: string;
  displayName: string;
  pictureUrl?: string;
  statusMessage?: string;
};

export type ReferralHistoryItem = {
  date: string;
  amount: number;
  notes?: string;
};

export type IssueReferrerResponse = {
  referrer_id: string;
  coupon_code: string;
  coupon_amount: number;
  referral_count: number;
  pending_count: number;
  coupon_expires_at: string | null;
  display_name: string;
  share_url: string;
  tweet_text: string;
  qr_image_url: string;
  history: ReferralHistoryItem[];
  error?: string;
};

export type LinkBeneficiaryResponse = {
  ok: boolean;
  redirect_to: string;
  already_linked?: boolean;
  error?: string;
};

export type GetReferrerStatusResponse = IssueReferrerResponse;
