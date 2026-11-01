
import { client } from "./sanity/client";
import imageUrlBuilder from "@sanity/image-url";
import { projectId, dataset } from "./sanity/env";

const imageBuilder = imageUrlBuilder({
  projectId,
  dataset,
});

type SanityImage = {
  asset?: {
    _ref?: string;
  };
};

type SanityArticle = {
  _id: string;
  title: string;
  subtitle?: string;
  slug: string;
  author?: string;
  category?: string;
  excerpt?: string;
  mainImage?: SanityImage;
  publishedAt?: string;
  featured?: boolean;
};

function getImageUrl(image?: SanityImage) {
  if (!image?.asset?._ref) return undefined;

  return imageBuilder
    .image(image)
    .width(1600)
    .quality(85)
    .auto("format")
    .url();
}

async function getPublishedArticles(): Promise<SanityArticle[]> {
  return client.fetch(
    `*[_type == "article" && defined(publishedAt)] 
      | order(publishedAt desc) {
        _id,
        title,
        subtitle,
        "slug": slug.current,
        author,
        category,
        excerpt,
        mainImage,
        publishedAt,
        featured
      }`
  );
}

const categories = [
  {
    name: "Football",
    description: "Our main coverage",
    status: "LIVE",
    active: true,
  },
  {
    name: "NFL",
    description: "American football",
    status: "COMING SOON",
  },
  {
    name: "Basketball",
    description: "The game beyond the rim",
    status: "COMING SOON",
  },
  {
    name: "Cricket",
    description: "Stories from the crease",
    status: "COMING SOON",
  },
];

function SectionHeading({
  eyebrow,
  title,
  description,
}: {
  eyebrow: string;
  title: string;
  description?: string;
}) {
  return (
    <div className="section-heading">
      <div>
        <span className="eyebrow">{eyebrow}</span>
        <h2>{title}</h2>
        {description && <p>{description}</p>}
      </div>
      <span className="section-line" />
    </div>
  );
}

export default async function Home() {
  const articles = await getPublishedArticles();

  const featuredArticle =
    articles.find((article) => article.featured) ?? articles[0] ?? null;

  const latestArticles = articles.slice(0, 3);

  const heroImage = getImageUrl(featuredArticle?.mainImage);

  return (
    <main>
      {/* TOP BRAND BAR */}
      <div className="top-bar">
        <div className="container top-bar-inner">
          <span>INDEPENDENT SPORTS JOURNALISM</span>
          <span>MORE THAN THE GAME. MORE THAN THE SCORE.</span>
        </div>
      </div>

      {/* MASTHEAD */}
      <header className="masthead">
        <div className="container masthead-inner">
          <a href="/" className="brand" aria-label="The Sports Desk home">
            <span className="brand-mark">THE</span>
            <span className="brand-name">
              SPORTS<span>DESK</span>
            </span>
            <span className="brand-tagline">
              MORE THAN THE GAME. MORE THAN THE SCORE.
            </span>
          </a>

          <div className="masthead-right">
            <span className="edition-label">THE INDEPENDENT EDITION</span>
            <a href="#latest" className="masthead-link">
              EXPLORE STORIES <span>↗</span>
            </a>
          </div>
        </div>
      </header>

      {/* MAIN NAVIGATION */}
      <nav className="main-nav" aria-label="Main navigation">
        <div className="container nav-inner">
          <div className="nav-links">
            <a className="nav-active" href="/">
              HOME
            </a>
            <a href="#football">FOOTBALL</a>
            <a href="#latest">LATEST</a>
            <a href="#analysis">ANALYSIS</a>
            <a href="#opinion">OPINION</a>
            <a href="#sports">MORE SPORTS</a>
          </div>

          <a href="#newsletter" className="nav-subscribe">
            OUR NEWSLETTER ↗
          </a>
        </div>
      </nav>

      {/* EDITORIAL TICKER */}
      <section className="desk-ticker" aria-label="Questions worth asking">
        <div className="ticker-topline">
          <div className="ticker-brand">
            <span className="ticker-dot" />
            THE DESK
          </div>

          <span className="ticker-description">
            QUESTIONS WORTH ASKING
          </span>

          <span className="ticker-index">FIELD NOTES / 001</span>
        </div>

        <div className="ticker-window">
          <div className="ticker-track">
            <div className="ticker-group">
              <span>WHY DO 22 PLAYERS CHASE ONE BALL?</span>
              <span className="ticker-star">✳</span>
              <span>CAN YOU WIN WITHOUT PLAYING WELL?</span>
              <span className="ticker-star">✳</span>
              <span>WHY DOES THE MANAGER GET ALL THE BLAME?</span>
              <span className="ticker-star">✳</span>
              <span>IS POSSESSION ACTUALLY OVERRATED?</span>
              <span className="ticker-star">✳</span>
              <span>WHAT DOES THE SCORE NEVER TELL US?</span>
              <span className="ticker-star">✳</span>
            </div>

            <div className="ticker-group" aria-hidden="true">
              <span>WHY DO 22 PLAYERS CHASE ONE BALL?</span>
              <span className="ticker-star">✳</span>
              <span>CAN YOU WIN WITHOUT PLAYING WELL?</span>
              <span className="ticker-star">✳</span>
              <span>WHY DOES THE MANAGER GET ALL THE BLAME?</span>
              <span className="ticker-star">✳</span>
              <span>IS POSSESSION ACTUALLY OVERRATED?</span>
              <span className="ticker-star">✳</span>
              <span>WHAT DOES THE SCORE NEVER TELL US?</span>
              <span className="ticker-star">✳</span>
            </div>
          </div>
        </div>
      </section>

      {/* HERO / FEATURED ARTICLE */}
      <section className="container hero-section" id="football">
        <div className="hero-copy">
          <div className="story-meta">
            <span className="category-label">
              {featuredArticle ? "THE LEAD STORY" : "WELCOME TO THE DESK"}
            </span>

            <span className="meta-divider" />

            <span>
              {featuredArticle?.category?.toUpperCase() ?? "FOOTBALL"}
            </span>
          </div>

          <h1>
            {featuredArticle ? (
              featuredArticle.title
            ) : (
              <>
                The game is bigger
                <br />
                than the <span>scoreline.</span>
              </>
            )}
          </h1>

          <p className="hero-description">
            {featuredArticle?.excerpt ??
              "Football has a story beyond the ninety minutes. We look closer at the people, ideas, decisions and moments that shape the game."}
          </p>

          <div className="hero-author">
            <div className="author-avatar">SD</div>

            <div>
              <strong>
                {featuredArticle?.author ?? "THE SPORTS DESK EDITORIAL TEAM"}
              </strong>
              <span>INDEPENDENT FOOTBALL JOURNALISM</span>
            </div>
          </div>

          {featuredArticle?.slug ? (
            <a
              href={`/articles/${featuredArticle.slug}`}
              className="primary-button"
            >
              READ THE LEAD STORY <span>→</span>
            </a>
          ) : (
            <a href="#latest" className="primary-button">
              EXPLORE OUR COVERAGE <span>→</span>
            </a>
          )}
        </div>

        <div
          className="hero-image"
          role="img"
          aria-label={
            featuredArticle?.title ?? "Football stadium under floodlights"
          }
          style={
            heroImage
              ? {
                backgroundImage: `linear-gradient(0deg, rgba(5, 17, 33, 0.92), rgba(5, 17, 33, 0.05) 75%), url("${heroImage}")`,
              }
              : undefined
          }
        >
          <div className="hero-image-overlay">
            <span>BEYOND THE GAME</span>
            <strong>
              {featuredArticle
                ? featuredArticle.title
                : "THERE IS ALWAYS A BIGGER STORY."}
            </strong>
          </div>

          <span className="image-credit">
            {featuredArticle ? "FEATURED STORY" : "THE SPORTS DESK"}
          </span>
        </div>
      </section>

      {/* EDITORIAL STATEMENT */}
      <section className="editorial-statement">
        <div className="container statement-inner">
          <span className="statement-mark">“</span>

          <div>
            <span className="eyebrow">OUR EDITORIAL PROMISE</span>

            <h2>
              We don't just follow the game.
              <br />
              <span>
                We question it, understand it and tell its stories.
              </span>
            </h2>
          </div>
        </div>
      </section>

      {/* LATEST STORIES */}
      <section className="container content-section" id="latest">
        <SectionHeading
          eyebrow="WHAT'S HAPPENING"
          title="Stories from the desk."
          description="A closer look at the game, the people and the ideas shaping football."
        />

        <div className="stories-grid">
          {latestArticles.length > 0 ? (
            latestArticles.map((story, index) => {
              const storyImage = getImageUrl(story.mainImage);

              return (
                <article className="story-card" key={story._id}>
                  <a
                    href={`/articles/${story.slug}`}
                    className="story-image"
                    aria-label={`Read ${story.title}`}
                    style={
                      storyImage
                        ? {
                          backgroundImage: `linear-gradient(0deg, rgba(5, 17, 33, 0.65), transparent 70%), url("${storyImage}")`,
                          backgroundSize: "cover",
                          backgroundPosition: "center",
                        }
                        : undefined
                    }
                  >
                    <span className="story-number">
                      0{index + 1}
                    </span>

                    <span className="story-image-label">
                      {story.category ?? "FOOTBALL"}
                    </span>
                  </a>

                  <div className="story-content">
                    <span className="eyebrow">
                      {story.category ?? "FOOTBALL"}
                    </span>

                    <h3>
                      <a href={`/articles/${story.slug}`}>
                        {story.title}
                      </a>
                    </h3>

                    <p>
                      {story.excerpt ?? story.subtitle ?? ""}
                    </p>

                    <div className="story-footer">
                      <span>{story.author ?? "THE SPORTS DESK"}</span>
                      <span>READ STORY ↗</span>
                    </div>
                  </div>
                </article>
              );
            })
          ) : (
            <p>
              Our first stories are being prepared. Check back soon.
            </p>
          )}
        </div>
      </section>

      {/* ANALYSIS FEATURE */}
      <section className="analysis-section" id="analysis">
        <div className="container analysis-inner">
          <div className="analysis-image">
            <div className="analysis-image-caption">
              THINK DEEPER. SEE MORE.
            </div>
          </div>

          <div className="analysis-copy">
            <span className="eyebrow">BEYOND THE HEADLINES</span>

            <h2>
              Not just what
              happened.
              <span>Why it happened.</span>
            </h2>

            <p>
              Numbers tell part of the story. Tactics, context and human
              decisions tell the rest. Our analysis goes beyond the
              obvious to explore what really happens in football.
            </p>

            <a href="#latest" className="text-link">
              DISCOVER OUR APPROACH <span>→</span>
            </a>
          </div>
        </div>
      </section>

      {/* OPINION */}
      <section
        className="container content-section opinion-section"
        id="opinion"
      >
        <SectionHeading
          eyebrow="A DIFFERENT PERSPECTIVE"
          title="The conversation matters."
          description="Football is never short of opinions. We make room for thoughtful ones."
        />

        <div className="opinion-banner">
          <div>
            <span className="eyebrow">THE OPINION DESK</span>

            <h2>
              Ask better questions.
              <br />
              Get beyond easy answers.
            </h2>

            <p>
              Strong perspectives, honest debate and ideas worth
              discussing.
            </p>
          </div>

          <div className="opinion-symbol">TSD.</div>
        </div>
      </section>

      {/* OTHER SPORTS */}
      <section className="sports-section" id="sports">
        <div className="container">
          <SectionHeading
            eyebrow="A BIGGER SPORTING WORLD"
            title="More games. More stories."
            description="Football leads the way. Other sports will join our coverage soon."
          />

          <div className="sports-grid">
            {categories.map((sport) => (
              <div
                className={`sport-card ${sport.active ? "sport-active" : ""}`}
                key={sport.name}
              >
                <div className="sport-card-top">
                  <span className="sport-status">{sport.status}</span>
                  <span className="sport-arrow">↗</span>
                </div>

                <h3>{sport.name}</h3>
                <p>{sport.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* NEWSLETTER */}
      <section className="container newsletter-section" id="newsletter">
        <div className="newsletter-content">
          <span className="eyebrow">STAY IN THE GAME</span>

          <h2>
            Good stories deserve
            <span>your attention.</span>
          </h2>

          <p>
            Get a fresh perspective on the sporting world. Follow THE
            SPORTS DESK as we build a publication that looks beyond the
            score.
          </p>
        </div>

        <a
          href="mailto:editor.thesportsdesk@gmail.com?subject=THE%20SPORTS%20DESK%20Newsletter"
          className="newsletter-button"
        >
          GET IN TOUCH <span>→</span>
        </a>
      </section>

      {/* FOOTER */}
      <footer className="site-footer">
        <div className="container footer-main">
          <div className="footer-brand">
            <a href="/" className="brand footer-logo">
              <span className="brand-mark">THE</span>

              <span className="brand-name">
                SPORTS<span>DESK</span>
              </span>
            </a>

            <p>MORE THAN THE GAME. MORE THAN THE SCORE.</p>

            <span className="footer-description">
              Independent digital sports journalism.
              Stories, perspectives and analysis beyond the final whistle.
            </span>
          </div>

          <div className="footer-links">
            <div>
              <h4>EXPLORE</h4>
              <a href="#football">Football</a>
              <a href="#latest">Latest stories</a>
              <a href="#analysis">Analysis</a>
              <a href="#opinion">Opinion</a>
            </div>

            <div>
              <h4>THE PUBLICATION</h4>
              <a href="#sports">Our coverage</a>
              <a href="#newsletter">Contact</a>
              <a href="mailto:editor.thesportsdesk@gmail.com">
                editor.thesportsdesk@gmail.com
              </a>
            </div>
          </div>
        </div>

        <div className="container footer-bottom">
          <span>© 2026 THE SPORTS DESK. ALL RIGHTS RESERVED.</span>
          <span>INDEPENDENT BY NATURE. CURIOUS BY DESIGN.</span>
        </div>
      </footer>
    </main>
  );
}
