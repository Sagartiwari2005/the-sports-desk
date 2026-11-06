
import { client } from "../sanity/client";
import imageUrlBuilder from "@sanity/image-url";
import { projectId, dataset } from "../sanity/env";

const imageBuilder = imageUrlBuilder({
    projectId,
    dataset,
});

type FootballArticle = {
    _id: string;
    title: string;
    subtitle?: string;
    slug: string;
    author?: string;
    category?: string;
    section?: string;
    excerpt?: string;
    publishedAt?: string;
    mainImage?: {
        asset?: {
            _ref?: string;
        };
    };
    featured?: boolean;
};

function getImageUrl(image?: FootballArticle["mainImage"]) {
    if (!image?.asset?._ref) return undefined;

    return imageBuilder
        .image(image)
        .width(1400)
        .quality(85)
        .auto("format")
        .url();
}

function formatDate(date?: string) {
    if (!date) return "RECENTLY PUBLISHED";

    return new Date(date).toLocaleDateString("en-US", {
        month: "long",
        day: "numeric",
        year: "numeric",
    });
}

async function getFootballArticles(): Promise<FootballArticle[]> {
    return client.fetch(
        `*[_type == "article" && defined(publishedAt) && sport == "football"]
        | order(publishedAt desc) {
            _id,
            title,
            subtitle,
            "slug": slug.current,
            author,
            category,
            section,
            excerpt,
            publishedAt,
            mainImage,
            featured
        }`
    );
}

function SectionLabel({
    children,
}: {
    children: React.ReactNode;
}) {
    return <span className="football-eyebrow">{children}</span>;
}

export default async function FootballPage() {
    const articles = await getFootballArticles();

    const featuredArticle =
        articles.find((article) => article.featured) ??
        articles[0] ??
        null;

    const remainingArticles = articles.filter(
        (article) => article._id !== featuredArticle?._id
    );

    const latestArticles = remainingArticles.slice(0, 4);

    const featuredImage = getImageUrl(featuredArticle?.mainImage);

    return (
        <main className="football-page">

            {/* TOP PUBLICATION STRIP */}
            <div className="top-bar">
                <div className="container top-bar-inner">
                    <span>THE SPORTS DESK</span>
                    <span>THE FOOTBALL EDITION</span>
                </div>
            </div>

            {/* FOOTBALL MASTHEAD */}
            <header className="football-masthead">
                <div className="container football-masthead-inner">

                    <a href="/" className="football-brand">
                        <span>THE SPORTS DESK</span>
                        <strong>FOOTBALL</strong>
                    </a>

                    <div className="football-edition">
                        <span>THE MATCHDAY CHRONICLE</span>
                        <strong>INDEPENDENT FOOTBALL JOURNALISM</strong>
                        <small>MORE THAN THE GAME. MORE THAN THE SCORE.</small>
                    </div>

                </div>
            </header>

            {/* NAVIGATION */}
            <nav className="main-nav" aria-label="Main navigation">
                <div className="container nav-inner">
                    <div className="nav-links">
                        <a href="/">HOME</a>
                        <a href="/football" className="nav-active">FOOTBALL</a>
                        <a href="/latest">LATEST</a>
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

            {/* EDITORIAL INTRODUCTION */}
            <section className="container football-intro">
                <div>
                    <SectionLabel>THE FOOTBALL DESK / EST. 2026</SectionLabel>

                    <h1>
                        The beautiful game.
                        <br />
                        <span>Beyond the beautiful game.</span>
                    </h1>

                    <p>
                        The stories, people, decisions and ideas that make
                        football more than ninety minutes on a pitch.
                    </p>
                </div>

                <div className="football-intro-mark">
                    <span>F</span>
                    <small>THE FOOTBALL EDITION</small>
                </div>
            </section>

            {/* LEAD STORY */}
            {featuredArticle ? (
                <section className="container football-lead">

                    <div className="football-lead-image">
                        <a href={`/articles/${featuredArticle.slug}`}>
                            {featuredImage ? (
                                <img
                                    src={featuredImage}
                                    alt={featuredArticle.title}
                                />
                            ) : (
                                <div className="football-image-placeholder">
                                    THE MATCHDAY CHRONICLE
                                </div>
                            )}

                            <span className="football-image-tag">
                                THE LEAD STORY
                            </span>
                        </a>
                    </div>

                    <div className="football-lead-copy">
                        <SectionLabel>
                            {featuredArticle.category || "FOOTBALL"}
                        </SectionLabel>

                        <h2>
                            <a href={`/articles/${featuredArticle.slug}`}>
                                {featuredArticle.title}
                            </a>
                        </h2>

                        <p>
                            {featuredArticle.excerpt ||
                                featuredArticle.subtitle ||
                                "Discover the story behind the game."}
                        </p>

                        <div className="football-story-meta">
                            <span>
                                BY {featuredArticle.author || "THE SPORTS DESK"}
                            </span>
                            <span>{formatDate(featuredArticle.publishedAt)}</span>
                        </div>

                        <a
                            href={`/articles/${featuredArticle.slug}`}
                            className="football-read-link"
                        >
                            READ THE FULL STORY →
                        </a>
                    </div>

                </section>
            ) : (
                <section className="container football-empty">
                    <SectionLabel>THE FIRST WHISTLE</SectionLabel>
                    <h2>Our football coverage starts here.</h2>
                    <p>
                        We're preparing stories that look beyond the
                        scoreline. Check back soon.
                    </p>
                </section>
            )}

            {/* LATEST FOOTBALL STORIES */}
            <section className="container football-latest">

                <div className="football-section-heading">
                    <div>
                        <SectionLabel>FROM THE FOOTBALL DESK</SectionLabel>
                        <h2>More from the game.</h2>
                    </div>

                    <span>THE FOOTBALL EDITION / 001</span>
                </div>

                {latestArticles.length > 0 ? (
                    <div className="football-story-grid">
                        {latestArticles.map((article, index) => {
                            const image = getImageUrl(article.mainImage);

                            return (
                                <article
                                    className="football-story-card"
                                    key={article._id}
                                >
                                    <a
                                        href={`/articles/${article.slug}`}
                                        className="football-card-image"
                                    >
                                        {image ? (
                                            <img
                                                src={image}
                                                alt={article.title}
                                            />
                                        ) : (
                                            <div className="football-image-placeholder">
                                                THE SPORTS DESK
                                            </div>
                                        )}

                                        <span>0{index + 1}</span>
                                    </a>

                                    <div className="football-card-copy">
                                        <SectionLabel>
                                            {article.category || "FOOTBALL"}
                                        </SectionLabel>

                                        <h3>
                                            <a href={`/articles/${article.slug}`}>
                                                {article.title}
                                            </a>
                                        </h3>

                                        <p>
                                            {article.excerpt ||
                                                article.subtitle ||
                                                ""}
                                        </p>

                                        <div className="football-card-footer">
                                            <span>
                                                {formatDate(article.publishedAt)}
                                            </span>
                                            <a href={`/articles/${article.slug}`}>
                                                READ STORY ↗
                                            </a>
                                        </div>
                                    </div>
                                </article>
                            );
                        })}
                    </div>
                ) : (
                    <p className="football-no-stories">
                        More football stories are on their way.
                    </p>
                )}

            </section>

            {/* EDITORIAL STATEMENT */}
            <section className="football-editorial">
                <div className="container football-editorial-inner">
                    <span className="football-quote-mark">“</span>

                    <div>
                        <SectionLabel>OUR FOOTBALL PHILOSOPHY</SectionLabel>

                        <h2>
                            The score tells you
                            <br />
                            <span>what happened.</span>
                            <br />
                            The story tells you why.
                        </h2>
                    </div>
                </div>
            </section>

            {/* FOOTBALL FOOTER */}
            <footer className="site-footer">
                <div className="container footer-bottom">
                    <span>© 2026 THE SPORTS DESK.</span>
                    <span>INDEPENDENT BY NATURE. CURIOUS BY DESIGN.</span>
                </div>
            </footer>

        </main>
    );
}
