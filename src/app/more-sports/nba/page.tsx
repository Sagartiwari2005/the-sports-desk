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
        *[_type == "article" && sport == "basketball" && defined(publishedAt)]
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

export default async function NBAPage() {
    const articles = await getArticles();
    const lead = articles[0];
    const remaining = articles.slice(1);

    return (
        <main className="analysis-page nba-page">
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

            {/* NBA introduction */}
            <section className="analysis-intro nba-intro">
                <span className="analysis-kicker">
                    THE NBA DESK / EST. 2026
                </span>

                <h2>
                    The game
                    <br />
                    <span>never stands still.</span>
                </h2>

                <p>
                    From the first tip to the final buzzer, basketball is
                    built on talent, pressure and personality. We follow
                    the players, rivalries and ideas shaping the league.
                </p>

                <a className="nba-back-link" href="/more-sports">
                    ← BACK TO MORE SPORTS
                </a>
            </section>

            {/* NBA stories */}
            <section className="analysis-content nba-content">
                <div className="analysis-section-heading">
                    <h2>THE NBA DESK</h2>
                    <span>{articles.length} PUBLISHED STORIES</span>
                </div>

                {!lead ? (
                    <div className="analysis-empty">
                        <span>THE NEXT BIG PLAY</span>
                        <h3>Every possession has a story.</h3>
                        <p>
                            Our NBA news, player features, rivalries and
                            basketball analysis will appear here as they
                            are published.
                        </p>
                    </div>
                ) : (
                    <>
                        <article className="analysis-lead nba-lead">
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
                                        THE NBA DESK
                                    </div>
                                )}

                                <span>THE LEAD STORY / NBA</span>
                            </a>

                            <div className="analysis-lead-info">
                                <span className="analysis-category">
                                    {lead.category || "NBA"}
                                </span>

                                <span className="analysis-date">
                                    {formatDate(lead.publishedAt)}
                                </span>

                                <h3>{lead.title}</h3>

                                <p>
                                    {lead.excerpt ||
                                        lead.subtitle ||
                                        "The latest story from the NBA desk."}
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
                            <div className="analysis-more nba-more">
                                <div className="analysis-section-heading">
                                    <h2>MORE FROM THE NBA</h2>
                                    <span>AROUND THE LEAGUE</span>
                                </div>

                                <div className="analysis-grid">
                                    {remaining.map((article) => {
                                        const image = imageUrl(article.mainImage);

                                        return (
                                            <article
                                                className="analysis-card nba-card"
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
                                                                THE NBA DESK
                                                            </div>
                                                        )}
                                                    </div>

                                                    <div className="analysis-card-meta">
                                                        <span>
                                                            {article.category || "NBA"}
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
                                                            "Read the latest NBA coverage."}
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

            <footer className="analysis-footer nba-footer">
                <span>THE SPORTS DESK / NBA</span>
                <span>EVERY POSSESSION. EVERY MOMENT. EVERY STORY.</span>
            </footer>
        </main>
    );
}