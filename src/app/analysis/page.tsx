import { client } from "../sanity/client";
import imageUrlBuilder from "@sanity/image-url";
import { projectId, dataset } from "../sanity/env";

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
    *[_type == "article" && section == "analysis" && defined(publishedAt)]
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

export default async function AnalysisPage() {
    const articles = await getArticles();
    const lead = articles[0];
    const remaining = articles.slice(1);

    return (
        <main className="analysis-page">
            {/* TOP BAR */}
            <div className="top-bar">
                <div className="container top-bar-inner">
                    <span>THE SPORTS DESK</span>
                    <span>TACTICS. THINKING. PERSPECTIVE.</span>
                </div>
            </div>

            {/* MASTHEAD */}
            <header className="football-masthead">
                <div className="container football-masthead-inner">
                    <a href="/" className="football-brand">
                        <span>THE SPORTS DESK</span>
                        <strong>ANALYSIS</strong>
                    </a>

                    <div className="football-edition">
                        <span>THE MATCHDAY CHRONICLE</span>
                        <strong>INDEPENDENT SPORTS JOURNALISM</strong>
                        <small>MORE THAN THE GAME. MORE THAN THE SCORE.</small>
                    </div>
                </div>
            </header>

            {/* MAIN NAVIGATION */}
            <nav className="main-nav" aria-label="Main navigation">
                <div className="container nav-inner">
                    <div className="nav-links">
                        <a href="/">HOME</a>
                        <a href="/football">FOOTBALL</a>
                        <a href="/latest">LATEST</a>
                        <a href="/analysis" className="nav-active">
                            ANALYSIS
                        </a>
                        <a href="/opinion">OPINION</a>
                        <a href="/about">ABOUT</a>
                        <a href="/more-sports">MORE SPORTS</a>
                    </div>

                    <a href="/#newsletter" className="nav-subscribe">
                        OUR NEWSLETTER ↗
                    </a>
                </div>
            </nav>

            {/* ANALYSIS INTRO */}
            <section className="analysis-intro">
                <span className="analysis-kicker">
                    THE THINKING ROOM / EST. 2026
                </span>

                <h2>
                    Look beyond
                    <br />
                    <span>the obvious.</span>
                </h2>

                <p>
                    Tactics, numbers, decisions and the details that shape
                    the game. We look closer to understand what the score
                    alone cannot explain.
                </p>
            </section>

            {/* ANALYSIS CONTENT */}
            <section className="analysis-content">
                <div className="analysis-section-heading">
                    <h2>THE ANALYSIS DESK</h2>
                    <span>{articles.length} ANALYSIS PIECES</span>
                </div>

                {!lead ? (
                    <div className="analysis-empty">
                        <span>THE NEXT BIG QUESTION</span>
                        <h3>Good analysis starts with a better question.</h3>
                        <p>
                            Our tactical breakdowns and deeper investigations
                            will appear here as they are published.
                        </p>
                    </div>
                ) : (
                    <>
                        {/* LEAD ANALYSIS */}
                        <article className="analysis-lead">
                            <a
                                href={`/articles/${lead.slug.current}`}
                                className="analysis-lead-image"
                            >
                                {lead.mainImage ? (
                                    <img
                                        src={imageUrl(lead.mainImage) || ""}
                                        alt={lead.title}
                                    />
                                ) : (
                                    <div className="analysis-placeholder">
                                        THE ANALYSIS DESK
                                    </div>
                                )}

                                <span>THE LEAD ANALYSIS / 01</span>
                            </a>

                            <div className="analysis-lead-info">
                                <span className="analysis-category">
                                    {lead.category || "TACTICAL ANALYSIS"}
                                </span>

                                <span className="analysis-date">
                                    {formatDate(lead.publishedAt)}
                                </span>

                                <h3>{lead.title}</h3>

                                <p>
                                    {lead.excerpt ||
                                        lead.subtitle ||
                                        "A closer look at the ideas and decisions shaping the game."}
                                </p>

                                <a
                                    href={`/articles/${lead.slug.current}`}
                                    className="analysis-read-more"
                                >
                                    EXPLORE THE ANALYSIS ↗
                                </a>
                            </div>
                        </article>

                        {/* MORE ANALYSIS */}
                        {remaining.length > 0 && (
                            <div className="analysis-more">
                                <div className="analysis-section-heading">
                                    <h2>MORE THINKING</h2>
                                    <span>FROM THE DESK</span>
                                </div>

                                <div className="analysis-grid">
                                    {remaining.map((article, index) => {
                                        const image = imageUrl(article.mainImage);

                                        return (
                                            <article
                                                className="analysis-card"
                                                key={article._id}
                                            >
                                                <a
                                                    href={`/articles/${article.slug.current}`}
                                                >
                                                    <div className="analysis-card-image">
                                                        {image ? (
                                                            <img
                                                                src={image}
                                                                alt={article.title}
                                                            />
                                                        ) : (
                                                            <div className="analysis-placeholder">
                                                                THE SPORTS DESK
                                                            </div>
                                                        )}

                                                        <span>
                                                            {String(index + 2).padStart(
                                                                2,
                                                                "0"
                                                            )}
                                                        </span>
                                                    </div>

                                                    <div className="analysis-card-meta">
                                                        <span>
                                                            {article.category || "ANALYSIS"}
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
                                                            "Read the latest analysis from The Sports Desk."}
                                                    </p>

                                                    <span className="analysis-read-more">
                                                        READ ANALYSIS ↗
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

            {/* FOOTER */}
            <footer className="analysis-footer">
                <span>THE SPORTS DESK</span>
                <span>INDEPENDENT BY NATURE. CURIOUS BY DESIGN.</span>
            </footer>
        </main>
    );
}