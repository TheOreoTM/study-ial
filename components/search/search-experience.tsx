"use client";

import { useCallback, useDeferredValue, useEffect, useId, useMemo, useRef, useState, useSyncExternalStore } from "react";
import { useRouter } from "next/navigation";
import {
    BarChart3,
    BookOpen,
    CalendarCheck,
    CalendarDays,
    ClipboardList,
    CornerDownLeft,
    FileQuestion,
    Layers,
    LayoutDashboard,
    Link2,
    LogIn,
    NotebookPen,
    RotateCcw,
    Search,
    Settings,
    Shield,
    Target,
    Timer,
    UserPlus,
    type LucideIcon,
} from "lucide-react";
import { MasteryTile } from "@/components/mastery";
import { UnitChip } from "@/components/plans/unit-chip";
import { masteryLabel, masteryTone, type MasteryLevel } from "@/lib/mastery";
import {
    groupHits,
    highlight,
    KIND_LABEL,
    plainSnippet,
    prepareDocs,
    searchPrepared,
    tokenize,
    type PersonalSearch,
    type SearchDoc,
    type SearchHit,
    type SearchKind,
} from "@/lib/search";
import { commandDocs } from "@/lib/search-commands";
import {
    addRecent,
    loadRecents,
    parseRecents,
    readRecentsRaw,
    saveRecents,
    subscribeRecents,
    type RecentPick,
} from "@/lib/search-recents";
import { cn } from "@/lib/utils";
import { loadPersonalSearch, loadSearchIndex } from "./search-data";

type Mastery = { level: MasteryLevel; score: number | null };

const PAGE_ICONS: Record<string, LucideIcon> = {
    "page:today": LayoutDashboard,
    "page:subjects": BookOpen,
    "page:weak": Target,
    "page:mistakes": NotebookPen,
    "page:redo": RotateCcw,
    "page:mock": ClipboardList,
    "page:exams": CalendarDays,
    "page:progress": BarChart3,
    "page:flashcards": Layers,
    "page:review": Layers,
    "page:plans": CalendarCheck,
    "page:new-plan": CalendarCheck,
    "page:community": CalendarCheck,
    "page:focus": Timer,
    "page:settings": Settings,
    "page:share": Link2,
    "page:admin": Shield,
    "page:admin-cards": Shield,
    "page:sign-in": LogIn,
    "page:sign-up": UserPlus,
};

const PER_KIND = {
    palette: { page: 4, topic: 7, unit: 4, subject: 3, question: 5, mock: 3 },
    page: { page: 4, topic: 20, unit: 8, subject: 5, question: 10, mock: 5 },
} satisfies Record<string, Partial<Record<SearchKind, number>>>;

/**
 * Live search, shared by the ⌘K palette and the /search page. Everything runs on this device: the curriculum index
 * and (when signed in) the student's own index load once, and every keystroke is a local scan (well under 16 ms), so
 * results never wait for the network. ↑↓ move, Enter opens, ⌘/Ctrl+Enter runs the quick action (Practise).
 */
export function SearchExperience({
    variant,
    signedIn,
    isAdmin,
    initialQuery = "",
    initialMastery,
    seedDocs,
    onNavigate,
    onQueryChange,
}: {
    variant: "palette" | "page";
    signedIn: boolean;
    isAdmin: boolean;
    initialQuery?: string;
    /** Server-rendered mastery so the page doesn't wait for the personal index to colour topics */
    initialMastery?: Record<string, Mastery>;
    /** Server-found documents for the initial query, shown until the full index arrives (and without JavaScript) */
    seedDocs?: SearchDoc[];
    /** Called after a result is opened (the palette closes itself) */
    onNavigate?: () => void;
    /** Called as the query changes (the page keeps its URL in step) */
    onQueryChange?: (q: string) => void;
}) {
    const router = useRouter();
    const listId = useId();
    const [query, setQuery] = useState(initialQuery);
    const deferred = useDeferredValue(query);
    const [docs, setDocs] = useState<SearchDoc[] | null>(null);
    const [personal, setPersonal] = useState<PersonalSearch | null>(null);
    const [failed, setFailed] = useState(false);
    // Device-only values come from external stores, so the server render (no storage, no platform) stays consistent.
    const recentsRaw = useSyncExternalStore(subscribeRecents, readRecentsRaw, () => null);
    const recents = useMemo(() => parseRecents(recentsRaw), [recentsRaw]);
    const mod = useSyncExternalStore(noSubscribe, platformModifier, () => "Ctrl");
    const [active, setActive] = useState(0);
    const listRef = useRef<HTMLDivElement>(null);
    const inputRef = useRef<HTMLInputElement>(null);

    useEffect(() => {
        let cancelled = false;
        loadSearchIndex()
            .then((d) => !cancelled && setDocs(d))
            .catch(() => !cancelled && setFailed(true));
        if (signedIn) {
            loadPersonalSearch()
                .then((p) => !cancelled && setPersonal(p))
                .catch(() => {});
        }
        return () => {
            cancelled = true;
        };
    }, [signedIn]);

    // Pages are searchable straight away; the curriculum and personal results join when they arrive.
    const prepared = useMemo(() => {
        const curriculum = (docs ?? seedDocs ?? []).map((d) =>
            signedIn && d.kind === "topic" ? { ...d, action: { label: "Practise", href: `/practice?topic=${d.id}` } } : d,
        );
        return prepareDocs([...commandDocs({ signedIn, isAdmin }), ...curriculum, ...(personal?.docs ?? [])]);
    }, [docs, seedDocs, personal, signedIn, isAdmin]);

    const mastery: Record<string, Mastery> = useMemo(
        () => ({ ...initialMastery, ...(personal?.mastery ?? {}) }),
        [initialMastery, personal],
    );
    const topicById = useMemo(() => new Map((docs ?? []).filter((d) => d.kind === "topic").map((d) => [d.id, d])), [docs]);

    const trimmed = deferred.trim();
    const tokens = useMemo(() => tokenize(trimmed), [trimmed]);
    const groups = useMemo(() => {
        if (trimmed) return groupHits(searchPrepared(prepared, trimmed, 80), PER_KIND[variant]);
        // Nothing typed: recent picks, then the topics practised most recently.
        const out: { kind: SearchKind | "recent" | "resume"; hits: SearchHit[] }[] = [];
        if (recents.length) {
            // A recent pick shows the live document when it still exists (current mastery, quick action).
            const byHref = new Map(prepared.map((p) => [p.doc.href, p.doc]));
            out.push({
                kind: "recent",
                hits: recents.map((r) => ({
                    doc: byHref.get(r.href) ?? {
                        kind: r.kind,
                        id: `recent:${r.href}`,
                        href: r.href,
                        name: r.name,
                        context: r.context,
                        code: r.code ?? "",
                    },
                    score: 0,
                    point: null,
                })),
            });
        }
        const resume = (personal?.recentTopicIds ?? [])
            .map((id) => topicById.get(id))
            .filter((d): d is SearchDoc => !!d && !recents.some((r) => r.href === d.href))
            .map((d) => ({
                doc: signedIn ? { ...d, action: { label: "Practise", href: `/practice?topic=${d.id}` } } : d,
                score: 0,
                point: null,
            }));
        if (resume.length) out.push({ kind: "resume", hits: resume });
        return out;
    }, [trimmed, prepared, variant, recents, personal, topicById, signedIn]);

    const flat = useMemo(() => groups.flatMap((g) => g.hits), [groups]);
    const activeHit = flat[Math.min(active, flat.length - 1)];

    useEffect(() => onQueryChange?.(query), [query, onQueryChange]);

    // Prefetch whatever is highlighted, so Enter feels instant.
    useEffect(() => {
        if (!activeHit) return;
        const t = window.setTimeout(() => router.prefetch(activeHit.doc.href), 120);
        return () => window.clearTimeout(t);
    }, [activeHit, router]);

    useEffect(() => {
        listRef.current?.querySelector('[aria-selected="true"]')?.scrollIntoView({ block: "nearest" });
    }, [active]);

    const open = useCallback(
        (hit: SearchHit, { action = false, newTab = false } = {}) => {
            const href = action && hit.doc.action ? hit.doc.action.href : hit.doc.href;
            const pick: RecentPick = {
                href: hit.doc.href,
                name: hit.doc.name,
                context: hit.doc.context,
                kind: hit.doc.kind,
                code: hit.doc.code || undefined,
            };
            saveRecents(addRecent(loadRecents(), pick));
            if (newTab) {
                window.open(href, "_blank", "noopener");
                return;
            }
            router.push(href);
            onNavigate?.();
        },
        [router, onNavigate],
    );

    function onKeyDown(e: React.KeyboardEvent<HTMLInputElement>) {
        if (e.key === "ArrowDown" || e.key === "ArrowUp") {
            e.preventDefault();
            if (!flat.length) return;
            const step = e.key === "ArrowDown" ? 1 : -1;
            setActive((i) => (Math.min(i, flat.length - 1) + step + flat.length) % flat.length);
        } else if (e.key === "Enter" && activeHit) {
            e.preventDefault();
            open(activeHit, { action: e.metaKey || e.ctrlKey, newTab: e.shiftKey });
        }
    }

    const optionId = (i: number) => `${listId}-opt-${i}`;
    const count = trimmed ? flat.length : 0;
    let index = -1;

    return (
        <div className={cn("flex min-h-0 flex-col", variant === "palette" ? "max-h-[min(70dvh,36rem)]" : "")}>
            <form
                role="search"
                action="/search"
                // With JavaScript, results are live and Enter opens the highlighted one; without it, this submits.
                onSubmit={(e) => e.preventDefault()}
                className={cn(
                    "relative flex items-center",
                    variant === "palette" ? "border-b px-4" : "mb-6 max-w-2xl",
                )}
            >
                <Search
                    className={cn(
                        "pointer-events-none size-5 shrink-0 text-muted-foreground",
                        variant === "page" && "absolute left-3.5",
                    )}
                    aria-hidden
                />
                <input
                    ref={inputRef}
                    type="search"
                    name="q"
                    role="combobox"
                    aria-expanded={flat.length > 0}
                    aria-controls={listId}
                    aria-activedescendant={activeHit ? optionId(Math.min(active, flat.length - 1)) : undefined}
                    aria-autocomplete="list"
                    aria-label="Search topics, pages and your questions"
                    autoFocus
                    autoComplete="off"
                    spellCheck={false}
                    enterKeyHint="go"
                    maxLength={100}
                    value={query}
                    onChange={(e) => {
                        setQuery(e.target.value);
                        // A new query starts at the top.
                        setActive(0);
                    }}
                    onKeyDown={onKeyDown}
                    placeholder={signedIn ? "Search topics, pages, your questions…" : "Search topics, units, spec points…"}
                    className={cn(
                        "w-full bg-transparent text-base outline-none placeholder:text-muted-foreground [&::-webkit-search-cancel-button]:hidden",
                        variant === "palette"
                            ? "h-14 pl-3"
                            : "h-12 rounded-md border-[1.5px] border-border-strong bg-card pr-3.5 pl-11 transition-[border-color,box-shadow] duration-200 ease-out-soft hover:border-foreground/60 focus-visible:border-progress focus-visible:ring-3 focus-visible:ring-progress/25",
                    )}
                />
            </form>

            <p className="sr-only" aria-live="polite">
                {trimmed ? `${count} result${count === 1 ? "" : "s"}` : ""}
            </p>

            <div
                ref={listRef}
                id={listId}
                role="listbox"
                aria-label="Results"
                className={cn(variant === "palette" ? "min-h-0 flex-1 overflow-y-auto overscroll-contain p-2" : "grid gap-6")}
            >
                {groups.map((g) => (
                    <div key={g.kind} role="group" aria-labelledby={`${listId}-${g.kind}`} className={variant === "palette" ? "mb-1" : ""}>
                        <p
                            id={`${listId}-${g.kind}`}
                            role="presentation"
                            className={cn(
                                "font-bold text-muted-foreground",
                                variant === "palette" ? "px-2.5 pt-2 pb-1 text-xs" : "mb-2 text-sm",
                            )}
                        >
                            {g.kind === "recent" ? "Recent" : g.kind === "resume" ? "Jump back in" : KIND_LABEL[g.kind]}
                        </p>
                        <div className={variant === "page" ? "grid gap-2" : ""}>
                            {g.hits.map((hit) => {
                                index++;
                                const i = index;
                                return (
                                    <ResultRow
                                        key={`${g.kind}-${hit.doc.id}`}
                                        id={optionId(i)}
                                        hit={hit}
                                        tokens={tokens}
                                        selected={i === Math.min(active, flat.length - 1)}
                                        mastery={hit.doc.kind === "topic" ? mastery[hit.doc.id] : undefined}
                                        variant={variant}
                                        onHover={() => setActive(i)}
                                        onOpen={(opts) => open(hit, opts)}
                                    />
                                );
                            })}
                        </div>
                    </div>
                ))}

                {trimmed && flat.length === 0 && (
                    <div className={cn("px-4 text-center", variant === "palette" ? "py-10" : "rounded-xl bg-muted py-12")}>
                        {docs || seedDocs || failed ? (
                            <>
                                <p className="font-bold">Nothing matches “{trimmed}”</p>
                                <p className="mt-1 text-sm text-muted-foreground">
                                    {failed
                                        ? "Couldn't load the topics. Check your connection and try again."
                                        : "Try fewer words, or a paper code like WPH11."}
                                </p>
                            </>
                        ) : (
                            <p className="text-sm text-muted-foreground">Loading topics…</p>
                        )}
                    </div>
                )}

                {!trimmed && flat.length === 0 && (
                    <p className={cn("px-3 text-sm text-muted-foreground", variant === "palette" ? "py-8 text-center" : "")}>
                        Type to search every subject, unit, topic and specification point
                        {signedIn ? ", your answered questions and mock papers, or a page like “mistakes”." : "."}
                    </p>
                )}
            </div>

            {variant === "palette" && (
                <div className="hidden items-center gap-4 border-t px-4 py-2.5 text-xs text-muted-foreground sm:flex">
                    <span className="flex items-center gap-1.5">
                        <Kbd>↑</Kbd>
                        <Kbd>↓</Kbd> move
                    </span>
                    <span className="flex items-center gap-1.5">
                        <Kbd>
                            <CornerDownLeft className="size-3" aria-label="Enter" />
                        </Kbd>
                        open
                    </span>
                    {signedIn && (
                        <span className="flex items-center gap-1.5">
                            <Kbd>{mod}</Kbd>
                            <Kbd>
                                <CornerDownLeft className="size-3" aria-label="Enter" />
                            </Kbd>
                            practise
                        </span>
                    )}
                    <span className="ml-auto flex items-center gap-1.5">
                        <Kbd>Esc</Kbd> close
                    </span>
                </div>
            )}
        </div>
    );
}

const noSubscribe = () => () => {};
const platformModifier = () => (/Mac|iPhone|iPad/.test(navigator.platform) ? "⌘" : "Ctrl");

function ResultRow({
    id,
    hit,
    tokens,
    selected,
    mastery,
    variant,
    onHover,
    onOpen,
}: {
    id: string;
    hit: SearchHit;
    tokens: string[];
    selected: boolean;
    mastery?: Mastery;
    variant: "palette" | "page";
    onHover: () => void;
    onOpen: (opts?: { action?: boolean; newTab?: boolean }) => void;
}) {
    const { doc, point } = hit;
    const snippet = point ? plainSnippet(point.text, 140) : null;
    const level: MasteryLevel = mastery?.level ?? "new";
    const PageIcon = PAGE_ICONS[doc.id];

    return (
        // An option, not a link: the combobox owns focus and keyboard. Clicks and ⌘/Ctrl-click still work.
        <div
            id={id}
            role="option"
            aria-selected={selected}
            onMouseMove={selected ? undefined : onHover}
            onClick={(e) => onOpen({ newTab: e.metaKey || e.ctrlKey })}
            className={cn(
                "group flex cursor-pointer items-center gap-3 transition-colors duration-100",
                variant === "palette" ? "rounded-lg px-2.5 py-2" : "rounded-lg border bg-card px-4 py-3",
                selected ? (variant === "palette" ? "bg-selected" : "border-border-strong bg-selected") : "",
            )}
        >
            <span className="shrink-0">
                {doc.kind === "topic" ? (
                    <MasteryTile code={doc.code} level={level} size="sm" />
                ) : doc.kind === "unit" ? (
                    <UnitChip code={doc.code} size="sm" className="w-auto" />
                ) : doc.kind === "subject" ? (
                    <span className="grid size-9 place-items-center rounded-[12px] bg-foreground font-display text-[0.8125rem] font-extrabold text-background">
                        {doc.name.slice(0, 2)}
                    </span>
                ) : (
                    <span className="grid size-9 place-items-center rounded-[12px] bg-muted text-muted-foreground">
                        {doc.kind === "question" ? (
                            <FileQuestion className="size-4" aria-hidden />
                        ) : doc.kind === "mock" ? (
                            <ClipboardList className="size-4" aria-hidden />
                        ) : PageIcon ? (
                            <PageIcon className="size-4" aria-hidden />
                        ) : (
                            <Search className="size-4" aria-hidden />
                        )}
                    </span>
                )}
            </span>
            <span className="min-w-0 flex-1">
                <span
                    className={cn(
                        "block font-bold leading-snug",
                        variant === "palette" ? "truncate text-[0.9375rem]" : "",
                        doc.kind === "question" && "font-semibold",
                    )}
                >
                    <Highlighted text={doc.name} tokens={tokens} />
                </span>
                <span className="block truncate text-[0.8125rem] text-muted-foreground">
                    {doc.context}
                    {mastery && mastery.score !== null && (
                        <span className={cn("font-bold", masteryTone[level].text)}>
                            {" "}
                            · {masteryLabel[level]} {Math.round(mastery.score * 100)}%
                        </span>
                    )}
                </span>
                {snippet && (
                    <span className="mt-0.5 block truncate text-[0.8125rem] text-muted-foreground">
                        <span className="font-bold text-foreground">Spec {point!.index + 1}: </span>
                        <Highlighted text={snippet} tokens={tokens} />
                    </span>
                )}
            </span>
            {doc.action && (
                // Keyboards and screen readers reach the action with ⌘/Ctrl+Enter, announced as part of the option;
                // the visible chip below is a mouse target only, because an option can't contain a real button.
                <span className="sr-only">. Press Control Enter to {doc.action.label.toLowerCase()}.</span>
            )}
            {doc.action && selected && (
                // Only on the highlighted row (hovering highlights), so names aren't squeezed on phones.
                <span
                    aria-hidden
                    onClick={(e) => {
                        e.stopPropagation();
                        onOpen({ action: true });
                    }}
                    className="shrink-0 rounded-full bg-card px-3 py-1.5 font-display text-xs font-extrabold text-foreground shadow-[inset_0_0_0_1.5px_var(--border-strong)] transition-colors hover:shadow-[inset_0_0_0_1.5px_var(--foreground)]"
                >
                    {doc.action.label}
                </span>
            )}
        </div>
    );
}

function Highlighted({ text, tokens }: { text: string; tokens: string[] }) {
    return (
        <>
            {highlight(text, tokens).map((s, i) =>
                s.match ? (
                    <mark key={i} className="rounded-[3px] bg-transparent text-selected-foreground underline decoration-2 underline-offset-2">
                        {s.text}
                    </mark>
                ) : (
                    <span key={i}>{s.text}</span>
                ),
            )}
        </>
    );
}

function Kbd({ children }: { children: React.ReactNode }) {
    return (
        <kbd className="inline-grid min-w-5 place-items-center rounded-[6px] bg-muted px-1.5 py-0.5 font-sans text-[0.6875rem] font-bold text-foreground shadow-[inset_0_-1px_0_var(--border-strong)]">
            {children}
        </kbd>
    );
}
