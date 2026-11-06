// Who may see what. Pure and unit-tested; every paper route and page goes through these.
//
// - Signed-out visitors: sitting METADATA of the public index only (unit, series, which documents exist).
// - Signed-in students: files, page images and parsed questions of public-index sittings, plus their own uploads.
// - Private uploads are visible to their owner only (not even admins: they may contain a student's own notes).

export type Viewer = { id: string; role: "STUDENT" | "ADMIN" } | null;
export type SittingAccess = { ownerId: string | null };

export function canViewSittingContent(viewer: Viewer, sitting: SittingAccess) {
    if (!viewer) return false;
    return sitting.ownerId === null || sitting.ownerId === viewer.id;
}

/** Editing parsed questions: the owner of an upload, or an admin for public-index papers. */
export function canEditSittingQuestions(viewer: Viewer, sitting: SittingAccess) {
    if (!viewer) return false;
    if (sitting.ownerId !== null) return sitting.ownerId === viewer.id;
    return viewer.role === "ADMIN";
}

/** HTTP status for a denied content request: 401 signed out, 404 for someone else's private upload (no probing). */
export function deniedStatus(viewer: Viewer): 401 | 404 {
    return viewer ? 404 : 401;
}
