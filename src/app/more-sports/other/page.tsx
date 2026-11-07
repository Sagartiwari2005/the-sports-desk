import { client } from "../../sanity/client";
import imageUrlBuilder from "@sanity/image-url";
import { projectId, dataset } from "../../sanity/env";

export const revalidate = 60;

const builder = imageUrlBuilder({
    projectId,
    dataset,
});

function imageUrl(source: any) {
    if (!source) return null;

    return builder.image(source).width(1200).auto("format").url();
}

type Article = {
    _id: string;
    title: string;
    slug: { current: string };
    subtitle?: string;
    excerpt?: string;
    category?: string;
    author?: string;
    publishedAt?: string;
    mainImage?: any;
};

async function getArticles(): Promise<Article[]> {
    return client.fetch(`
        *[_type == "article" && sport == "other" && defined(publishedAt)]
        | order(publishedAt desc) {
            _id,
            title,
            subtitle,
            "slug": slug,
            excerpt,
            category,
            author,
            publishedAt,
            mainImage
        }
    `);
}

function formatDate(date?: string) {
    if (!date) return "RECENTLY PUBLISHED";

    return new Date(date).toLocaleDateString("en-US", {
        month: "long",
        day: "numeric",
        year: "numeric",
    });
}

const sports = [
    {
        number: "01",
        name: "TENNIS",
        description:
            "Rivalries, Grand Slams and the fight for every point.",
    },
    {
        number: "02",
        name: "FORMULA 1",
        description:
            "Speed, engineering, strategy and the people behind the wheel.",
    },
    {
        number: "03",
        name: "ATHLETICS",
        description:
            "Human limits, world records and extraordinary performances.",
    },
    {
        number: "04",
        name: "GOLF & MORE",
        description:
            "Precision, patience and the wider sporting world.",
    },
];

export default async function OtherSportsPage() {
    const articles = await getArticles();
    const lead = articles[0];
    const remaining = articles.slice(1);

    return (
        <main className="analysis-page other-sports-page">
            {/* Shared Sports Desk header */}
            <div className="top-bar">
                <div className="container top-bar-inner">
                    <span>INDEPENDENT SPORTS JOURNALISM</span>
                    <span>MORE THAN THE GAME. MORE THAN THE SCORE.</span>
                </div>
            </div>

            <header className="football-masthead">
                <div className="container football-masthead-inner">
                    <a href="/" className="football-brand">
                        <span>THE SPORTS DESK</span>
                        <strong>INDEPENDENT SPORTS JOURNALISM</strong>
                    </a>

                    <div className="football-edition">
                        <span>THE MATCHDAY CHRONICLE</span>
                        <strong>THE INDEPENDENT EDITION</strong>
                        <small>MORE THAN THE GAME. MORE THAN THE SCORE.</small>
                    </div>
                </div>
            </header>

            <nav className="main-nav" aria-label="Main navigation">
                <div className="container nav-inner">
                    <div className="nav-links">
                        <a href="/">HOME</a>
                        <a href="/football">FOOTBALL</a>
                        <a href="/latest">LATEST</a>
                        <a href="/analysis">ANALYSIS</a>
                        <a href="/opinion">OPINION</a>
                        <a href="/about">ABOUT</a>
                        <a className="nav-active" href="/more-sports">
                            MORE SPORTS
                        </a>
                    </div>

                    <a href="/#newsletter" className="nav-subscribe">
                        OUR NEWSLETTER ↗
                    </a>
                </div>
            </nav>

            {/* Other Sports introduction */}
            <section className="analysis-intro other-intro">
                <span className="analysis-kicker">
                    THE WIDER SPORTS DESK / EST. 2026
                </span>

                <h2>
                    The world is
                    <br />
                    <span>bigger than the game.</span>
                </h2>

                <p>
                    From the precision of tennis to the speed of Formula 1,
                    from the endurance of athletics to the strategy of golf.
                    We explore the sports, people and moments that deserve
                    a place in the conversation.
                </p>

                <a className="other-back-link" href="/more-sports">
                    ← BACK TO MORE SPORTS
                </a>
            </section>

            {/* Sporting directory */}
            <section className="other-sports-directory">
                <div className="other-directory-heading">
                    <div>
                        <span>THE SPORTING WORLD</span>
                        <h2>BEYOND THE MAIN EVENT.</h2>
                    </div>

                    <span>MORE TO DISCOVER / 2026</span>
                </div>

                <div className="other-sports-list">
                    {sports.map((sport) => (
                        <article
                            className="other-sport-item"
                            key={sport.number}
                        >
                            <span className="other-sport-number">
                                {sport.number}
                            </span>

                            <h3>{sport.name}</h3>

                            <p>{sport.description}</p>
                        </article>
                    ))}
                </div>
            </section>

            {/* Other sports articles */}
            <section className="analysis-content other-content">
                <div className="analysis-section-heading">
                    <h2>THE OTHER SPORTS DESK</h2>
                    <span>{articles.length} PUBLISHED STORIES</span>
                </div>

                {!lead ? (
                    <div className="analysis-empty">
                        <span>THE NEXT GREAT STORY</span>
                        <h3>
                            There is always another sport worth watching.
                        </h3>
                        <p>
                            Our coverage of tennis, Formula 1, athletics,
                            golf and other sports will appear here as
                            stories are published.
                        </p>
                    </div>
                ) : (
                    <>
                        <article className="analysis-lead other-lead">
                            <a
                                href={`/articles/${lead.slug.current}`}
                                className="analysis-lead-image"
                            >
                                {lead.mainImage ? (
                                    <img
                                        src={imageUrl(lead.mainImage) || ""}
                                        alt={lead.mainImage?.alt || lead.title}
                                    />
                                ) : (
                                    <div className="analysis-placeholder">
                                        THE SPORTS DESK
                                    </div>
                                )}

                                <span>THE LEAD STORY / OTHER SPORTS</span>
                            </a>

                            <div className="analysis-lead-info">
                                <span className="analysis-category">
                                    {lead.category || "OTHER SPORTS"}
                                </span>

                                <span className="analysis-date">
                                    {formatDate(lead.publishedAt)}
                                </span>

                                <h3>{lead.title}</h3>

                                <p>
                                    {lead.excerpt ||
                                        lead.subtitle ||
                                        "The latest story from the wider sporting world."}
                                </p>

                                <a
                                    href={`/articles/${lead.slug.current}`}
                                    className="analysis-read-more"
                                >
                                    READ THE STORY ↗
                                </a>
                            </div>
                        </article>

                        {remaining.length > 0 && (
                            <div className="analysis-more other-more">
                                <div className="analysis-section-heading">
                                    <h2>MORE STORIES</h2>
                                    <span>BEYOND THE EXPECTED</span>
                                </div>

                                <div className="analysis-grid">
                                    {remaining.map((article) => {
                                        const image = imageUrl(article.mainImage);

                                        return (
                                            <article
                                                className="analysis-card other-card"
                                                key={article._id}
                                            >
                                                <a
                                                    href={`/articles/${article.slug.current}`}
                                                >
                                                    <div className="analysis-card-image">
                                                        {image ? (
                                                            <img
                                                                src={image}
                                                                alt={
                                                                    article.mainImage?.alt ||
                                                                    article.title
                                                                }
                                                            />
                                                        ) : (
                                                            <div className="analysis-placeholder">
                                                                THE SPORTS DESK
                                                            </div>
                                                        )}
                                                    </div>

                                                    <div className="analysis-card-meta">
                                                        <span>
                                                            {article.category ||
                                                                "OTHER SPORTS"}
                                                        </span>

                                                        <span>
                                                            {formatDate(
                                                                article.publishedAt
                                                            )}
                                                        </span>
                                                    </div>

                                                    <h3>{article.title}</h3>

                                                    <p>
                                                        {article.excerpt ||
                                                            article.subtitle ||
                                                            "Discover the latest story from the wider sporting world."}
                                                    </p>

                                                    <span className="analysis-read-more">
                                                        READ STORY ↗
                                                    </span>
                                                </a>
                                            </article>
                                        );
                                    })}
                                </div>
                            </div>
                        )}
                    </>
                )}
            </section>

            <footer className="analysis-footer other-footer">
                <span>THE SPORTS DESK / OTHER SPORTS</span>
                <span>THE WORLD IS BIGGER THAN THE GAME.</span>
            </footer>
        </main>
    );
}