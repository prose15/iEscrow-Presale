import { useMemo } from "react";

type Props = {
  presaleSupply: number;
  tokensSold: number;
};

const SupplyStatus = ({ presaleSupply, tokensSold }: Props) => {
  const tokensRemaining = useMemo(() => {
    return Number(presaleSupply - tokensSold).toFixed(2);
  }, [presaleSupply, tokensSold]);

  // Calculate the bar width
  const percentageSold = useMemo(() => {
    if (!presaleSupply || presaleSupply <= 0) return 0;
    const ratio = (tokensSold / presaleSupply) * 100;
    return Math.min(100, Math.max(0, Number(ratio.toFixed(4))));
  }, [tokensSold, presaleSupply]);

  function formatQuantity(num: number) {
    if (isNaN(num)) return "0";
    if (num >= 1_000_000_000_000) return (num / 1_000_000_000_000).toFixed(2) + "T";
    if (num >= 1_000_000_000) return (num / 1_000_000_000).toFixed(2) + "B";
    if (num >= 1_000_000) return (num / 1_000_000).toFixed(2) + "M";
    return num.toLocaleString();
  }

  return (
    <div>
      {/* 🔹 Datos superiores */}
      <div className="w-full flex items-center justify-between flex-nowrap tracking-tighter !text-sm">
        <span className="text-bg-logo font-medium">
          {formatQuantity(tokensSold)} Tokens sold
        </span>
        <span className="text-bg-logo">
          {tokensRemaining} Tokens remaining
        </span>
      </div>

      {/* 🔹 Bar */}
      <div className="relative w-full my-2 p-1 rounded-full border border-body-text">
        <div
          style={{
            width: `${percentageSold}%`,
            transition: "width 0.6s ease-in-out",
            background: "linear-gradient(90deg, #30c2e2, #e020f1)",
          }}
          className={`h-2 rounded-full bg-gradient-to-r`}
        />
      </div>

      {/* 🔹 Total Supply */}
      <div className="w-full text-right text-sm font-medium text-bg-logo">
        Total sale volume: {formatQuantity(presaleSupply)}
      </div>
    </div>
  );
};

export default SupplyStatus;
