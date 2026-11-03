
import { client } from "../../sanity/client";
import ReadingProgress from "./ReadingProgress";
import { notFound } from "next/navigation";
import { PortableText } from "@portabletext/react";
import type { ReactNode } from "react";

type SanityArticle = {
    _id: string;
    title: string;
    subtitle?: string;
    slug: string;
    author?: string;
    category?: string;
    excerpt?: string;
    publishedAt?: string;
    mainImage?: {
        url?: string;
        alt?: string;
    };
    body?: unknown[];
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

function formatDate(date?: string) {
    if (!date) return "";

    return new Date(date).toLocaleDateString("en-US", {
        year: "numeric",
        month: "long",
        day: "numeric",
    });
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

    return (
        <main className="article-page">
            <ReadingProgress />

            <div className="article-topbar">
                THE SPORTS DESK — INDEPENDENT SPORTS JOURNALISM
            </div>

            <header className="article-header">
                <a href="/" className="article-brand">
                    THE SPORTS<span>DESK</span>
                </a>

                <div>
                    <a href="/" className="article-back-link">
                        ← BACK TO THE HOMEPAGE
                    </a>
                </div>
            </header>

            <article className="article-main">

                <div className="article-category">
                    {article.category || "SPORTS JOURNALISM"}
                </div>

                <h1 className="article-title">
                    {article.title}
                </h1>

                {article.subtitle && (
                    <p className="article-subtitle">
                        {article.subtitle}
                    </p>
                )}

                <div className="article-meta">
                    <strong>
                        {article.author || "THE SPORTS DESK"}
                    </strong>

                    <span>•</span>

                    <span>{formatDate(article.publishedAt)}</span>

                    <span>•</span>

                    <span>THE SPORTS DESK</span>
                </div>

                {article.mainImage?.url && (
                    <figure className="article-featured-figure">
                        <img
                            className="article-featured-image"
                            src={article.mainImage.url}
                            alt={article.mainImage.alt || article.title}
                        />

                        {article.mainImage.alt && (
                            <figcaption className="article-image-caption">
                                {article.mainImage.alt}
                            </figcaption>
                        )}
                    </figure>
                )}

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

                <section className="article-end">
                    <p className="article-end-label">
                        THE SPORTS DESK
                    </p>

                    <h2>
                        More than the game. More than the score.
                    </h2>

                    <a href="/" className="article-return">
                        RETURN TO THE SPORTS DESK →
                    </a>
                </section>

            </article>

            <footer className="article-footer">
                © 2026 THE SPORTS DESK. ALL RIGHTS RESERVED.
            </footer>

        </main>
    );
}
