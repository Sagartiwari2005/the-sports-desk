
"use client";

import { useEffect, useState } from "react";

export default function ReadingProgress() {
    const [progress, setProgress] = useState(0);

    useEffect(() => {
        function updateProgress() {
            const scrollTop = window.scrollY;
            const documentHeight =
                document.documentElement.scrollHeight - window.innerHeight;

            const percentage =
                documentHeight > 0
                    ? (scrollTop / documentHeight) * 100
                    : 0;

            setProgress(Math.min(100, Math.max(0, percentage)));
        }

        updateProgress();

        window.addEventListener("scroll", updateProgress, {
            passive: true,
        });

        window.addEventListener("resize", updateProgress);

        return () => {
            window.removeEventListener("scroll", updateProgress);
            window.removeEventListener("resize", updateProgress);
        };
    }, []);

    return (
        <div
            className="reading-progress"
            role="progressbar"
            aria-label="Article reading progress"
            aria-valuemin={0}
            aria-valuemax={100}
            aria-valuenow={Math.round(progress)}
        >
            <div
                className="reading-progress-fill"
                style={{ width: `${progress}%` }}
            />
        </div>
    );
}
