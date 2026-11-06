
import { client } from "../../sanity/client";
import ReadingProgress from "./ReadingProgress";
import { notFound } from "next/navigation";
import { PortableText } from "@portabletext/react";
import type { ReactNode } from "react";

type SanityImage = {
    url?: string;
    alt?: string;
};

type SanityArticle = {
    _id: string;
    title: string;
    subtitle?: string;
    slug: string;
    author?: string;
    category?: string;
    excerpt?: string;
    publishedAt?: string;
    mainImage?: SanityImage;
    body?: unknown[];
};

type RelatedArticle = {
    _id: string;
    title: string;
    slug: string;
    category?: string;
    excerpt?: string;
    mainImage?: SanityImage;
};

async function getArticle(slug: string): Promise<SanityArticle | null> {
    return client.fetch(
        `*[_type == "article" && slug.current == $slug && defined(publishedAt)][0] {
      _id,
      title,
      subtitle,
      "slug": slug.current,
      author,
      category,
      excerpt,
      publishedAt,
      "mainImage": mainImage {
        alt,
        "url": asset->url
      },
      body[] {
        ...,
        _type == "image" => {
          alt,
          "url": asset->url
        }
      }
    }`,
        { slug }
    );
}

async function getRelatedArticles(
    article: SanityArticle
): Promise<RelatedArticle[]> {
    if (!article.category) return [];

    return client.fetch(
        `*[
      _type == "article" &&
      defined(publishedAt) &&
      category == $category &&
      _id != $articleId
    ]
    | order(publishedAt desc)[0...3] {
      _id,
      title,
      "slug": slug.current,
      category,
      excerpt,
      "mainImage": mainImage {
        alt,
        "url": asset->url
      }
    }`,
        {
            category: article.category,
            articleId: article._id,
        }
    );
}

function formatDate(date?: string) {
    if (!date) return "";

    return new Date(date).toLocaleDateString("en-US", {
        year: "numeric",
        month: "long",
        day: "numeric",
    });
}

function getReadingTime(body?: unknown[]) {
    if (!body?.length) return 1;

    const textParts: string[] = [];

    function collectText(value: unknown) {
        if (!value || typeof value !== "object") return;

        if (Array.isArray(value)) {
            value.forEach(collectText);
            return;
        }

        const object = value as Record<string, unknown>;

        if (typeof object.text === "string") {
            textParts.push(object.text);
        }

        Object.entries(object).forEach(([key, child]) => {
            if (key !== "text") {
                collectText(child);
            }
        });
    }

    collectText(body);

    const wordCount = textParts.join(" ").trim().split(/\s+/).filter(Boolean).length;

    return Math.max(1, Math.ceil(wordCount / 200));
}

const portableTextComponents = {
    types: {
        image: ({
            value,
        }: {
            value: { url?: string; alt?: string };
        }) => {
            if (!value?.url) return null;

            return (
                <figure className="article-inline-figure">
                    <img
                        className="article-inline-image"
                        src={value.url}
                        alt={value.alt || "Article image"}
                    />
                    {value.alt && (
                        <figcaption className="article-image-caption">
                            {value.alt}
                        </figcaption>
                    )}
                </figure>
            );
        },
    },

    block: {
        h2: ({ children }: { children?: ReactNode }) => (
            <h2>{children}</h2>
        ),

        h3: ({ children }: { children?: ReactNode }) => (
            <h3>{children}</h3>
        ),

        blockquote: ({ children }: { children?: ReactNode }) => (
            <blockquote>{children}</blockquote>
        ),

        normal: ({ children }: { children?: ReactNode }) => (
            <p>{children}</p>
        ),
    },

    marks: {
        link: ({
            children,
            value,
        }: {
            children?: ReactNode;
            value?: { href?: string };
        }) => {
            const href = value?.href;

            if (!href) return <>{children}</>;

            return (
                <a
                    href={href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="article-inline-link"
                >
                    {children}
                </a>
            );
        },
    },
};

export default async function ArticlePage({
    params,
}: {
    params: Promise<{ slug: string }>;
}) {
    const { slug } = await params;
    const article = await getArticle(slug);

    if (!article) {
        notFound();
    }

    const [relatedArticles] = await Promise.all([
        getRelatedArticles(article),
    ]);

    const readingTime = getReadingTime(article.body);

    return (
        <main className="article-page">
            <ReadingProgress />

            {/* SHARED TOP BAR */}
            <div className="top-bar">
                <div className="container top-bar-inner">
                    <span>INDEPENDENT SPORTS JOURNALISM</span>
                    <span>MORE THAN THE GAME. MORE THAN THE SCORE.</span>
                </div>
            </div>

            {/* SHARED MASTHEAD */}
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

            {/* SHARED NAVIGATION */}
            <nav className="main-nav" aria-label="Main navigation">
                <div className="container nav-inner">
                    <div className="nav-links">
                        <a href="/">HOME</a>
                        <a href="/football">FOOTBALL</a>
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

            <article className="article-main">
                {/* ARTICLE INTRODUCTION */}
                <header className="article-intro">
                    <div className="article-breadcrumb">
                        <a href="/">HOME</a>
                        <span>/</span>
                        <a href="/latest">LATEST STORIES</a>
                        <span>/</span>
                        <span>{article.category || "SPORTS"}</span>
                    </div>

                    <div className="article-category">
                        <span>THE SPORTS DESK JOURNAL</span>
                        <span className="article-category-divider">◆</span>
                        <span>{article.category || "SPORTS JOURNALISM"}</span>
                    </div>

                    <h1 className="article-title">{article.title}</h1>

                    {article.subtitle && (
                        <p className="article-subtitle">{article.subtitle}</p>
                    )}

                    {article.excerpt && (
                        <p className="article-excerpt">{article.excerpt}</p>
                    )}

                    {/* ARTICLE DETAILS */}
                    <div className="article-meta">
                        <div>
                            <span className="article-meta-label">WRITTEN BY</span>
                            <strong>{article.author || "THE SPORTS DESK"}</strong>
                        </div>

                        <div>
                            <span className="article-meta-label">PUBLISHED</span>
                            <span>{formatDate(article.publishedAt)}</span>
                        </div>

                        <div>
                            <span className="article-meta-label">READING TIME</span>
                            <span>{readingTime} MIN READ</span>
                        </div>
                    </div>
                </header>

                {/* FEATURED IMAGE */}
                {article.mainImage?.url && (
                    <figure className="article-featured-figure">
                        <img
                            className="article-featured-image"
                            src={article.mainImage.url}
                            alt={article.mainImage.alt || article.title}
                        />

                        <figcaption className="article-image-caption">
                            <span>THE MATCHDAY CHRONICLE</span>
                            <span>{article.mainImage.alt || article.title}</span>
                        </figcaption>
                    </figure>
                )}

                {/* ARTICLE BODY */}
                <div className="article-reading-layout">
                    <div className="article-content">
                        {article.body && article.body.length > 0 ? (
                            <PortableText
                                value={article.body as never}
                                components={portableTextComponents}
                            />
                        ) : (
                            <p>
                                The full article content has not been added yet.
                            </p>
                        )}
                    </div>
                </div>

                {/* RELATED STORIES */}
                {relatedArticles.length > 0 && (
                    <section className="article-related">
                        <div className="article-related-heading">
                            <span className="eyebrow">CONTINUE READING</span>
                            <h2>More from the desk.</h2>
                        </div>

                        <div className="article-related-grid">
                            {relatedArticles.map((story) => (
                                <a
                                    href={`/articles/${story.slug}`}
                                    className="article-related-card"
                                    key={story._id}
                                >
                                    {story.mainImage?.url ? (
                                        <img
                                            src={story.mainImage.url}
                                            alt={story.mainImage.alt || story.title}
                                        />
                                    ) : (
                                        <div className="article-related-placeholder">
                                            THE SPORTS DESK
                                        </div>
                                    )}

                                    <div className="article-related-content">
                                        <span>{story.category || "SPORTS"}</span>
                                        <h3>{story.title}</h3>
                                        {story.excerpt && <p>{story.excerpt}</p>}
                                        <strong>READ STORY ↗</strong>
                                    </div>
                                </a>
                            ))}
                        </div>
                    </section>
                )}

                {/* EDITORIAL CLOSING */}
                <section className="article-end">
                    <div className="article-end-rule" />

                    <p className="article-end-label">END OF THE EDITION</p>

                    <h2>
                        More than the game.
                        <br />
                        More than the score.
                    </h2>

                    <p className="article-end-description">
                        Independent stories, thoughtful questions and a deeper look
                        at the sporting world.
                    </p>

                    <a href="/latest" className="article-return">
                        EXPLORE MORE STORIES →
                    </a>
                </section>
            </article>

            {/* PUBLICATION FOOTER */}
            <footer className="article-footer">
                <span>THE SPORTS DESK</span>
                <span>INDEPENDENT BY NATURE. CURIOUS BY DESIGN.</span>
                <span>© 2026 THE SPORTS DESK. ALL RIGHTS RESERVED.</span>
            </footer>
        </main>
    );
}
