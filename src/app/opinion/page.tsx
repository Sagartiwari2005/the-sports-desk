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
    *[_type == "article" && section == "opinion" && defined(publishedAt)]
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

export default async function OpinionPage() {
    const articles = await getArticles();
    const lead = articles[0];
    const remaining = articles.slice(1);

    return (
        <main className="opinion-page">
            {/* TOP BAR */}
            <div className="top-bar">
                <div className="container top-bar-inner">
                    <span>THE SPORTS DESK</span>
                    <span>VOICES. ARGUMENTS. PERSPECTIVES.</span>
                </div>
            </div>

            {/* MASTHEAD */}
            <header className="football-masthead">
                <div className="container football-masthead-inner">
                    <a href="/" className="football-brand">
                        <span>THE SPORTS DESK</span>
                        <strong>OPINION</strong>
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
                        <a href="/analysis">ANALYSIS</a>
                        <a href="/opinion" className="nav-active">
                            OPINION
                        </a>
                        <a href="/about">ABOUT</a>
                        <a href="/more-sports">MORE SPORTS</a>
                    </div>

                    <a href="/#newsletter" className="nav-subscribe">
                        OUR NEWSLETTER ↗
                    </a>
                </div>
            </nav>

            {/* OPINION INTRO */}
            <section className="opinion-intro">
                <span className="opinion-kicker">
                    THE EDITORIAL ROOM / EST. 2026
                </span>

                <h2>
                    Every game has
                    <br />
                    <span>another side.</span>
                </h2>

                <p>
                    Football is never short of opinions. The decisions,
                    the personalities, the controversies and the moments
                    that divide a stadium. This is where we make our case.
                </p>
            </section>

            {/* OPINION CONTENT */}
            <section className="opinion-content">
                <div className="opinion-section-heading">
                    <h2>THE OPINION DESK</h2>
                    <span>{articles.length} OPINION PIECES</span>
                </div>

                {!lead ? (
                    <div className="opinion-empty">
                        <span>THE FLOOR IS OPEN</span>
                        <h3>Sport is better when we have something to say.</h3>
                        <p>
                            Our columns, arguments and perspectives will
                            appear here as they are published. Not every
                            opinion needs to be popular. It should always
                            give you something to think about.
                        </p>
                    </div>
                ) : (
                    <>
                        {/* LEAD OPINION */}
                        <article className="opinion-lead">
                            <a
                                href={`/articles/${lead.slug.current}`}
                                className="opinion-lead-image"
                            >
                                {lead.mainImage ? (
                                    <img
                                        src={imageUrl(lead.mainImage) || ""}
                                        alt={lead.title}
                                    />
                                ) : (
                                    <div className="opinion-placeholder">
                                        THE OPINION DESK
                                    </div>
                                )}

                                <span>THE LEAD OPINION / 01</span>
                            </a>

                            <div className="opinion-lead-info">
                                <span className="opinion-category">
                                    {lead.category || "OPINION"}
                                </span>

                                <span className="opinion-date">
                                    {formatDate(lead.publishedAt)}
                                </span>

                                <h3>{lead.title}</h3>

                                <p>
                                    {lead.excerpt ||
                                        lead.subtitle ||
                                        "A perspective on the people, decisions and stories shaping sport."}
                                </p>

                                <a
                                    href={`/articles/${lead.slug.current}`}
                                    className="opinion-read-more"
                                >
                                    READ THE OPINION ↗
                                </a>
                            </div>
                        </article>

                        {/* MORE OPINION */}
                        {remaining.length > 0 && (
                            <div className="opinion-more">
                                <div className="opinion-section-heading">
                                    <h2>MORE FROM THE EDITORIAL ROOM</h2>
                                    <span>THE CONVERSATION CONTINUES</span>
                                </div>

                                <div className="opinion-grid">
                                    {remaining.map((article, index) => {
                                        const image = imageUrl(article.mainImage);

                                        return (
                                            <article
                                                className="opinion-card"
                                                key={article._id}
                                            >
                                                <a
                                                    href={`/articles/${article.slug.current}`}
                                                >
                                                    <div className="opinion-card-image">
                                                        {image ? (
                                                            <img
                                                                src={image}
                                                                alt={article.title}
                                                            />
                                                        ) : (
                                                            <div className="opinion-placeholder">
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

                                                    <div className="opinion-card-meta">
                                                        <span>
                                                            {article.category || "OPINION"}
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
                                                            "Read the latest perspective from The Sports Desk."}
                                                    </p>

                                                    <span className="opinion-read-more">
                                                        READ OPINION ↗
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
            <footer className="opinion-footer">
                <span>THE SPORTS DESK</span>
                <span>INDEPENDENT BY NATURE. OPINIONATED BY DESIGN.</span>
            </footer>
        </main>
    );
}