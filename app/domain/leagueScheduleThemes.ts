export const plgScheduleTheme = {
  activeTabClassName: "bg-[#BB986C] shadow-[0_12px_32px_rgba(187,152,108,0.34)] hover:bg-[#a9885d]",
  inactiveTabClassName: "border-[#5e513f] bg-[#181818] text-[#d9c4a6] hover:bg-[#211d18]",
  paginationClassName: "border-[#5e513f] bg-[#181818] text-[#d9c4a6] hover:bg-[#211d18]",
  paginationActiveClassName:
    "bg-[#BB986C] shadow-[0_12px_32px_rgba(187,152,108,0.34)] hover:bg-[#a9885d]",
  filterLabelClassName: "text-xs font-semibold uppercase tracking-[0.18em] text-white/55",
  filterSelectClassName: "border-white/10 bg-[#16181f] text-white focus:border-[#BB986C]",
  homeBadgeClassName: "bg-[#BB986C] text-white",
};

export function getPlgPaginationTheme(isThirdSectionActive: boolean, isBclSectionActive: boolean) {
  if (isBclSectionActive) {
    return {
      paginationClassName: "border-[#ddcf9c] bg-[#f7f1dc] text-[#8a742d] hover:bg-[#f1e7c5]",
      paginationActiveClassName:
        "bg-[#C5A649] text-white shadow-[0_12px_32px_rgba(197,166,73,0.34)] hover:bg-[#b2943f]",
    };
  }

  if (isThirdSectionActive) {
    return {
      paginationClassName: "border-[#8fb3d1] bg-[#eaf2f9] text-[#0f4c81] hover:bg-[#dceaf7]",
      paginationActiveClassName:
        "bg-[#0f4c81] text-white shadow-[0_12px_32px_rgba(15,76,129,0.32)] hover:bg-[#0d426e]",
    };
  }

  return {
    paginationClassName: plgScheduleTheme.paginationClassName,
    paginationActiveClassName: plgScheduleTheme.paginationActiveClassName,
  };
}

export function getTpblScheduleTheme(isThirdSectionActive: boolean, isBclSectionActive = false) {
  const inactiveTabClassName = isThirdSectionActive
    ? "border border-[#8fb3d1] bg-[#eaf2f9] text-[#0f4c81]"
    : "border border-[#c5a57d] bg-[#f5ede3] text-[#8F724E]";
  const activeTabClassName = isThirdSectionActive
    ? "bg-[#0f4c81] text-white shadow-[0_12px_32px_rgba(15,76,129,0.32)] hover:bg-[#0d426e]"
    : "bg-[#8F724E] text-white shadow-[0_12px_32px_rgba(143,114,78,0.3)] hover:bg-[#7b6243]";
  const paginationClassName = isBclSectionActive
    ? "border-[#ddcf9c] bg-[#f7f1dc] text-[#8a742d] hover:bg-[#f1e7c5]"
    : isThirdSectionActive
      ? "border-[#8fb3d1] bg-[#eaf2f9] text-[#0f4c81] hover:bg-[#dceaf7]"
      : "border-[#c5a57d] bg-[#f5ede3] text-[#8F724E] hover:bg-[#efdfcc]";
  const paginationActiveClassName = isBclSectionActive
    ? "bg-[#C5A649] text-white shadow-[0_12px_32px_rgba(197,166,73,0.34)] hover:bg-[#b2943f]"
    : activeTabClassName;

  return {
    activeTabClassName,
    inactiveTabClassName,
    paginationClassName,
    paginationActiveClassName,
    filterLabelClassName: "text-xs font-semibold uppercase tracking-[0.18em] text-white/70",
    filterSelectClassName: "border-white/20 bg-white text-[#13233d] focus:border-[#BB986C]",
  };
}

export function getBclScheduleTheme(isBclSectionActive: boolean) {
  const passiveClassName = isBclSectionActive
    ? "border-[#ddcf9c] bg-[#f7f1dc] text-[#8a742d] hover:bg-[#f1e7c5]"
    : "border-[#8fb3d1] bg-[#eaf2f9] text-[#0f4c81] hover:bg-[#dceaf7]";

  return {
    activeTabClassName: "bg-[#C5A649] shadow-[0_12px_32px_rgba(197,166,73,0.34)] hover:bg-[#b2943f]",
    inactiveTabClassName: passiveClassName,
    paginationClassName: passiveClassName,
    paginationActiveClassName:
      "bg-[#C5A649] text-white shadow-[0_12px_32px_rgba(197,166,73,0.34)] hover:bg-[#b2943f]",
    filterLabelClassName: "text-xs font-semibold uppercase tracking-[0.18em] text-white/70",
    filterSelectClassName: `border-white/20 bg-white text-[#13233d] ${
      isBclSectionActive ? "focus:border-[#C5A649]" : "focus:border-[#0f4c81]"
    }`,
    homeBadgeClassName: isBclSectionActive ? "bg-[#C5A649] text-white" : "bg-[#0f4c81] text-white",
  };
}
