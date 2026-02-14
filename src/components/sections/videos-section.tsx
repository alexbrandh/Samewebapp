
'use client';

const videos = [
    'https://cdn.shopify.com/videos/c/o/v/43e2c5c003ab4f33b956f8cd2fe40629.mp4',
    'https://cdn.shopify.com/videos/c/o/v/563ff54083bd45dbb4337aa75b89ac52.mp4',
    'https://cdn.shopify.com/videos/c/o/v/ff39397a93684c2bad634e210708bd34.mp4',
];

export function VideosSection() {
    return (
        <section className="py-10 lg:py-16 bg-muted/20">
            <div className="container mx-auto px-4 text-center">
                <h2 className="text-3xl font-bold mb-8">DESCUBRE NUESTRA ESENCIA</h2>
                <div className="videos-grid">
                    {videos.map((src, i) => (
                        <div key={i} className="video-card">
                            <video
                                src={src}
                                autoPlay
                                loop
                                muted
                                playsInline
                                preload="metadata"
                                className="video-player"
                            />
                        </div>
                    ))}
                </div>
            </div>

            <style jsx>{`
        .videos-grid {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: 1.5rem;
        }

        .video-card {
          position: relative;
          border-radius: 0.75rem;
          overflow: hidden;
          background: hsl(var(--muted));
        }

        .video-player {
          width: 100%;
          height: 100%;
          display: block;
          object-fit: cover;
          aspect-ratio: 9 / 16;
        }

        /* Tablet: 3 columns still, slightly smaller gap */
        @media (max-width: 1024px) {
          .videos-grid {
            gap: 1rem;
          }
        }

        /* Mobile: horizontal scroll for a swipeable feel */
        @media (max-width: 768px) {
          .videos-grid {
            display: flex;
            overflow-x: auto;
            scroll-snap-type: x mandatory;
            -webkit-overflow-scrolling: touch;
            gap: 0.75rem;
            padding-bottom: 0.5rem;
            scrollbar-width: none;
          }

          .videos-grid::-webkit-scrollbar {
            display: none;
          }

          .video-card {
            flex: 0 0 75%;
            scroll-snap-align: center;
            border-radius: 0.5rem;
          }

          .video-player {
            aspect-ratio: 9 / 16;
          }
        }

        /* Very small screens */
        @media (max-width: 480px) {
          .video-card {
            flex: 0 0 85%;
          }
        }
      `}</style>
        </section>
    );
}
