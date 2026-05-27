type Workspace = {
    name: string;
    href: string;
    repositoryStatus: string;
}
type WorkspaceDTO = {
    name: string;
    href: string;
    status: string;
}

const fromWorkspaceDTO = (workspace: Workspace): WorkspaceDTO => {
    const payload = {
        name: workspace.name,
        href: workspace.href,
        status: workspace.repositoryStatus
    };

    return payload;
}


