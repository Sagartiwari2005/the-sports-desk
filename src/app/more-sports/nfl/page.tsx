import { client } from "../../sanity/client";
import imageUrlBuilder from "@sanity/image-url";
import { projectId, dataset } from "../../sanity/env";

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
        *[_type == "article" && sport == "nfl" && defined(publishedAt)]
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

export default async function NFLPage() {
    const articles = await getArticles();
    const lead = articles[0];
    const remaining = articles.slice(1);

    return (
        <main className="analysis-page nfl-page">
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

            {/* NFL introduction */}
            <section className="analysis-intro nfl-intro">
                <span className="analysis-kicker">
                    THE NFL DESK / EST. 2026
                </span>

                <h2>
                    Every yard
                    <br />
                    <span>has a story.</span>
                </h2>

                <p>
                    The hits, the strategy, the rivalries and the pressure
                    of the biggest moments. We look beyond the scoreboard
                    to explore what makes American football matter.
                </p>

                <a className="nfl-back-link" href="/more-sports">
                    ← BACK TO MORE SPORTS
                </a>
            </section>

            {/* NFL stories */}
            <section className="analysis-content nfl-content">
                <div className="analysis-section-heading">
                    <h2>THE NFL DESK</h2>
                    <span>{articles.length} PUBLISHED STORIES</span>
                </div>

                {!lead ? (
                    <div className="analysis-empty">
                        <span>THE NEXT SNAPSHOT</span>
                        <h3>
                            Every game has a moment that changes everything.
                        </h3>
                        <p>
                            Our NFL news, features, analysis and player
                            stories will appear here as they are published.
                        </p>
                    </div>
                ) : (
                    <>
                        <article className="analysis-lead nfl-lead">
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
                                        THE NFL DESK
                                    </div>
                                )}

                                <span>THE LEAD STORY / NFL</span>
                            </a>

                            <div className="analysis-lead-info">
                                <span className="analysis-category">
                                    {lead.category || "NFL"}
                                </span>

                                <span className="analysis-date">
                                    {formatDate(lead.publishedAt)}
                                </span>

                                <h3>{lead.title}</h3>

                                <p>
                                    {lead.excerpt ||
                                        lead.subtitle ||
                                        "The latest story from the NFL desk."}
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
                            <div className="analysis-more nfl-more">
                                <div className="analysis-section-heading">
                                    <h2>MORE FROM THE NFL</h2>
                                    <span>AROUND THE LEAGUE</span>
                                </div>

                                <div className="analysis-grid">
                                    {remaining.map((article) => {
                                        const image = imageUrl(article.mainImage);

                                        return (
                                            <article
                                                className="analysis-card nfl-card"
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
                                                                THE NFL DESK
                                                            </div>
                                                        )}
                                                    </div>

                                                    <div className="analysis-card-meta">
                                                        <span>
                                                            {article.category || "NFL"}
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
                                                            "Read the latest NFL coverage."}
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

            <footer className="analysis-footer nfl-footer">
                <span>THE SPORTS DESK / NFL</span>
                <span>EVERY YARD. EVERY MOMENT. EVERY STORY.</span>
            </footer>
        </main>
    );
}