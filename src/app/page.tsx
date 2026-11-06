
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

function getImageUrl(image?: SanityImage, width = 1200) {
  if (!image?.asset?._ref) return undefined;

  return imageBuilder
    .image(image)
    .width(width)
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

function SectionHeading({
  eyebrow,
  title,
}: {
  eyebrow: string;
  title: string;
}) {
  return (
    <div className="home-section-heading">
      <div>
        <span className="eyebrow">{eyebrow}</span>
        <h2>{title}</h2>
      </div>
      <span className="home-heading-line" />
    </div>
  );
}

export default async function Home() {
  const articles = await getPublishedArticles();

  const featuredArticle =
    articles.find((article) => article.featured) ??
    articles[0] ??
    null;

  const supportingArticles = articles
    .filter((article) => article._id !== featuredArticle?._id)
    .slice(0, 2);

  const latestArticles = articles
    .filter(
      (article) =>
        article._id !== featuredArticle?._id &&
        !supportingArticles.some((story) => story._id === article._id)
    )
    .slice(0, 5);

  const leadImage = getImageUrl(featuredArticle?.mainImage, 1600);

  return (
    <main className="home-editorial-page">

      {/* PUBLICATION STRIP */}
      <div className="top-bar">
        <div className="container top-bar-inner">
          <span>INDEPENDENT SPORTS JOURNALISM</span>
          <span>MORE THAN THE GAME. MORE THAN THE SCORE.</span>
        </div>
      </div>

      {/* MASTHEAD */}
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

      {/* MAIN NAVIGATION */}
      <nav className="main-nav" aria-label="Main navigation">
        <div className="container nav-inner">
          <div className="nav-links">
            <a className="nav-active" href="/">HOME</a>
            <a href="/football">FOOTBALL</a>
            <a href="/latest">LATEST</a>
            <a href="/analysis">ANALYSIS</a>
            <a href="/opinion">OPINION</a>
            <a href="/about">ABOUT</a>
            <a href="/more-sports">MORE SPORTS</a>
          </div>

          <a href="#newsletter" className="nav-subscribe">
            OUR NEWSLETTER ↗
          </a>
        </div>
      </nav>

      {/* LEAD STORY */}
      {featuredArticle ? (
        <section className="container home-lead-section">
          <div className="home-lead-copy">
            <div className="home-story-meta">
              <span>THE LEAD STORY</span>
              <span className="home-meta-divider" />
              <span>
                {featuredArticle.category?.toUpperCase() ?? "SPORT"}
              </span>
            </div>

            <h1>{featuredArticle.title}</h1>

            <p className="home-lead-excerpt">
              {featuredArticle.excerpt ??
                featuredArticle.subtitle ??
                "Read the latest story from THE SPORTS DESK."}
            </p>

            <div className="home-lead-byline">
              <strong>
                {featuredArticle.author ?? "THE SPORTS DESK"}
              </strong>
              <span>{formatDate(featuredArticle.publishedAt)}</span>
            </div>

            <a
              href={`/articles/${featuredArticle.slug}`}
              className="home-read-button"
            >
              READ THE FULL STORY <span>→</span>
            </a>
          </div>

          <a
            href={`/articles/${featuredArticle.slug}`}
            className="home-lead-image"
            aria-label={`Read ${featuredArticle.title}`}
            style={
              leadImage
                ? { backgroundImage: `url("${leadImage}")` }
                : undefined
            }
          >
            <span className="home-image-label">THE LEAD STORY</span>
            <span className="home-image-caption">
              {featuredArticle.title}
            </span>
          </a>
        </section>
      ) : (
        <section className="container home-empty-lead">
          <span className="eyebrow">WELCOME TO THE SPORTS DESK</span>
          <h1>The game is bigger than the scoreline.</h1>
          <p>
            Our first stories are being prepared. Check back soon.
          </p>
        </section>
      )}

      {/* SUPPORTING STORIES */}
      {supportingArticles.length > 0 && (
        <section className="container home-supporting-section">
          <SectionHeading
            eyebrow="MORE FROM THE DESK"
            title="Also worth your attention."
          />

          <div className="home-supporting-grid">
            {supportingArticles.map((story, index) => {
              const image = getImageUrl(story.mainImage, 850);

              return (
                <article className="home-supporting-card" key={story._id}>
                  <a
                    href={`/articles/${story.slug}`}
                    className="home-supporting-image"
                    aria-label={`Read ${story.title}`}
                    style={
                      image
                        ? { backgroundImage: `url("${image}")` }
                        : undefined
                    }
                  >
                    <span>0{index + 1}</span>
                  </a>

                  <div className="home-supporting-copy">
                    <span className="eyebrow">
                      {story.category ?? "SPORT"}
                    </span>

                    <h3>
                      <a href={`/articles/${story.slug}`}>
                        {story.title}
                      </a>
                    </h3>

                    <p>
                      {story.excerpt ?? story.subtitle ?? ""}
                    </p>

                    <div className="home-supporting-meta">
                      <span>{story.author ?? "THE SPORTS DESK"}</span>
                      <span>{formatDate(story.publishedAt)}</span>
                    </div>
                  </div>
                </article>
              );
            })}
          </div>
        </section>
      )}

      {/* LATEST ARTICLES */}
      {latestArticles.length > 0 && (
        <section className="home-latest-section">
          <div className="container">
            <SectionHeading
              eyebrow="FRESH FROM THE NEWSROOM"
              title="The latest stories."
            />

            <div className="home-latest-list">
              {latestArticles.map((story) => {
                const image = getImageUrl(story.mainImage, 450);

                return (
                  <article className="home-latest-item" key={story._id}>
                    <a
                      href={`/articles/${story.slug}`}
                      className="home-latest-image"
                      aria-label={`Read ${story.title}`}
                      style={
                        image
                          ? { backgroundImage: `url("${image}")` }
                          : undefined
                      }
                    />

                    <div className="home-latest-copy">
                      <span className="eyebrow">
                        {story.category ?? "SPORT"}
                      </span>

                      <h3>
                        <a href={`/articles/${story.slug}`}>
                          {story.title}
                        </a>
                      </h3>

                      <p>
                        {story.excerpt ?? story.subtitle ?? ""}
                      </p>

                      <div className="home-supporting-meta">
                        <span>{story.author ?? "THE SPORTS DESK"}</span>
                        <span>{formatDate(story.publishedAt)}</span>
                      </div>
                    </div>

                    <a
                      href={`/articles/${story.slug}`}
                      className="home-latest-arrow"
                      aria-label={`Read ${story.title}`}
                    >
                      ↗
                    </a>
                  </article>
                );
              })}
            </div>

            <a href="/latest" className="home-all-stories">
              VIEW ALL STORIES <span>→</span>
            </a>
          </div>
        </section>
      )}

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
            <a href="/" className="football-brand footer-logo">
              <span>THE SPORTS DESK</span>
            </a>

            <p>MORE THAN THE GAME. MORE THAN THE SCORE.</p>

            <span className="footer-description">
              Independent digital sports journalism. Stories, perspectives
              and analysis beyond the final whistle.
            </span>
          </div>

          <div className="footer-links">
            <div>
              <h4>EXPLORE</h4>
              <a href="/football">Football</a>
              <a href="/latest">Latest stories</a>
              <a href="/analysis">Analysis</a>
              <a href="/opinion">Opinion</a>
            </div>

            <div>
              <h4>THE PUBLICATION</h4>
              <a href="/about">About us</a>
              <a href="/more-sports">Our coverage</a>
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
