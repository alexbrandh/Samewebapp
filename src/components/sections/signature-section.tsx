
'use client';

export function SignatureSection() {
    return (
        <section className="py-20 bg-background text-center">
            <div className="container mx-auto px-4 space-y-6">
                <h2 className="text-4xl font-display font-medium">Your Intangible Signature</h2>
                <p className="max-w-2xl mx-auto text-lg text-muted-foreground">
                    El aroma es tu firma invisible. Deja una huella imborrable donde vayas.
                </p>
                {/* Image Placeholder */}
                <div className="w-full h-64 md:h-96 bg-muted mt-8 rounded-lg flex items-center justify-center">
                    <span className="text-muted-foreground">Signature Image / Content</span>
                </div>
            </div>
        </section>
    );
}
