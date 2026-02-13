
'use client';

import { motion } from 'framer-motion';
import { Drop } from 'phosphor-react';

export function InfoSection() {
    return (
        <section className="py-10 lg:py-16 bg-background">
            <div className="container px-4 md:px-6">
                <div className="max-w-3xl mx-auto text-center space-y-8">
                    <div className="space-y-4">
                        <h2 className="text-3xl font-bold tracking-tight">CUSTOMIZE YOUR SCENT</h2>
                        <p className="text-muted-foreground text-lg">
                            Enhance your perfume by adding more extract to elevate the experience
                        </p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-center">
                        <div className="flex flex-col items-center gap-3 p-4 bg-muted/30 rounded-lg">
                            <Drop size={32} weight="fill" className="text-primary" />
                            <p className="font-medium">Higher concentration of pure essence</p>
                        </div>
                        <div className="flex flex-col items-center gap-3 p-4 bg-muted/30 rounded-lg">
                            <span className="text-3xl">💎</span>
                            <p className="font-medium">Deeper Intensity</p>
                        </div>
                        <div className="flex flex-col items-center gap-3 p-4 bg-muted/30 rounded-lg">
                            <span className="text-3xl">🕔</span>
                            <p className="font-medium">Extended Duration</p>
                        </div>
                    </div>

                    <div className="mt-8 border rounded-lg overflow-hidden">
                        <div className="grid grid-cols-2 divide-x divide-border bg-muted/50">
                            <div className="p-4 font-bold">Classic</div>
                            <div className="p-4 font-bold">Extract</div>
                        </div>
                        <div className="grid grid-cols-2 divide-x divide-border">
                            <div className="p-4">8 to 12 hours</div>
                            <div className="p-4">12 to 18 hours</div>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
}
