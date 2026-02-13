'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { PageContainer } from '@/components/ui/page-container';
import { CaretDown } from 'phosphor-react';

interface FAQItem {
  question: string;
  answer: string;
  category: string;
}

const faqData: FAQItem[] = [
  {
    category: 'Orders & Shipping',
    question: 'How long does shipping take?',
    answer: 'Standard shipping typically takes 3-5 business days within the United States. Express shipping options are available at checkout for faster delivery.'
  },
  {
    category: 'Orders & Shipping',
    question: 'Do you offer international shipping?',
    answer: 'Yes! We ship to most countries worldwide. International shipping times vary by destination, typically 7-14 business days.'
  },
  {
    category: 'Orders & Shipping',
    question: 'How can I track my order?',
    answer: 'Once your order ships, you will receive a tracking number via email. You can use this number to track your package on our website or the carrier website.'
  },
  {
    category: 'Products',
    question: 'Are your perfumes authentic?',
    answer: 'Absolutely! All our fragrances are 100% authentic and sourced directly from authorized distributors.'
  },
  {
    category: 'Products',
    question: 'What size bottles do you offer?',
    answer: 'We offer various sizes including 30ml, 50ml, and 100ml bottles. Availability varies by fragrance.'
  },
  {
    category: 'Products',
    question: 'How should I store my perfume?',
    answer: 'Store your perfume in a cool, dry place away from direct sunlight and heat. Keep the bottle tightly closed when not in use to preserve the scent.'
  },
  {
    category: 'Returns & Exchanges',
    question: 'What is your return policy?',
    answer: 'We accept returns within 30 days of purchase for unopened items. Opened fragrances can be exchanged if you are not satisfied with the scent.'
  },
  {
    category: 'Returns & Exchanges',
    question: 'How do I initiate a return?',
    answer: 'Contact our customer service team at contact@sameperfumes.com with your order number. We will provide you with a return shipping label and instructions.'
  },
  {
    category: 'Account & Payment',
    question: 'Do I need an account to place an order?',
    answer: 'No, you can checkout as a guest. However, creating an account allows you to track orders easily and save your preferences.'
  },
  {
    category: 'Account & Payment',
    question: 'What payment methods do you accept?',
    answer: 'We accept all major credit cards (Visa, MasterCard, American Express), PayPal, Apple Pay, and Google Pay.'
  }
];

export default function FAQPage() {
  const [openIndex, setOpenIndex] = useState<number | null>(null);
  const [selectedCategory, setSelectedCategory] = useState<string>('All');

  const categories = ['All', ...Array.from(new Set(faqData.map(item => item.category)))];
  
  const filteredFAQs = selectedCategory === 'All' 
    ? faqData 
    : faqData.filter(item => item.category === selectedCategory);

  return (
    <PageContainer>
      {/* Header */}
      <div className="bg-primary text-primary-foreground py-16 px-6">
        <div className="container mx-auto max-w-4xl">
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-4xl md:text-5xl font-bold mb-4"
            style={{ fontFamily: 'var(--font-serif)' }}
          >
            Frequently Asked Questions
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-lg text-primary-foreground/90"
          >
            Find answers to common questions
          </motion.p>
        </div>
      </div>

      <div className="container mx-auto max-w-4xl px-6 py-16">
        {/* Category Filter */}
        <div className="flex flex-wrap gap-2 mb-12">
          {categories.map((category) => (
            <button
              key={category}
              onClick={() => setSelectedCategory(category)}
              className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
                selectedCategory === category
                  ? 'bg-primary text-primary-foreground'
                  : 'bg-muted text-muted-foreground hover:bg-muted/80'
              }`}
            >
              {category}
            </button>
          ))}
        </div>

        {/* FAQ List */}
        <div className="space-y-4">
          {filteredFAQs.map((faq, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.05 }}
              className="border border-border rounded-lg overflow-hidden bg-card shadow-sm"
            >
              <button
                onClick={() => setOpenIndex(openIndex === index ? null : index)}
                className="w-full px-6 py-4 flex items-center justify-between text-left hover:bg-accent transition-colors"
              >
                <div className="flex-1">
                  <span className="text-xs font-medium text-primary mb-1 block">
                    {faq.category}
                  </span>
                  <span className="text-lg font-semibold text-foreground">
                    {faq.question}
                  </span>
                </div>
                <CaretDown
                  size={20}
                  weight="bold"
                  className={`text-muted-foreground transition-transform shrink-0 ml-4 ${
                    openIndex === index ? 'rotate-180' : ''
                  }`}
                />
              </button>
              
              <AnimatePresence>
                {openIndex === index && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: 'auto', opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.3 }}
                    className="overflow-hidden"
                  >
                    <div className="px-6 pb-4 pt-2 text-muted-foreground border-t border-border">
                      {faq.answer}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          ))}
        </div>

        {/* Contact CTA */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="mt-16 text-center bg-muted rounded-lg p-8"
        >
          <h3 className="text-2xl font-bold mb-4 text-foreground" style={{ fontFamily: 'var(--font-serif)' }}>
            Still have questions?
          </h3>
          <p className="text-muted-foreground mb-6">
            Can't find the answer you're looking for? Please contact our customer service team.
          </p>
          <a
            href="/pages/contact"
            className="inline-block bg-primary text-primary-foreground px-8 py-3 rounded-full font-semibold hover:bg-primary/90 transition-colors"
          >
            Contact Us
          </a>
        </motion.div>
      </div>
    </PageContainer>
  );
}
