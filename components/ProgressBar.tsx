type Props = {
  count: number;
  milestone?: number;
};

const MILESTONES = [1, 3, 5, 10, 20] as const;
const COUPON_AMOUNT_PER_REFERRAL = 3000;

function pickNextMilestone(count: number): number {
  return MILESTONES.find((m) => m > count) ?? MILESTONES[MILESTONES.length - 1];
}

export default function ProgressBar({ count, milestone }: Props) {
  const target = milestone ?? pickNextMilestone(count);
  const filled = Math.min(count, target);
  const empty = Math.max(0, target - filled);

  const nextMilestone = MILESTONES.find((m) => m > count);
  const remaining = nextMilestone ? nextMilestone - count : 0;
  const nextReward = nextMilestone ? nextMilestone * COUPON_AMOUNT_PER_REFERRAL : 0;

  return (
    <div className="space-y-2">
      <div className="flex items-center gap-1 text-xl">
        {Array.from({ length: filled }).map((_, i) => (
          <span key={`f-${i}`} aria-hidden>
            ▰
          </span>
        ))}
        {Array.from({ length: empty }).map((_, i) => (
          <span key={`e-${i}`} aria-hidden className="text-gray-300">
            ▱
          </span>
        ))}
        <span className="ml-2 text-sm text-gray-700">
          {count} / {target} 人
        </span>
      </div>
      {nextMilestone && remaining > 0 && (
        <p className="text-sm text-pink-600 font-medium">
          あと {remaining} 人で {nextReward.toLocaleString()} 円OFF
        </p>
      )}
    </div>
  );
}
