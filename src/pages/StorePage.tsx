import React, { useState } from 'react';
import {
  ShoppingBag,
  ExternalLink,
  CheckCircle2,
  Sparkles,
  Zap,
  Filter,
  ShieldCheck,
  Download,
  CreditCard,
  Code2,
  FileCheck,
  Layers,
} from 'lucide-react';
import { SEO } from '../components/common/SEO';
import { useStudio } from '../context/StudioContext';
import { StoreProduct, PaymentRecord } from '../types';
import { PaymentModal } from '../components/common/PaymentModal';
import { formatCurrency } from '../lib/payments';

export const StorePage: React.FC = () => {
  const { storeProducts, settings, currentUser } = useStudio();

  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [selectedProductForPayment, setSelectedProductForPayment] = useState<StoreProduct | null>(null);
  const [purchasedProducts, setPurchasedProducts] = useState<string[]>([]);
  const [currency, setCurrency] = useState<'INR' | 'USD'>('INR');

  const categories = ['All', 'SaaS Platforms', 'Agency & Portfolios', 'E-Commerce', 'Healthcare & Clinic'];

  const filteredProducts = storeProducts.filter(
    p => selectedCategory === 'All' || p.category === selectedCategory
  );

  const handleBuyClick = (product: StoreProduct) => {
    setSelectedProductForPayment(product);
  };

  const handlePaymentSuccess = (record: PaymentRecord) => {
    if (selectedProductForPayment) {
      setPurchasedProducts(prev => [...prev, selectedProductForPayment.id]);
    }
  };

  return (
    <>
      <SEO
        title="Ready-Made Websites & Turnkey Templates | Web Smith Labs"
        description="Explore and purchase production-ready website templates, full-stack SaaS boilerplates, and turnkey digital platforms built by Web Smith Labs."
        canonical="https://websmithlabs.com/store"
      />

      <div className="pt-24 sm:pt-32 pb-16 sm:pb-24 text-left transition-colors">
        {/* Header */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-12 sm:mb-16">
          <div className="max-w-3xl space-y-3 sm:space-y-4">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-indigo-500/30 bg-indigo-500/10 light:border-indigo-200 light:bg-indigo-50 text-xs font-mono font-semibold text-indigo-300 light:text-indigo-600">
              <ShoppingBag className="w-3.5 h-3.5" />
              <span>DIGITAL STORE &amp; TEMPLATES</span>
            </div>
            <h1 className="text-3xl sm:text-5xl lg:text-6xl font-extrabold text-white dark:text-white light:text-slate-900 tracking-tight leading-tight break-words">
              Production-Grade Websites &amp; Turnkey Platforms. Ready to Deploy.
            </h1>
            <p className="text-base sm:text-lg lg:text-xl text-zinc-400 dark:text-zinc-400 light:text-slate-600 leading-relaxed">
              Skip months of development. Buy pre-built, scalable web solutions with clean TypeScript code, Supabase schemas, and integrated Razorpay / Cashfree payments.
            </p>
          </div>

          {/* Controls Bar: Category Filters & Currency Toggle */}
          <div className="mt-8 sm:mt-10 flex flex-col md:flex-row md:items-center justify-between gap-4 pt-6 border-t border-[#252A36] dark:border-[#252A36] light:border-slate-200">
            {/* Category Filter Pills */}
            <div className="flex flex-wrap items-center gap-2">
              <span className="text-xs font-mono text-zinc-500 dark:text-zinc-500 light:text-slate-400 flex items-center gap-1 mr-1">
                <Filter className="w-3.5 h-3.5" />
                <span>Filter:</span>
              </span>
              {categories.map(cat => (
                <button
                  key={cat}
                  onClick={() => setSelectedCategory(cat)}
                  className={`px-3 py-1.5 rounded-xl text-xs font-medium transition-all cursor-pointer ${
                    selectedCategory === cat
                      ? 'bg-indigo-600 text-white shadow-md shadow-indigo-500/20'
                      : 'border border-[#252A36] dark:border-[#252A36] light:border-slate-200 bg-[#121620]/60 dark:bg-[#121620]/60 light:bg-slate-100 text-zinc-400 hover:text-white dark:hover:text-white light:text-slate-600 light:hover:text-slate-900'
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>

            {/* Currency Selector & Security Badge */}
            <div className="flex items-center gap-3">
              <div className="flex items-center p-1 rounded-xl border border-[#252A36] dark:border-[#252A36] light:border-slate-200 bg-[#121620] dark:bg-[#121620] light:bg-slate-100 text-xs font-mono">
                <button
                  onClick={() => setCurrency('INR')}
                  className={`px-3 py-1 rounded-lg transition-colors cursor-pointer ${
                    currency === 'INR' ? 'bg-indigo-600 text-white font-bold' : 'text-zinc-400 hover:text-white dark:hover:text-white light:text-slate-600 light:hover:text-slate-900'
                  }`}
                >
                  INR (₹)
                </button>
                <button
                  onClick={() => setCurrency('USD')}
                  className={`px-3 py-1 rounded-lg transition-colors cursor-pointer ${
                    currency === 'USD' ? 'bg-indigo-600 text-white font-bold' : 'text-zinc-400 hover:text-white dark:hover:text-white light:text-slate-600 light:hover:text-slate-900'
                  }`}
                >
                  USD ($)
                </button>
              </div>

              <div className="hidden sm:inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-mono text-emerald-400 light:text-emerald-700 bg-emerald-500/10 light:bg-emerald-50 border border-emerald-500/20 light:border-emerald-300">
                <ShieldCheck className="w-3.5 h-3.5" />
                <span>Razorpay &amp; Cashfree Protected</span>
              </div>
            </div>
          </div>
        </div>

        {/* Products Grid */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredProducts.map(product => {
              const isPurchased = purchasedProducts.includes(product.id);
              const price = currency === 'INR' ? product.price_inr : product.price_usd;
              const originalPrice = currency === 'INR' ? product.original_price_inr : product.price_usd * 2;

              return (
                <div
                  key={product.id}
                  className="flex flex-col rounded-3xl border border-[#252A36] dark:border-[#252A36] light:border-slate-200 bg-[#121620]/80 dark:bg-[#121620]/80 light:bg-white overflow-hidden shadow-xl hover:border-indigo-500/40 transition-all duration-300 group"
                >
                  {/* Thumbnail Container */}
                  <div className="relative aspect-video w-full overflow-hidden bg-black/40">
                    <img
                      src={product.thumbnail_url}
                      alt={product.title}
                      className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                      loading="lazy"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-[#121620] via-transparent to-transparent opacity-80" />

                    {/* Badge */}
                    {product.badge && (
                      <div className="absolute top-3 left-3">
                        <span className="px-2.5 py-1 rounded-lg text-[10px] font-mono font-bold tracking-wider uppercase bg-indigo-600 text-white shadow-lg">
                          {product.badge}
                        </span>
                      </div>
                    )}

                    {/* Category */}
                    <div className="absolute bottom-3 left-3">
                      <span className="px-2 py-0.5 rounded-md text-[10px] font-mono font-semibold bg-black/60 backdrop-blur-md text-zinc-300 border border-white/10">
                        {product.category}
                      </span>
                    </div>
                  </div>

                  {/* Body Content */}
                  <div className="p-6 flex-grow flex flex-col justify-between space-y-5">
                    <div>
                      <h3 className="text-xl font-bold text-white dark:text-white light:text-slate-900 group-hover:text-indigo-400 transition-colors">
                        {product.title}
                      </h3>
                      <p className="text-xs text-zinc-400 dark:text-zinc-400 light:text-slate-600 mt-1.5 leading-relaxed line-clamp-2">
                        {product.tagline}
                      </p>

                      {/* Tech Stack Pills */}
                      <div className="flex flex-wrap gap-1.5 mt-4">
                        {product.tech_stack.map(tech => (
                          <span
                            key={tech}
                            className="px-2 py-0.5 rounded-md text-[10px] font-mono bg-white/[0.04] dark:bg-white/[0.04] light:bg-slate-100 text-zinc-300 dark:text-zinc-300 light:text-slate-700 border border-white/5 light:border-slate-200"
                          >
                            {tech}
                          </span>
                        ))}
                      </div>

                      {/* Key Features Checklist */}
                      <ul className="mt-4 space-y-2">
                        {product.features.slice(0, 3).map((feat, i) => (
                          <li key={i} className="flex items-start gap-2 text-xs text-zinc-300 dark:text-zinc-300 light:text-slate-700">
                            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0 mt-0.5" />
                            <span>{feat}</span>
                          </li>
                        ))}
                      </ul>
                    </div>

                    {/* Price and Action Bar */}
                    <div className="pt-4 border-t border-[#252A36] dark:border-[#252A36] light:border-slate-200">
                      <div className="flex items-baseline justify-between mb-4">
                        <div>
                          <div className="flex items-baseline gap-2">
                            <span className="text-2xl font-extrabold text-white dark:text-white light:text-slate-900">
                              {formatCurrency(price, currency)}
                            </span>
                            {originalPrice > price && (
                              <span className="text-xs text-zinc-500 line-through">
                                {formatCurrency(originalPrice, currency)}
                              </span>
                            )}
                          </div>
                          <span className="text-[10px] font-mono text-zinc-400 block">
                            Commercial License &amp; Full Code
                          </span>
                        </div>

                        {product.live_demo_url && (
                          <a
                            href={product.live_demo_url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center gap-1 text-xs font-semibold text-indigo-400 hover:text-indigo-300 transition-colors"
                          >
                            <span>Live Demo</span>
                            <ExternalLink className="w-3.5 h-3.5" />
                          </a>
                        )}
                      </div>

                      {isPurchased ? (
                        <div className="p-3 rounded-xl bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-between text-xs text-emerald-400">
                          <span className="font-semibold flex items-center gap-1.5">
                            <CheckCircle2 className="w-4 h-4" />
                            <span>Licensed &amp; Ready</span>
                          </span>
                          <button
                            onClick={() => alert(`Starting download for ${product.title} Source Code Package (.zip)...`)}
                            className="inline-flex items-center gap-1 px-3 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold transition-colors cursor-pointer"
                          >
                            <Download className="w-3.5 h-3.5" />
                            <span>Download Zip</span>
                          </button>
                        </div>
                      ) : (
                        <button
                          onClick={() => handleBuyClick(product)}
                          className="w-full inline-flex items-center justify-center gap-2 px-5 py-3 rounded-xl text-sm font-bold text-white bg-gradient-to-r from-indigo-500 via-indigo-600 to-purple-600 hover:from-indigo-400 hover:to-purple-500 shadow-lg shadow-indigo-500/25 transition-all duration-200 cursor-pointer group-hover:shadow-indigo-500/40"
                        >
                          <CreditCard className="w-4 h-4" />
                          <span>Buy Template ({formatCurrency(price, currency)})</span>
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Guarantee Banner */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-16 sm:mt-20">
          <div className="rounded-3xl border border-indigo-500/30 dark:border-indigo-500/30 light:border-indigo-200 bg-gradient-to-br from-[#121620] via-indigo-950/20 to-[#121620] dark:from-[#121620] dark:via-indigo-950/20 dark:to-[#121620] light:from-indigo-50/80 light:via-white light:to-purple-50/40 p-6 sm:p-12 text-center space-y-4 shadow-xl">
            <div className="w-12 h-12 rounded-2xl bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 light:text-indigo-600 flex items-center justify-center mx-auto">
              <Zap className="w-6 h-6" />
            </div>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-white dark:text-white light:text-slate-900 tracking-tight">
              Need Custom Modifications or Turnkey Setup?
            </h2>
            <p className="text-xs sm:text-base text-zinc-300 dark:text-zinc-300 light:text-slate-600 max-w-2xl mx-auto leading-relaxed">
              Every template purchased from Web Smith Labs can be tailored, rebranded, and connected to your custom domain, Supabase instance, or Razorpay / Cashfree accounts by our engineering team.
            </p>
            <div className="pt-2">
              <a
                href="/start-project?projectType=Custom+Digital+Solution"
                className="inline-flex items-center gap-2 px-6 py-3 rounded-xl text-xs sm:text-sm font-semibold text-white bg-indigo-600 hover:bg-indigo-500 transition-colors shadow-lg shadow-indigo-500/25 cursor-pointer"
              >
                <span>Hire Us to Customize Your Template</span>
              </a>
            </div>
          </div>
        </div>
      </div>

      {/* Payment Modal */}
      {selectedProductForPayment && (
        <PaymentModal
          isOpen={Boolean(selectedProductForPayment)}
          onClose={() => setSelectedProductForPayment(null)}
          title={`Purchase License: ${selectedProductForPayment.title}`}
          description={`Commercial License for ${selectedProductForPayment.title} including complete source code and Supabase schemas.`}
          amount={currency === 'INR' ? selectedProductForPayment.price_inr : selectedProductForPayment.price_usd}
          currency={currency}
          paymentType="template_purchase"
          productId={selectedProductForPayment.id}
          onPaymentComplete={handlePaymentSuccess}
        />
      )}
    </>
  );
};
