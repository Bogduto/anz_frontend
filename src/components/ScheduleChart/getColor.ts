const WORKSPACE_COLORS: Record<
  number,
  { bg: string; border: string; text: string }
> = {
  1: {
    bg: "rgba(245,158,11,0.10)",
    border: "rgba(245,158,11,0.35)",
    text: "",
  },
  2: {
    bg: "rgba(251,113,133,0.10)",
    border: "rgba(251,113,133,0.35)",
    text: "",
  },
  3: {
    bg: "rgba(255,255,255,0.10)",
    border: "rgba(255,255,255,0.25)",
    text: "",
  },
  4: {
    bg: "rgba(96,165,250,0.10)",
    border: "rgba(96,165,250,0.35)",
    text: "",
  },
};

/** Generate a stable color for any workspace ID using hue derivation */
function generateColor(workspaceId: number): { bg: string; border: string; text: string } {
  const hue = (workspaceId * 137) % 360;
  return {
    bg: `hsla(${hue},65%,70%,0.10)`,
    border: `hsla(${hue},65%,70%,0.35)`,
    text: "",
  };
}

const getColor = (workspaceId: number) => {
  return WORKSPACE_COLORS[workspaceId] ?? generateColor(workspaceId);
};

export default getColor;
