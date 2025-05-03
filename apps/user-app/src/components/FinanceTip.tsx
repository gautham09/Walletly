
const financeTips = [
  "Pay yourself first: Save at least 10% of your income before spending.",
  "Track your spending: Know where every rupee goes — awareness is power.",
  "Build an emergency fund: Save 3–6 months of expenses for life’s surprises.",
  "Avoid lifestyle inflation: When income rises, don’t inflate expenses — invest the extra.",
  "Invest early & regularly: The earlier you start, the more compounding works for you.",
  "Clear high-interest debt first: Prioritize paying off credit cards and loans fast.",
  "Diversify your investments: Don’t put all your money in one asset class.",
  "Set clear financial goals: Short-term, medium-term, and long-term.",
  "Live below your means: Spend less than you earn — consistently.",
  "Review finances monthly: A quick check keeps you on track and in control."
];

export default function FinanceTip() {
  const randomTip = financeTips[Math.floor(Math.random() * financeTips.length)];

  return (
    <div className="bg-yellow-100 text-yellow-900 p-4 rounded shadow mt-4">
      💡 <strong>Finance Tip:</strong> {randomTip}
    </div>
  );
}
