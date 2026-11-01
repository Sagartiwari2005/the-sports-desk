
import { client } from "../../sanity/client";
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
                <figure style={{ margin: "40px 0" }}>
                    <img
                        src={value.url}
                        alt={value.alt || "Article image"}
                        style={{
                            width: "100%",
                            height: "auto",
                            display: "block",
                            borderRadius: "8px",
                        }}
                    />
                    {value.alt && (
                        <figcaption
                            style={{
                                fontSize: "13px",
                                color: "#64748b",
                                marginTop: "10px",
                            }}
                        >
                            {value.alt}
                        </figcaption>
                    )}
                </figure>
            );
        },
    },

    block: {
        h2: ({ children }: { children?: ReactNode }) => (
            <h2
                style={{
                    fontSize: "30px",
                    lineHeight: 1.25,
                    color: "#111f35",
                    marginTop: "48px",
                    marginBottom: "18px",
                    fontWeight: 800,
                }}
            >
                {children}
            </h2>
        ),

        h3: ({ children }: { children?: ReactNode }) => (
            <h3
                style={{
                    fontSize: "23px",
                    lineHeight: 1.3,
                    color: "#111f35",
                    marginTop: "35px",
                    marginBottom: "14px",
                    fontWeight: 700,
                }}
            >
                {children}
            </h3>
        ),

        blockquote: ({ children }: { children?: ReactNode }) => (
            <blockquote
                style={{
                    borderLeft: "4px solid #2878d0",
                    paddingLeft: "24px",
                    margin: "35px 0",
                    color: "#334155",
                    fontSize: "22px",
                    lineHeight: 1.6,
                    fontWeight: 600,
                }}
            >
                {children}
            </blockquote>
        ),

        normal: ({ children }: { children?: ReactNode }) => (
            <p
                style={{
                    fontSize: "18px",
                    lineHeight: 1.9,
                    color: "#475569",
                    marginBottom: "24px",
                }}
            >
                {children}
            </p>
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
                    style={{
                        color: "#1674d1",
                        textDecoration: "underline",
                        textUnderlineOffset: "3px",
                    }}
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
        <main
            style={{
                minHeight: "100vh",
                background: "#ffffff",
                color: "#111f35",
            }}
        >
            {/* TOP BAR */}
            <div
                style={{
                    background: "#0c1b30",
                    color: "#ffffff",
                    padding: "13px 5%",
                    fontSize: "11px",
                    letterSpacing: "1.5px",
                    fontWeight: 700,
                }}
            >
                THE SPORTS DESK — INDEPENDENT SPORTS JOURNALISM
            </div>

            {/* HEADER */}
            <header
                style={{
                    borderBottom: "1px solid #e5e7eb",
                    padding: "24px 5%",
                }}
            >
                <a
                    href="/"
                    style={{
                        textDecoration: "none",
                        color: "#111f35",
                        fontSize: "25px",
                        fontWeight: 900,
                        letterSpacing: "-1px",
                    }}
                >
                    THE SPORTS<span style={{ color: "#2478d0" }}>DESK</span>
                </a>

                <div style={{ marginTop: "15px" }}>
                    <a
                        href="/"
                        style={{
                            color: "#64748b",
                            textDecoration: "none",
                            fontSize: "12px",
                            fontWeight: 700,
                            letterSpacing: "1px",
                        }}
                    >
                        ← BACK TO THE HOMEPAGE
                    </a>
                </div>
            </header>

            {/* ARTICLE HEADER */}
            <article
                style={{
                    maxWidth: "900px",
                    margin: "0 auto",
                    padding: "75px 24px 100px",
                }}
            >
                <div
                    style={{
                        color: "#1674d1",
                        fontSize: "12px",
                        fontWeight: 800,
                        letterSpacing: "2px",
                        marginBottom: "22px",
                        textTransform: "uppercase",
                    }}
                >
                    {article.category || "SPORTS JOURNALISM"}
                </div>

                <h1
                    style={{
                        fontSize: "clamp(38px, 7vw, 68px)",
                        lineHeight: 1.08,
                        letterSpacing: "-2.5px",
                        fontWeight: 900,
                        color: "#111f35",
                        margin: "0 0 25px",
                    }}
                >
                    {article.title}
                </h1>

                {article.subtitle && (
                    <p
                        style={{
                            fontSize: "21px",
                            lineHeight: 1.6,
                            color: "#64748b",
                            marginBottom: "30px",
                        }}
                    >
                        {article.subtitle}
                    </p>
                )}

                <div
                    style={{
                        display: "flex",
                        flexWrap: "wrap",
                        alignItems: "center",
                        gap: "12px",
                        borderTop: "1px solid #e5e7eb",
                        borderBottom: "1px solid #e5e7eb",
                        padding: "20px 0",
                        marginBottom: "40px",
                        fontSize: "13px",
                        color: "#64748b",
                    }}
                >
                    <strong style={{ color: "#111f35" }}>
                        {article.author || "THE SPORTS DESK"}
                    </strong>

                    <span>•</span>

                    <span>{formatDate(article.publishedAt)}</span>

                    <span>•</span>

                    <span>THE SPORTS DESK</span>
                </div>

                {/* FEATURED IMAGE */}
                {article.mainImage?.url && (
                    <figure style={{ margin: "0 0 45px" }}>
                        <img
                            src={article.mainImage.url}
                            alt={article.mainImage.alt || article.title}
                            style={{
                                display: "block",
                                width: "100%",
                                height: "auto",
                                maxHeight: "540px",
                                objectFit: "cover",
                                borderRadius: "6px",
                            }}
                        />
                        {article.mainImage.alt && (
                            <figcaption
                                style={{
                                    color: "#64748b",
                                    fontSize: "12px",
                                    marginTop: "10px",
                                }}
                            >
                                {article.mainImage.alt}
                            </figcaption>
                        )}
                    </figure>
                )}

                {/* ARTICLE BODY */}
                <div>
                    {article.body && article.body.length > 0 ? (
                        <PortableText
                            value={article.body as never}
                            components={portableTextComponents}
                        />
                    ) : (
                        <p style={{ color: "#64748b", fontSize: "17px" }}>
                            The full article content has not been added yet.
                        </p>
                    )}
                </div>

                {/* END OF ARTICLE */}
                <div
                    style={{
                        borderTop: "1px solid #e5e7eb",
                        marginTop: "65px",
                        paddingTop: "30px",
                    }}
                >
                    <p
                        style={{
                            color: "#1674d1",
                            fontSize: "12px",
                            fontWeight: 800,
                            letterSpacing: "2px",
                        }}
                    >
                        THE SPORTS DESK
                    </p>

                    <h2
                        style={{
                            fontSize: "25px",
                            fontWeight: 800,
                            color: "#111f35",
                        }}
                    >
                        More than the game. More than the score.
                    </h2>

                    <a
                        href="/"
                        style={{
                            display: "inline-block",
                            marginTop: "15px",
                            padding: "15px 22px",
                            background: "#111f35",
                            color: "#ffffff",
                            textDecoration: "none",
                            fontSize: "12px",
                            fontWeight: 800,
                            letterSpacing: "1px",
                        }}
                    >
                        RETURN TO THE SPORTS DESK →
                    </a>
                </div>
            </article>

            {/* FOOTER */}
            <footer
                style={{
                    background: "#0c1b30",
                    color: "#ffffff",
                    textAlign: "center",
                    padding: "30px 20px",
                    fontSize: "11px",
                    letterSpacing: "1px",
                }}
            >
                © 2026 THE SPORTS DESK. ALL RIGHTS RESERVED.
            </footer>
        </main>
    );
}
