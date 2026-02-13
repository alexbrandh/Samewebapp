"use client";

import { motion } from "framer-motion";
import { Sparkle, Heart, ShoppingCart, ArrowsClockwise, CircleNotch } from "phosphor-react";
import { QuizAnswer } from "@/lib/types/quiz";
import { useProducts } from "@/lib/hooks/useShopify";
import { useCurrency } from "@/contexts/currency-context";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { BestMatchCard } from '@/components/quiz/best-match-card';
import { QuizProductCard } from '@/components/quiz/quiz-product-card';


interface QuizResultsProps {
  answers: Record<string, QuizAnswer>;
  onRestart: () => void;
}

export default function QuizResults({ answers, onRestart }: QuizResultsProps) {
  const router = useRouter();
  const { products, loading } = useProducts(50); // Fetch 50 products to find matches
  const { formatPrice } = useCurrency();

  // Función de matching con productos reales
  const getRecommendations = () => {
    if (!products || products.length === 0) return [];

    const preferences = Array.isArray(answers["scent-preferences"])
      ? answers["scent-preferences"]
      : [];
    const dislikes = Array.isArray(answers["scent-dislikes"])
      ? answers["scent-dislikes"]
      : [];
    const intensity = answers["fragrance-intensity"];
    const genderPref = answers["gender-preference"];

    const presentationPref = answers["presentation"] as string | undefined; // 'classic' or 'extrait'

    return products.map((product: any) => {
      let score = 0;
      const productTags = product.tags.map((t: string) => t.toLowerCase());

      // HARD FILTER: Exclude products with disliked tags
      const hasDislikedTag = dislikes.some((dislike: any) =>
        productTags.some((t: string) => t.includes(dislike.toLowerCase()))
      );

      if (hasDislikedTag) {
        return { ...product, match: 0, excluded: true };
      }

      // Determine product gender from tags
      let productGender = "unisex";
      if (productTags.includes("feminine") || productTags.includes("women") || productTags.includes("mujer")) productGender = "feminine";
      if (productTags.includes("masculine") || productTags.includes("men") || productTags.includes("hombre")) productGender = "masculine";

      // Score based on preferences
      preferences.forEach((pref: any) => {
        if (productTags.some((t: string) => t.includes(pref.toLowerCase()))) {
          score += 30;
        }
      });

      // Intensity matching
      if (intensity === "expressive" && (productTags.includes("intense") || productTags.includes("strong") || productTags.includes("bold"))) {
        score += 15;
      }
      if (intensity === "subtle" && (productTags.includes("light") || productTags.includes("fresh") || productTags.includes("subtle"))) {
        score += 15;
      }

      // Gender matching
      if (genderPref === "any" || productGender === "unisex" ||
        (genderPref === "feminine" && productGender === "feminine") ||
        (genderPref === "masculine" && productGender === "masculine")) {
        score += 10;
      }

      // Give a small boost to bestsellers
      if (productTags.includes("bestseller")) {
        score += 5;
      }

      // Find the best variant based on presentation preference
      const variants = product.variants?.edges?.map((e: any) => e.node) || [];
      let preferredVariant = variants[0];

      if (presentationPref) {
        // Try to find match for "Extrait" or "Classic"
        // Look in option values
        const targetValue = presentationPref === 'extrait' ? 'Extrait' : 'Classic';
        const match = variants.find((v: any) =>
          v.selectedOptions.some((opt: any) => opt.value === targetValue) && v.availableForSale
        );
        if (match) preferredVariant = match;
      } else {
        // Default to Extrait/100ml if exists as per general site logic, or just first available
        const match = variants.find((v: any) =>
          v.selectedOptions.some((opt: any) => opt.value === 'Extrait') && v.availableForSale
        );
        if (match) preferredVariant = match;
      }

      return {
        ...product,
        match: Math.min(Math.max(score, 60), 98), // Entre 60 y 98%
        selectedVariant: preferredVariant
      };
    })
      .filter((p: any) => !p.excluded) // Remove excluded
      .sort((a: any, b: any) => b.match - a.match)
      .slice(0, 3);
  };

  const recommendations = getRecommendations();
  const topMatch = recommendations[0];

  if (loading) {
    return (
      <div className="flex flex-col justify-center items-center h-[50vh]">
        <CircleNotch size={48} weight="bold" className="animate-spin text-primary mb-4" />
        <p className="text-lg text-muted-foreground">Finding your perfect match...</p>
      </div>
    );
  }

  if (!topMatch) {
    return (
      <div className="flex flex-col justify-center items-center h-[50vh] px-4 text-center">
        <p className="text-xl font-bold mb-4">No perfect match found.</p>
        <p className="text-muted-foreground mb-6">Try adjusting your answers to get better recommendations.</p>
        <button
          onClick={onRestart}
          className="flex items-center gap-2 px-6 py-3 border-2 border-border rounded-full font-semibold hover:bg-accent transition-all"
        >
          <ArrowsClockwise size={20} weight="bold" />
          <span>Retake Quiz</span>
        </button>
      </div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="py-24 px-4"
    >
      <div className="max-w-6xl mx-auto space-y-12">
        {/* Header */}
        <motion.div
          initial={{ y: -20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.2 }}
          className="text-center space-y-4"
        >
          <div className="flex justify-center mb-4">
            <motion.div
              animate={{ rotate: [0, 10, -10, 0] }}
              transition={{ duration: 2, repeat: Infinity, repeatDelay: 1 }}
            >
              <Sparkle size={48} weight="fill" className="text-primary" />
            </motion.div>
          </div>

          <h1 className="text-4xl md:text-6xl font-bold">
            We Found Your
            <span className="text-primary block">Perfect Match!</span>
          </h1>

          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Based on your answers, these are our personalized recommendations
          </p>
        </motion.div>



        {/* Top Match - Hero Card */}
        <motion.div
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ delay: 0.3 }}
          className="relative"
        >
          <div className="absolute -top-4 left-1/2 -translate-x-1/2 z-10">
            <div className="bg-primary text-primary-foreground px-6 py-2 rounded-full text-sm font-bold shadow-lg">
              ✨ YOUR BEST MATCH
            </div>
          </div>

          <BestMatchCard product={topMatch} />
        </motion.div>

        {/* Other Recommendations */}
        {recommendations.length > 1 && (
          <div className="space-y-6">
            <h2 className="text-2xl md:text-3xl font-bold text-center">
              You May Also Like
            </h2>

            <div className="grid md:grid-cols-2 gap-6">
              {recommendations.slice(1).map((perfume: any, index: number) => (
                <QuizProductCard
                  key={perfume.id}
                  product={perfume}
                  delay={0.4 + index * 0.1}
                />
              ))}
            </div>
          </div>
        )}

        {/* Actions */}
        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.6 }}
          className="flex flex-col sm:flex-row gap-4 justify-center items-center pt-8"
        >
          <button
            onClick={onRestart}
            className="flex items-center gap-2 px-6 py-3 border-2 border-border rounded-full font-semibold hover:bg-accent transition-all"
          >
            <ArrowsClockwise size={20} weight="bold" />
            <span>Retake Quiz</span>
          </button>

          <button
            onClick={() => router.push('/collections/all')}
            className="px-6 py-3 bg-primary text-primary-foreground rounded-full font-semibold hover:bg-primary/90 transition-all hover:scale-105"
          >
            View All Perfumes
          </button>
        </motion.div>

        {/* Info note */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.8 }}
          className="text-center text-sm text-muted-foreground max-w-2xl mx-auto"
        >
          <p>
            💡 <strong>Tip:</strong> Save your results and try samples of these perfumes to
            find the one that suits you best. Every skin reacts differently to fragrances.
          </p>
        </motion.div>
      </div>
    </motion.div>
  );
}
