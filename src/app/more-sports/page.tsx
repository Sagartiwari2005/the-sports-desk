export const revalidate = 60;
const sports = [
    {
        number: "01",
        name: "NFL",
        subtitle: "AMERICAN FOOTBALL",
        headline: "Where every yard matters.",
        description:
            "The rivalries, the personalities, the tactics and the moments that define American football.",
        href: "/more-sports/nfl",
        symbol: "NFL",
    },
    {
        number: "02",
        name: "NBA",
        subtitle: "BASKETBALL",
        headline: "The game never stands still.",
        description:
            "The superstars, the rivalries, the culture and the stories shaping basketball.",
        href: "/more-sports/nba",
        symbol: "NBA",
    },
    {
        number: "03",
        name: "CRICKET",
        subtitle: "BEYOND THE BOUNDARY",
        headline: "A game of patience and pressure.",
        description:
            "From international contests to franchise leagues, explore the stories behind cricket.",
        href: "/more-sports/cricket",
        symbol: "CR",
    },
    {
        number: "04",
        name: "OTHER SPORTS",
        subtitle: "THE WIDER SPORTING WORLD",
        headline: "There is always another story.",
        description:
            "Tennis, Formula 1, athletics and the sports that deserve a bigger spotlight.",
        href: "/more-sports/other",
        symbol: "OS",
    },
];

export default function MoreSportsPage() {
    return (
        <main className="more-sports-page">
            {/* TOP BAR */}
            <div className="top-bar">
                <div className="container top-bar-inner">
                    <span>THE SPORTS DESK</span>
                    <span>EVERY SPORT. EVERY STORY.</span>
                </div>
            </div>

            {/* MASTHEAD */}
            <header className="football-masthead">
                <div className="container football-masthead-inner">
                    <a href="/" className="football-brand">
                        <span>THE SPORTS DESK</span>
                        <strong>MORE SPORTS</strong>
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
                        <a href="/opinion">OPINION</a>
                        <a href="/about">ABOUT</a>
                        <a href="/more-sports" className="nav-active">
                            MORE SPORTS
                        </a>
                    </div>

                    <a href="/#newsletter" className="nav-subscribe">
                        OUR NEWSLETTER ↗
                    </a>
                </div>
            </nav>

            {/* INTRO */}
            <section className="more-sports-intro">
                <span className="more-sports-kicker">
                    THE WIDER SPORTING WORLD / EST. 2026
                </span>

                <h2>
                    More than
                    <br />
                    <span>one game.</span>
                </h2>

                <p>
                    Different games. Different cultures. One shared
                    obsession. Explore the sports, people and stories
                    that make the sporting world bigger than the score.
                </p>
            </section>

            {/* SPORTS DIRECTORY */}
            <section className="more-sports-directory">
                <div className="more-sports-heading">
                    <div>
                        <span>EXPLORE THE SPORTING WORLD</span>
                        <h2>CHOOSE YOUR GAME.</h2>
                    </div>

                    <p>FOUR DESKS. COUNTLESS STORIES.</p>
                </div>

                <div className="more-sports-grid">
                    {sports.map((sport) => (
                        <a
                            href={sport.href}
                            className={`more-sport-card more-sport-${sport.number}`}
                            key={sport.number}
                        >
                            <div className="more-sport-card-top">
                                <span>{sport.number} / THE SPORTS DESK</span>
                                <span className="more-sport-arrow">↗</span>
                            </div>

                            <div className="more-sport-card-main">
                                <span className="more-sport-subtitle">
                                    {sport.subtitle}
                                </span>

                                <span className="more-sport-symbol">
                                    {sport.symbol}
                                </span>

                                <h3>{sport.name}</h3>

                                <h4>{sport.headline}</h4>

                                <p>{sport.description}</p>
                            </div>

                            <div className="more-sport-card-bottom">
                                <span>EXPLORE THE DESK</span>
                                <span>READ THE STORIES ↗</span>
                            </div>
                        </a>
                    ))}
                </div>
            </section>

            {/* FOOTER */}
            <footer className="more-sports-footer">
                <span>THE SPORTS DESK</span>
                <span>EVERY SPORT HAS A STORY. WE TELL IT.</span>
            </footer>
        </main>
    );
}