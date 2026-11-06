
import type { Metadata } from "next";
import "./about.css";

export const metadata: Metadata = {
    title: "About Us",
    description:
        "Discover THE SPORTS DESK — an independent sports journalism publication covering the stories, people and moments beyond the score.",
};

export default function AboutPage() {
    return (
        <main className="about-page">
            {/* TOP BAR */}
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
                        <strong>ABOUT US</strong>
                    </a>

                    <div className="football-edition">
                        <span>THE MATCHDAY CHRONICLE</span>
                        <strong>INDEPENDENT SPORTS JOURNALISM</strong>
                        <small>MORE THAN THE GAME. MORE THAN THE SCORE.</small>
                    </div>
                </div>
            </header>

            {/* NAVIGATION */}
            <nav className="main-nav" aria-label="Main navigation">
                <div className="container nav-inner">
                    <div className="nav-links">
                        <a href="/">HOME</a>
                        <a href="/football">FOOTBALL</a>
                        <a href="/latest">LATEST</a>
                        <a href="/analysis">ANALYSIS</a>
                        <a href="/opinion">OPINION</a>
                        <a href="/about" className="nav-active">ABOUT</a>
                        <a href="/more-sports">MORE SPORTS</a>
                    </div>

                    <a href="/#newsletter" className="nav-subscribe">
                        OUR NEWSLETTER ↗
                    </a>
                </div>
            </nav>

            {/* HERO */}
            <section className="about-hero">
                <div className="about-hero-inner">
                    <span className="about-kicker">
                        THE STORY BEHIND THE SPORTS DESK
                    </span>

                    <h1>
                        More than
                        <br />
                        <span>the game.</span>
                    </h1>

                    <p className="about-hero-description">
                        Sport is never just about the final score.
                        It is about the people, the passion, the pressure
                        and the stories that stay with us long after
                        the final whistle.
                    </p>

                    <div className="about-hero-bottom">
                        <span>INDEPENDENT BY NATURE.</span>
                        <span>CURIOUS BY INSTINCT.</span>
                        <span>CONNECTED BY SPORT.</span>
                    </div>
                </div>
            </section>

            {/* OUR STORY */}
            <section className="about-story">
                <div className="about-section-label">
                    <span>01 / OUR STORY</span>
                    <span>WHY WE EXIST</span>
                </div>

                <div className="about-story-grid">
                    <h2>
                        Every score
                        <br />
                        has a <span>story.</span>
                    </h2>

                    <div className="about-story-copy">
                        <p>
                            THE SPORTS DESK was created around a simple
                            belief: sports deserve to be covered beyond
                            the numbers on a scoreboard.
                        </p>

                        <p>
                            Behind every result are decisions, rivalries,
                            personalities, ambitions and moments that
                            give sport its meaning. These are the stories
                            worth exploring.
                        </p>

                        <p>
                            We are an independent digital sports
                            publication built to bring readers closer
                            to the games they love through reporting,
                            analysis, opinion and thoughtful storytelling.
                        </p>
                    </div>
                </div>
            </section>

            {/* OUR PURPOSE */}
            <section className="about-purpose">
                <div className="about-purpose-content">
                    <span className="about-kicker">OUR PURPOSE</span>

                    <h2>
                        We look beyond
                        <br />
                        the <span>scoreline.</span>
                    </h2>

                    <p>
                        We want to make sports journalism engaging,
                        accessible and meaningful. Not simply telling
                        readers what happened, but exploring why it
                        happened and what it means.
                    </p>
                </div>

                <div className="about-purpose-mark">
                    <span>THE</span>
                    <strong>DESK.</strong>
                    <small>MORE THAN THE GAME.</small>
                </div>
            </section>

            {/* EDITORIAL VALUES */}
            <section className="about-values">
                <div className="about-section-label">
                    <span>02 / WHAT WE BELIEVE</span>
                    <span>OUR EDITORIAL VALUES</span>
                </div>

                <h2>What matters to us.</h2>

                <div className="about-values-grid">
                    <article>
                        <span>01</span>
                        <h3>Independence</h3>
                        <p>
                            An independent perspective, guided by
                            curiosity, fairness and editorial integrity.
                        </p>
                    </article>

                    <article>
                        <span>02</span>
                        <h3>Credibility</h3>
                        <p>
                            Accuracy matters. We value reliable
                            information, context and responsible reporting.
                        </p>
                    </article>

                    <article>
                        <span>03</span>
                        <h3>Perspective</h3>
                        <p>
                            The best sports stories go beyond results.
                            We look for the details that give them meaning.
                        </p>
                    </article>

                    <article>
                        <span>04</span>
                        <h3>Passion</h3>
                        <p>
                            Sport deserves energy, personality and
                            genuine enthusiasm in every story we tell.
                        </p>
                    </article>
                </div>
            </section>

            {/* OUR COVERAGE */}
            <section className="about-coverage">
                <div className="about-section-label">
                    <span>03 / OUR COVERAGE</span>
                    <span>ONE SPORTING WORLD</span>
                </div>

                <div className="about-coverage-heading">
                    <h2>
                        Different games.
                        <br />
                        <span>One shared obsession.</span>
                    </h2>

                    <p>
                        Football is where our coverage begins.
                        But the sporting world is much bigger,
                        and there are countless stories worth telling.
                    </p>
                </div>

                <div className="about-coverage-list">
                    <a href="/football">
                        <span>01</span>
                        <strong>FOOTBALL</strong>
                        <span>OUR FIRST LOVE ↗</span>
                    </a>

                    <a href="/more-sports/nfl">
                        <span>02</span>
                        <strong>AMERICAN FOOTBALL</strong>
                        <span>NFL ↗</span>
                    </a>

                    <a href="/more-sports/nba">
                        <span>03</span>
                        <strong>BASKETBALL</strong>
                        <span>NBA ↗</span>
                    </a>

                    <a href="/more-sports/cricket">
                        <span>04</span>
                        <strong>CRICKET</strong>
                        <span>THE GENTLEMAN'S GAME ↗</span>
                    </a>

                    <a href="/more-sports/other">
                        <span>05</span>
                        <strong>AND EVERYTHING ELSE</strong>
                        <span>EXPLORE MORE ↗</span>
                    </a>
                </div>
            </section>

            {/* CLOSING */}
            <section className="about-closing">
                <span className="about-kicker">THE SPORTS DESK</span>

                <h2>
                    More than the game.
                    <br />
                    <span>More than the score.</span>
                </h2>

                <p>
                    Because every sport has a story.
                    And every story deserves to be told.
                </p>

                <a href="/latest">
                    EXPLORE OUR STORIES ↗
                </a>
            </section>

            {/* FOOTER */}
            <footer className="about-footer">
                <span>THE SPORTS DESK</span>
                <span>INDEPENDENT SPORTS JOURNALISM</span>
            </footer>
        </main>
    );
}
