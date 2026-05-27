const WORKSPACE_COLORS: Record<
    number,
    { bg: string; border: string; text: string }
> = {
    1: {
        bg: "rgba(59,130,246,0.10)",
        border: "rgba(59,130,246,0.35)",
        text: "text-blue-700",
    },
    2: {
        bg: "rgba(168,85,247,0.10)",
        border: "rgba(168,85,247,0.35)",
        text: "text-purple-700",
    },
    3: {
        bg: "rgba(34,197,94,0.10)",
        border: "rgba(34,197,94,0.35)",
        text: "text-green-700",
    },
    4: {
        bg: "rgba(249,115,22,0.10)",
        border: "rgba(249,115,22,0.35)",
        text: "text-orange-700",
    },
};

const getColor = (workspaceId: number) => {
    return (
        WORKSPACE_COLORS[workspaceId] ?? {
            bg: "rgba(100,100,100,0.10)",
            border: "rgba(100,100,100,0.35)",
            text: "text-gray-700",
        }
    );
}

export default getColor;