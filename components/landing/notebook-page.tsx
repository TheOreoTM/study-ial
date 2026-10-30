import { CoffeeRing, InkArrow, InkCircle, InkTick, InkUnderline } from "./ink";

// Static illustration of the product (not live data): a unit's topics, marked up the way a teacher would.
const topics = [
    { code: "1.1", name: "Motion and kinematics", score: 86 },
    { code: "1.3", name: "Momentum", score: 71 },
    { code: "1.5", name: "Density, upthrust and viscosity", score: 38, weakest: true },
    { code: "1.6", name: "Hooke's law, stress and strain", score: 64 },
];

const delay = (s: number) => ({ ["--ink-delay" as string]: `${s}s` });

export function NotebookPage() {
    return (
        <div className="relative">
            {/* Lamp light pooling behind the page */}
            <div
                aria-hidden
                className="pointer-events-none absolute -inset-x-24 -inset-y-28 -z-10 bg-[radial-gradient(closest-side,rgb(255_205_135/0.7),rgb(255_196_120/0.28)_50%,transparent)]"
            />
            <figure
                aria-label="Example: a unit's topics marked by strength, with the weakest mark circled as the next thing to revise"
                className="relative mx-auto w-full max-w-[36rem] -rotate-1 overflow-hidden rounded-[14px] bg-paper shadow-[0_10px_30px_rgb(90_60_30/0.12)]"
            >
                {/* Margin rule */}
                <div aria-hidden className="absolute inset-y-0 left-10 w-px bg-margin sm:left-14" />

                <div className="ruled pt-[2.25rem] pb-[2.25rem]">
                    {/* Shift content down so text sits on the rules rather than between them */}
                    <div className="relative translate-y-[0.5rem] pr-5 pl-14 sm:pr-8 sm:pl-[4.75rem]">
                        <div className="flex items-baseline justify-between gap-4">
                            <p className="font-book text-[1.05rem] font-bold text-ink">WPH11</p>
                            <p className="relative shrink-0 font-hand text-[1.7rem] leading-none font-semibold text-pen-deep">
                                <span className="ink-fade" style={delay(0.2)}>
                                    Exam in 74 days
                                </span>
                                <InkUnderline double delay={0.5} className="absolute -bottom-2 left-0 h-2.5 w-full" />
                            </p>
                        </div>
                        <p className="font-book text-[1.05rem] text-pencil">Mechanics and Materials</p>

                        <ol className="mt-[2.25rem]">
                            {topics.map((t, i) => {
                                const good = t.score >= 70;
                                return (
                                    <li
                                        key={t.code}
                                        className="grid grid-cols-[2.25rem_1fr_4.75rem] items-baseline gap-x-2"
                                    >
                                        <span className="font-book text-sm text-pencil tabular-nums">{t.code}</span>
                                        <span className="font-book text-[1rem] text-ink">{t.name}</span>
                                        <span
                                            className={
                                                "relative flex items-baseline justify-end gap-1 font-hand text-[1.7rem] leading-none font-semibold tabular-nums " +
                                                (good
                                                    ? "text-sage-deep"
                                                    : t.weakest
                                                      ? "text-pen-deep"
                                                      : "text-graphite")
                                            }
                                        >
                                            <span className="ink-fade" style={delay(0.7 + i * 0.18)}>
                                                {t.score}%
                                            </span>
                                            {good ? (
                                                <InkTick
                                                    delay={0.85 + i * 0.18}
                                                    className="size-4 self-center text-sage"
                                                />
                                            ) : (
                                                <span className="size-4" />
                                            )}
                                            {t.weakest && (
                                                <InkCircle
                                                    delay={1.6}
                                                    className="pointer-events-none absolute top-1/2 right-0.5 h-11 w-[4.9rem] -translate-y-1/2"
                                                />
                                            )}
                                        </span>
                                    </li>
                                );
                            })}
                        </ol>

                        {/* Margin note pointing back up at the circled mark */}
                        <div className="relative mt-[2.25rem] pr-14 font-hand text-[1.7rem] leading-[2.25rem] font-semibold text-pen-deep">
                            <p className="ink-fade" style={delay(2.2)}>
                                Next up: density, upthrust and viscosity. 10 questions.
                            </p>
                            <InkArrow
                                delay={1.95}
                                className="absolute -top-[4.95rem] right-[4.4rem] hidden h-[4.95rem] w-11 sm:block"
                            />
                        </div>
                    </div>
                </div>
                <CoffeeRing className="absolute -top-14 -left-16 size-44 -rotate-6" />
            </figure>
        </div>
    );
}
