"use client";

import { motion } from "framer-motion";
import { ArrowsClockwise, CircleNotch, ArrowLeft, ArrowRight } from "phosphor-react";
import { useProducts } from "@/lib/hooks/useShopify";
import { useRouter } from "next/navigation";
import { useMemo } from "react";
import { BestMatchCard } from "@/components/quiz/best-match-card";
import { QuizProductCard } from "@/components/quiz/quiz-product-card";
import {
  type QuizDefinition,
  type QuizQuestionDef,
  type OccasionCategory,
  calculateOccasionScores,
  getTopOccasions,
  getThreeOccasionResults,
  OCCASION_META,
  normalizeTag,
} from "@/lib/data/quiz-data";

interface QuizResultsProps {
  quizDefinition: QuizDefinition;
  answers: Record<string, string>;
  questions: QuizQuestionDef[];
  onRestart: () => void;
  onBackToHub: () => void;
}

export default function QuizResults({
  quizDefinition,
  answers,
  questions,
  onRestart,
  onBackToHub,
}: QuizResultsProps) {
  const router = useRouter();
  const { products, loading } = useProducts(100);

  const occasionScores = useMemo(
    () => calculateOccasionScores(answers, questions),
    [answers, questions]
  );

  const targetOccasions = useMemo((): {
    label: string;
    category: OccasionCategory;
  }[] => {
    if (quizDefinition.resultType === "three-occasions") {
      const { impresionar, acompanar, disfrutar } =
        getThreeOccasionResults(occasionScores);
      return [
        { label: "Para impresionar", category: impresionar },
        { label: "Para el día a día", category: acompanar },
        { label: "Para disfrutar", category: disfrutar },
      ];
    }
    const top = getTopOccasions(occasionScores, 1);
    return [{ label: "Tu perfume ideal", category: top[0] || "diario" }];
  }, [quizDefinition, occasionScores]);

  const recommendations = useMemo(() => {
    if (!products || products.length === 0) return [];

    // Deduplicate products by title (Shopify has each product twice)
    const seen = new Set<string>();
    const uniqueProducts = products.filter((p: any) => {
      if (seen.has(p.title)) return false;
      seen.add(p.title);
      return true;
    });

    // Determine gender filter
    let genderFilter: string | null = null;
    if (quizDefinition.id === "quiz-general") {
      const q1 = answers["q1"];
      if (q1 === "a") genderFilter = "mujeres";
      else if (q1 === "b") genderFilter = "hombres";
    }
    if (quizDefinition.id === "pareja-perfume") {
      const g = answers["gender"];
      if (g === "mujer") genderFilter = "mujeres";
      else if (g === "hombre") genderFilter = "hombres";
    }

    const usedTitles = new Set<string>();

    return targetOccasions.map(({ label, category }) => {
      const meta = OCCASION_META[category];
      const occasionNorm = normalizeTag(meta.shopifyTag);

      const scored = uniqueProducts
        .map((product: any) => {
          if (usedTitles.has(product.title)) return null;

          // Normalize all tags for comparison
          const tagsNorm = product.tags.map((t: string) => normalizeTag(t));
          let score = 10;

          // Primary: occasion tag match (using normalized comparison)
          if (tagsNorm.includes(occasionNorm)) score += 50;
          if (tagsNorm.includes(normalizeTag(category))) score += 50;

          // Gender (soft filter)
          if (genderFilter) {
            const gNorm = normalizeTag(genderFilter);
            if (tagsNorm.includes(gNorm) || tagsNorm.includes("unisex")) {
              score += 20;
            } else {
              score -= 15;
            }
          }

          // Boost bestsellers
          if (tagsNorm.includes("mas vendidos")) score += 15;
          if (tagsNorm.includes("nuevo")) score += 5;

          // Tiebreaker
          score += Math.random() * 5;

          // Pick preferred variant
          const variants =
            product.variants?.edges?.map((e: any) => e.node) || [];
          const preferredVariant =
            variants.find(
              (v: any) =>
                v.availableForSale &&
                v.selectedOptions?.some(
                  (opt: any) =>
                    opt.value === "Elixir" || opt.value === "Extrait"
                ) &&
                v.selectedOptions?.some(
                  (opt: any) => opt.value === "100ml"
                )
            ) ||
            variants.find((v: any) => v.availableForSale) ||
            variants[0];

          return {
            ...product,
            match: Math.min(Math.max(Math.round(score), 70), 98),
            selectedVariant: preferredVariant,
            occasionLabel: label,
            occasionCategory: category,
          };
        })
        .filter(Boolean)
        .sort((a: any, b: any) => b.match - a.match);

      const bestProduct = scored[0] || null;
      if (bestProduct) usedTitles.add(bestProduct.title);

      return { label, category, meta, product: bestProduct };
    });
  }, [products, targetOccasions, answers, quizDefinition]);

  // --- Loading ---
  if (loading) {
    return (
      <div className="flex flex-col justify-center items-center min-h-[60vh] gap-4">
        <CircleNotch
          size={32}
          weight="light"
          className="animate-spin text-muted-foreground"
        />
        <p className="text-sm text-muted-foreground tracking-wide">
          Analizando tus respuestas...
        </p>
      </div>
    );
  }

  const hasResults = recommendations.some((r) => r.product);

  // --- No results ---
  if (!hasResults) {
    return (
      <div className="flex flex-col justify-center items-center min-h-[60vh] px-4 text-center gap-6">
        <div className="space-y-2">
          <p className="text-lg font-serif font-bold">
            No encontramos resultados
          </p>
          <p className="text-sm text-muted-foreground">
            Intenta con otro test o ajusta tus respuestas.
          </p>
        </div>
        <div className="flex gap-3">
          <button
            onClick={onRestart}
            className="flex items-center gap-1.5 px-5 py-2.5 text-sm border border-border rounded-full hover:bg-accent transition-colors"
          >
            <ArrowsClockwise size={16} weight="light" />
            <span>Repetir</span>
          </button>
          <button
            onClick={onBackToHub}
            className="flex items-center gap-1.5 px-5 py-2.5 text-sm bg-foreground text-background rounded-full hover:opacity-90 transition-opacity"
          >
            <ArrowLeft size={16} weight="light" />
            <span>Otros tests</span>
          </button>
        </div>
      </div>
    );
  }

  const isThreeResults = quizDefinition.resultType === "three-occasions";
  const topResult = recommendations[0];

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="pt-28 pb-20 px-4"
    >
      <div className="max-w-4xl mx-auto space-y-14">
        {/* Header */}
        <motion.div
          initial={{ y: -12, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.15, duration: 0.5 }}
          className="text-center space-y-3"
        >
          <p className="text-xs tracking-[0.3em] uppercase text-muted-foreground">
            SAME.
          </p>

          {isThreeResults ? (
            <>
              <h1 className="text-3xl md:text-5xl font-serif font-bold tracking-tight">
                Tus 3 Fragancias Ideales
              </h1>
              <p className="text-sm text-muted-foreground max-w-md mx-auto">
                Una para impresionar, una para el día a día y una para disfrutar
              </p>
            </>
          ) : (
            <>
              <h1 className="text-3xl md:text-5xl font-serif font-bold tracking-tight">
                Tu Fragancia Ideal
              </h1>
              {topResult?.meta && (
                <p className="text-sm text-muted-foreground max-w-md mx-auto">
                  {topResult.meta.label} — {topResult.meta.tagline}
                </p>
              )}
            </>
          )}
        </motion.div>

        {/* Product Results */}
        {isThreeResults ? (
          <div className="space-y-10">
            {recommendations.map((rec, index) => {
              if (!rec.product) return null;
              const isFirst = index === 0;

              return (
                <motion.div
                  key={rec.category}
                  initial={{ y: 16, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{ delay: 0.2 + index * 0.12, duration: 0.4 }}
                  className="relative"
                >
                  {/* Occasion label */}
                  <div className="flex items-center gap-2 mb-3">
                    <span className="text-xs tracking-[0.2em] uppercase text-muted-foreground">
                      {rec.label}
                    </span>
                    <span className="flex-1 h-px bg-border" />
                    <span className="text-xs text-muted-foreground/60">
                      {rec.meta.label}
                    </span>
                  </div>

                  {isFirst ? (
                    <BestMatchCard product={rec.product} />
                  ) : (
                    <QuizProductCard product={rec.product} delay={0} />
                  )}
                </motion.div>
              );
            })}
          </div>
        ) : (
          topResult?.product && (
            <motion.div
              initial={{ y: 16, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.25, duration: 0.4 }}
            >
              <BestMatchCard product={topResult.product} />
            </motion.div>
          )
        )}

        {/* Fragrance profile */}
        <motion.div
          initial={{ y: 16, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.5 }}
          className="border border-border rounded-2xl p-6 md:p-8"
        >
          <h3 className="text-sm font-semibold tracking-wide uppercase text-muted-foreground mb-5 text-center">
            Tu perfil de fragancias
          </h3>
          <div className="space-y-3">
            {(Object.entries(occasionScores) as [OccasionCategory, number][])
              .filter(([, score]) => score > 0)
              .sort((a, b) => b[1] - a[1])
              .map(([cat, score]) => {
                const meta = OCCASION_META[cat];
                const maxScore = Math.max(
                  ...Object.values(occasionScores)
                );
                const pct =
                  maxScore > 0 ? Math.round((score / maxScore) * 100) : 0;

                return (
                  <div key={cat} className="flex items-center gap-4">
                    <span className="text-xs font-medium w-20 text-right text-muted-foreground">
                      {meta.label}
                    </span>
                    <div className="flex-1 h-1.5 bg-border rounded-full overflow-hidden">
                      <motion.div
                        className="h-full bg-foreground rounded-full"
                        initial={{ width: 0 }}
                        animate={{ width: `${pct}%` }}
                        transition={{ duration: 0.6, delay: 0.6 }}
                      />
                    </div>
                    <span className="text-xs text-muted-foreground/60 w-8">
                      {pct}%
                    </span>
                  </div>
                );
              })}
          </div>
        </motion.div>

        {/* Actions */}
        <motion.div
          initial={{ y: 12, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.65 }}
          className="flex flex-col sm:flex-row gap-3 justify-center items-center"
        >
          <button
            onClick={onRestart}
            className="flex items-center gap-1.5 px-5 py-2.5 text-sm border border-border rounded-full hover:bg-accent transition-colors"
          >
            <ArrowsClockwise size={16} weight="light" />
            <span>Repetir test</span>
          </button>

          <button
            onClick={onBackToHub}
            className="flex items-center gap-1.5 px-5 py-2.5 text-sm border border-border rounded-full hover:bg-accent transition-colors"
          >
            <ArrowLeft size={16} weight="light" />
            <span>Probar otro test</span>
          </button>

          <button
            onClick={() => router.push("/collections/all")}
            className="flex items-center gap-1.5 px-5 py-2.5 text-sm font-medium bg-foreground text-background rounded-full hover:opacity-90 transition-opacity"
          >
            <span>Ver todos los perfumes</span>
            <ArrowRight size={16} weight="light" />
          </button>
        </motion.div>
      </div>
    </motion.div>
  );
}
