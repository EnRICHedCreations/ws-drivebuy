export const calculateDistressScore = (indicators: {
    overgrownLawn: boolean;
    boardedWindows: boolean;
    roofDamage: boolean;
    peelingPaint: boolean;
    brokenFences: boolean;
    forSaleSign: boolean;
    codeViolations: boolean;
    other: string[];
}) => {
    const checkedCount = Object.values(indicators).filter(Boolean).length;
    return Math.min(100, Math.round((checkedCount / 7) * 100));
};
