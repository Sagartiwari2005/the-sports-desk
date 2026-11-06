import { client } from "../sanity/client";
import imageUrlBuilder from "@sanity/image-url";
import { projectId, dataset } from "../sanity/env";

const builder = imageUrlBuilder({
    projectId,
    dataset,
});

function imageUrl(source: any) {
    if (!source) return null;
    return builder.image(source).width(1000).auto("format").url();
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
    *[_type == "article" && defined(publishedAt)]
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

export default async function LatestPage() {
    const articles = await getArticles();

    return (
        <main className="latest-page">
            {/* TOP BAR — SHARED SITE STRUCTURE */}
            <div className="top-bar">
                <div className="container top-bar-inner">
                    <span>THE SPORTS DESK</span>
                    <span>THE LATEST EDITION</span>
                </div>
            </div>

            {/* MASTHEAD — MATCH FOOTBALL PAGE */}
            <header className="football-masthead">
                <div className="container football-masthead-inner">

                    <a href="/" className="football-brand">
                        <span>THE SPORTS DESK</span>
                        <strong>LATEST STORIES</strong>
                    </a>

                    <div className="football-edition">
                        <span>THE MATCHDAY CHRONICLE</span>
                        <strong>INDEPENDENT SPORTS JOURNALISM</strong>
                        <small>MORE THAN THE GAME. MORE THAN THE SCORE.</small>
                    </div>

                </div>
            </header>

            {/* SHARED MAIN NAVIGATION */}
            <nav className="main-nav" aria-label="Main navigation">
                <div className="container nav-inner">
                    <div className="nav-links">
                        <a href="/">HOME</a>
                        <a href="/football">FOOTBALL</a>
                        <a href="/latest" className="nav-active">
                            LATEST
                        </a>
                        <a href="/analysis">ANALYSIS</a>
                        <a href="/opinion">OPINION</a>
                        <a href="/about">ABOUT</a>
                        <a href="/more-sports">MORE SPORTS</a>
                    </div>

                    <a href="/#newsletter" className="nav-subscribe">
                        OUR NEWSLETTER ↗
                    </a>
                </div>
            </nav>

            {/* PAGE INTRODUCTION */}
            <section className="latest-intro">
                <span className="latest-kicker">
                    THE NEWSROOM / ALL SPORTS
                </span>

                <h2>
                    Every story.
                    <br />
                    <span>Every perspective.</span>
                </h2>

                <p>
                    The latest stories, ideas and conversations from across
                    the sporting world. Beyond the headlines, beyond the score.
                </p>
            </section>

            {/* STORY LISTING */}
            <section className="latest-content">
                <div className="latest-section-heading">
                    <h2>THE LATEST</h2>
                    <span>{articles.length} PUBLISHED STORIES</span>
                </div>

                {articles.length === 0 ? (
                    <div className="latest-empty">
                        <h3>The newsroom is getting ready.</h3>
                        <p>
                            Our latest stories will appear here once published.
                        </p>
                    </div>
                ) : (
                    <div className="latest-grid">
                        {articles.map((article, index) => {
                            const image = imageUrl(article.mainImage);

                            return (
                                <article
                                    className="latest-card"
                                    key={article._id}
                                >
                                    <a
                                        className="latest-card-link"
                                        href={`/articles/${article.slug.current}`}
                                    >
                                        <div className="latest-card-image">
                                            {image ? (
                                                <img
                                                    src={image}
                                                    alt={article.title}
                                                />
                                            ) : (
                                                <div className="latest-image-placeholder">
                                                    THE SPORTS DESK
                                                </div>
                                            )}

                                            <span className="latest-card-number">
                                                {String(index + 1).padStart(2, "0")}
                                            </span>
                                        </div>

                                        <div className="latest-card-info">
                                            <div className="latest-card-meta">
                                                <span>
                                                    {article.category || "SPORTS"}
                                                </span>
                                                <span>
                                                    {formatDate(article.publishedAt)}
                                                </span>
                                            </div>

                                            <h3>{article.title}</h3>

                                            <p>
                                                {article.excerpt ||
                                                    article.subtitle ||
                                                    "Read the latest story from The Sports Desk."}
                                            </p>

                                            <span className="latest-read-more">
                                                READ THE STORY ↗
                                            </span>
                                        </div>
                                    </a>
                                </article>
                            );
                        })}
                    </div>
                )}
            </section>

            {/* FOOTER */}
            <footer className="latest-footer">
                <span>THE SPORTS DESK</span>
                <span>
                    INDEPENDENT BY NATURE. CURIOUS BY DESIGN.
                </span>
            </footer>
        </main>
    );
}