import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import { blogPosts, getBlogBySlug } from "@/lib/blogs";
import { business } from "@/lib/business";
import { buildBreadcrumbSchema, buildPageMetadata } from "@/lib/seo";
import SchemaMarkup from "@/components/shared/SchemaMarkup";
import ServiceCTABanner from "@/components/sections/ServiceCTABanner";
import { Calendar, User, Tag, ChevronRight, Clock, ArrowRight } from "lucide-react";
import BookServiceButton from "@/components/shared/BookServiceButton";

/* ─── Helpers ────────────────────────────────────────────────────── */

function getReadingTime(content: string): number {
  return Math.max(1, Math.ceil(content.split(/\s+/).length / 220));
}

/** Renders one paragraph block from the blog markdown content */
function renderBlock(block: string, i: number) {
  const b = block.trim();
  if (!b) return null;

  // ── Skip H1 (already in hero) ───────────────────────────────────
  if (b.startsWith("# ")) return null;

  // ── H2 Section heading — left crimson accent + top divider ──────
  if (b.startsWith("## ")) {
    return (
      <h2
        key={i}
        className="flex items-start gap-3 text-[17px] sm:text-[20px] font-heading font-bold text-foreground uppercase tracking-[0.04em] mt-12 mb-5 pt-7 border-t border-[#ebebeb]"
      >
        <span className="inline-block w-[3px] min-h-[1.3em] bg-primary rounded-full shrink-0 mt-[2px]" />
        {b.slice(3)}
      </h2>
    );
  }

  // ── H3 Sub-heading ───────────────────────────────────────────────
  if (b.startsWith("### ")) {
    return (
      <h3
        key={i}
        className="text-[14px] sm:text-[16px] font-heading font-bold text-foreground uppercase tracking-wide mt-7 mb-3"
      >
        {b.slice(4)}
      </h3>
    );
  }

  // ── Bold description block (starts with **) ───────────────────────
  if (b.startsWith("**")) {
    const lines = b.split("\n");
    return (
      <div key={i} className="mb-4">
        {lines.map((line, j) => {
          const isBold = line.startsWith("**");
          const text = line.replace(/\*\*/g, "").trim();
          if (!text) return null;
          return (
            <p
              key={j}
              className={
                isBold
                  ? "text-[13.5px] sm:text-[15px] font-heading font-semibold text-foreground mb-1 leading-snug"
                  : "text-[13px] sm:text-[14.5px] text-muted-foreground leading-relaxed"
              }
            >
              {text}
            </p>
          );
        })}
      </div>
    );
  }

  // ── Step N: content — numbered circle steps ──────────────────────
  if (/^Step \d+:/.test(b)) {
    const match = b.match(/^Step (\d+):\s*/);
    const num = match?.[1] ?? "1";
    const content = b.replace(/^Step \d+:\s*/, "");
    return (
      <div key={i} className="flex gap-3 mb-4 items-start">
        <div className="min-w-[26px] h-[26px] rounded-full bg-primary text-white text-[10px] font-bold font-heading flex items-center justify-center shrink-0 mt-[1px] shadow-sm shadow-primary/30">
          {num}
        </div>
        <p className="text-[13px] sm:text-[14.5px] text-muted-foreground leading-relaxed flex-1 pt-[3px]">
          {content}
        </p>
      </div>
    );
  }

  // ── Bullet list ───────────────────────────────────────────────────
  if (b.startsWith("- ")) {
    const items = b.split("\n").filter((l) => l.startsWith("- "));
    return (
      <ul key={i} className="space-y-3 mb-5 mt-1">
        {items.map((item, j) => {
          const raw = item.slice(2);
          const dashIdx = raw.indexOf(" — ");
          return (
            <li
              key={j}
              className="flex items-start gap-3 text-[13px] sm:text-[14.5px] text-muted-foreground leading-relaxed"
            >
              <div className="w-[6px] h-[6px] min-w-[6px] rounded-full bg-primary shrink-0 mt-[0.5em]" />
              <span>
                {dashIdx > -1 ? (
                  <>
                    <strong className="text-foreground font-semibold">{raw.slice(0, dashIdx)}</strong>
                    {raw.slice(dashIdx)}
                  </>
                ) : (
                  raw
                )}
              </span>
            </li>
          );
        })}
      </ul>
    );
  }

  // ── ⏱ Time / 🔧 Tools info row ──────────────────────────────────
  if (b.startsWith("⏱")) {
    const parts = b.split(" | ");
    return (
      <div
        key={i}
        className="flex flex-wrap gap-x-5 gap-y-2 my-5 px-4 py-3 bg-muted/40 rounded-xl border border-border/40"
      >
        {parts.map((part, j) => (
          <span
            key={j}
            className="inline-flex items-center gap-1.5 text-[11.5px] sm:text-[12.5px] font-medium text-muted-foreground font-body"
          >
            {part.trim()}
          </span>
        ))}
      </div>
    );
  }

  // ── ✅ Tip callout — green ────────────────────────────────────────
  if (b.startsWith("✅")) {
    return (
      <div
        key={i}
        className="flex gap-3 items-start bg-emerald-50 border border-emerald-200/80 rounded-xl p-4 my-5"
      >
        <span className="text-[17px] shrink-0 leading-none mt-[2px]">✅</span>
        <p className="text-[12.5px] sm:text-[13.5px] text-emerald-900 leading-relaxed">
          {b.slice(2).trim()}
        </p>
      </div>
    );
  }

  // ── ⚠️ Warning callout — crimson-tinted ──────────────────────────
  if (b.startsWith("⚠️")) {
    return (
      <div
        key={i}
        className="flex gap-3 items-start bg-primary/5 border border-primary/20 rounded-xl p-4 my-5"
      >
        <span className="text-[17px] shrink-0 leading-none mt-[2px]">⚠️</span>
        <p className="text-[12.5px] sm:text-[13.5px] text-foreground/85 leading-relaxed">
          {b.slice(2).trim()}
        </p>
      </div>
    );
  }

  // ── Contact info lines (📞 💬 📍 ⏰ 💳) ─────────────────────────
  const contactEmojis = ["📞", "💬", "📍", "⏰", "💳"];
  if (contactEmojis.some((e) => b.startsWith(e))) {
    return (
      <p key={i} className="text-[12.5px] sm:text-[13.5px] text-foreground/80 leading-relaxed mb-1.5 font-body">
        {b}
      </p>
    );
  }

  // ── Q: FAQ question ───────────────────────────────────────────────
  if (b.startsWith("Q:")) {
    return (
      <p
        key={i}
        className="text-[14px] sm:text-[15px] font-heading font-bold text-foreground mt-6 mb-2 leading-snug"
      >
        {b}
      </p>
    );
  }

  // ── A: FAQ answer ─────────────────────────────────────────────────
  if (b.startsWith("A:")) {
    return (
      <p
        key={i}
        className="text-[12.5px] sm:text-[14px] text-muted-foreground leading-relaxed mb-5 pl-4 border-l-[2px] border-primary/30"
      >
        {b}
      </p>
    );
  }

  // ── Default paragraph ────────────────────────────────────────────
  return (
    <p key={i} className="text-[13px] sm:text-[14.5px] text-muted-foreground leading-relaxed mb-4">
      {b}
    </p>
  );
}

/* ─── Static Params + Metadata ───────────────────────────────────── */

export async function generateStaticParams() {
  return blogPosts.map((b) => ({ slug: b.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const post = getBlogBySlug(slug);
  if (!post) return { title: "Post Not Found" };
  return buildPageMetadata({
    title: post.metaTitle,
    description: post.metaDescription,
    path: `/blog/${post.slug}`,
    keywords: [post.primaryKeyword, ...post.tags],
    type: "article",
    publishedTime: post.publishedAt,
    modifiedTime: post.updatedAt,
    authors: [post.author],
  });
}

/* ─── Page Component ─────────────────────────────────────────────── */

export default async function BlogPostPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const post = getBlogBySlug(slug);
  if (!post) notFound();

  const related = blogPosts
    .filter((p) => p.slug !== post.slug && p.tags.some((t) => post.tags.includes(t)))
    .slice(0, 2);

  const readTime = getReadingTime(post.content);

  const breadcrumbSchema = buildBreadcrumbSchema([
    { name: "Home", item: "/" },
    { name: "Blog", item: "/blog" },
    { name: post.title, item: `/blog/${post.slug}` },
  ]);

  const schema = {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: post.title,
    description: post.metaDescription,
    author: { "@type": "Person", name: post.author },
    publisher: { "@type": "Organization", name: business.name, url: business.url },
    datePublished: post.publishedAt,
    dateModified: post.updatedAt,
    url: `${business.url}/blog/${post.slug}`,
    ...(post.image ? { image: `${business.url}${post.image}` } : {}),
  };

  return (
    <>
      <SchemaMarkup schema={schema} />
      <SchemaMarkup schema={breadcrumbSchema} />

      {/* ══ HERO ════════════════════════════════════════════════════ */}
      <section className="relative pt-24 sm:pt-32 pb-10 sm:pb-14 bg-foreground overflow-hidden">
        {/* Mesh dark background */}
        <div className="absolute inset-0 bg-mesh-dark pointer-events-none opacity-70" />
        {/* Subtle noise texture */}
        <div
          className="absolute inset-0 pointer-events-none opacity-[0.035]"
          style={{
            backgroundImage:
              "url(\"data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.75' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E\")",
            backgroundSize: "200px",
          }}
        />

        <div className="relative container mx-auto px-5 sm:px-8 max-w-screen-xl">
          {/* Breadcrumb */}
          <nav
            className="flex items-center gap-1.5 text-[10.5px] text-primary-foreground/40 mb-6 font-label uppercase tracking-[0.14em]"
            aria-label="Breadcrumb"
          >
            <Link href="/" className="hover:text-primary transition-colors duration-200 shrink-0">
              Home
            </Link>
            <ChevronRight className="h-3 w-3 shrink-0" />
            <Link href="/blog" className="hover:text-primary transition-colors duration-200 shrink-0">
              Blog
            </Link>
            <ChevronRight className="h-3 w-3 shrink-0" />
            <span className="text-primary-foreground/55 truncate max-w-[160px] sm:max-w-xs normal-case tracking-normal font-body text-[11px]">
              {post.title}
            </span>
          </nav>

          <div className="max-w-3xl">
            {/* Tag pills */}
            <div className="flex flex-wrap gap-2 mb-5">
              {post.tags.slice(0, 3).map((tag) => (
                <span
                  key={tag}
                  className="inline-flex items-center gap-1 text-[9px] sm:text-[10px] font-label text-primary uppercase tracking-[0.2em] bg-primary/15 border border-primary/25 px-2.5 py-1 rounded-full"
                >
                  <Tag className="h-2.5 w-2.5 shrink-0" />
                  {tag}
                </span>
              ))}
            </div>

            {/* H1 */}
            <h1 className="font-heading font-black text-primary-foreground text-[24px] sm:text-[36px] lg:text-[44px] leading-[1.08] tracking-[-0.01em] uppercase mb-5 sm:mb-6">
              {post.title}
            </h1>

            {/* Meta row */}
            <div className="flex flex-wrap items-center gap-x-5 gap-y-2 text-primary-foreground/50 text-[11.5px] font-body">
              <div className="flex items-center gap-1.5">
                <User className="h-3.5 w-3.5 shrink-0" />
                <span>{post.author}</span>
              </div>
              <div className="flex items-center gap-1.5">
                <Calendar className="h-3.5 w-3.5 shrink-0" />
                <span>
                  {new Date(post.publishedAt).toLocaleDateString("en-IN", {
                    day: "numeric",
                    month: "long",
                    year: "numeric",
                  })}
                </span>
              </div>
              <div className="flex items-center gap-1.5">
                <Clock className="h-3.5 w-3.5 shrink-0" />
                <span>{readTime} min read</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ══ FEATURED IMAGE ══════════════════════════════════════════ */}
      {post.image && (
        <div className="relative h-52 sm:h-[300px] md:h-[420px] overflow-hidden bg-foreground/10">
          <img
            src={post.image}
            alt={post.title}
            className="w-full h-full object-cover"
          />
          {/* Gradient fades image into page background at bottom */}
          <div className="absolute inset-0 bg-gradient-to-t from-background/70 via-transparent to-transparent" />
        </div>
      )}

      {/* ══ ARTICLE + SIDEBAR ═══════════════════════════════════════ */}
      <section className="py-12 sm:py-16 lg:py-20 bg-background">
        <div className="container mx-auto px-5 sm:px-8 max-w-screen-xl">
          <div className="grid grid-cols-1 lg:grid-cols-[1fr_296px] xl:grid-cols-[1fr_316px] gap-10 lg:gap-14">

            {/* ─── Article ──────────────────────────────────────── */}
            <article className="min-w-0">
              {/* Prose body — max-width for readability on ultra-wide screens */}
              <div className="max-w-[70ch]">
                {post.content.split("\n\n").map((block, i) => renderBlock(block, i))}
              </div>

              {/* ─── In-article CTA ───────────────────────────── */}
              <div className="mt-12 max-w-[70ch] rounded-2xl overflow-hidden border border-primary/15">
                {/* Dark header */}
                <div className="bg-foreground px-5 sm:px-6 py-5 border-b border-white/10">
                  <div className="flex items-center gap-2.5 mb-1.5">
                    <div className="w-[3px] h-5 bg-primary rounded-full shrink-0" />
                    <h3 className="font-heading font-bold text-white text-[14px] sm:text-[16px] uppercase tracking-[0.06em]">
                      Ready to Service Your Royal Enfield?
                    </h3>
                  </div>
                  <p className="text-[12px] sm:text-[13px] text-white/55 ml-[calc(3px+10px)]">
                    Baba Royal Garage — Hubli&apos;s Royal Enfield specialist. 2 branches. Doorstep pickup available.
                  </p>
                </div>
                {/* CTA buttons */}
                <div className="bg-foreground/[0.97] px-5 sm:px-6 py-4 flex flex-col sm:flex-row gap-3">
                  {/* Book Service — opens booking modal, identical to Navbar */}
                  <BookServiceButton
                    className="flex-1 flex items-center justify-center overflow-hidden bg-primary hover:bg-primary-dark text-white px-6 py-3 rounded-xl font-heading font-bold text-[11.5px] uppercase tracking-[0.14em] transition-all duration-300 hover:-translate-y-0.5 hover:shadow-[0_0_24px_rgba(254,36,20,0.35)]"
                  />
                  {/* Call Now — outlined, matching navbar mobile style */}
                  <a
                    href={`tel:${business.phone1}`}
                    className="flex-1 flex items-center justify-center py-3 px-6 rounded-xl font-heading font-semibold text-[11.5px] uppercase tracking-[0.12em] text-white/65 hover:text-white transition-colors duration-200"
                    style={{ border: "1px solid rgba(255,255,255,0.10)" }}
                  >
                    Call Now
                  </a>
                </div>
              </div>

              {/* ─── Related Articles ────────────────────────── */}
              {related.length > 0 && (
                <div className="mt-12 max-w-[70ch]">
                  <div className="flex items-center gap-3 mb-5">
                    <span className="inline-block w-[3px] h-5 bg-primary rounded-full shrink-0" />
                    <h3 className="font-heading font-bold text-foreground text-[14px] sm:text-[16px] uppercase tracking-[0.06em]">
                      Related Articles
                    </h3>
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {related.map((p) => (
                      <Link
                        key={p.slug}
                        href={`/blog/${p.slug}`}
                        className="group relative bg-white rounded-xl overflow-hidden border border-[#e8e8e8] hover:border-primary/25 hover:shadow-[0_8px_28px_rgba(254,36,20,0.08)] transition-all duration-300 hover:-translate-y-0.5 flex flex-col"
                      >
                        {/* Thumbnail */}
                        {p.image && (
                          <div className="aspect-[16/9] overflow-hidden bg-foreground/5 shrink-0">
                            <img
                              src={p.image}
                              alt={p.title}
                              className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                            />
                          </div>
                        )}
                        <div className="p-4 flex-1 flex flex-col">
                          <h4 className="font-heading font-bold text-foreground text-[11.5px] uppercase tracking-[0.04em] group-hover:text-primary transition-colors duration-300 mb-1.5 leading-snug line-clamp-2">
                            {p.title}
                          </h4>
                          <p className="text-[11.5px] text-muted-foreground line-clamp-2 leading-relaxed flex-1">
                            {p.excerpt}
                          </p>
                          <div className="flex items-center gap-1 text-primary text-[10px] font-heading font-bold uppercase tracking-[0.12em] mt-3">
                            Read
                            <ArrowRight className="h-3 w-3 shrink-0 group-hover:translate-x-0.5 transition-transform duration-300" />
                          </div>
                        </div>
                      </Link>
                    ))}
                  </div>
                </div>
              )}
            </article>

            {/* ─── Sidebar (desktop only) ───────────────────── */}
            <aside className="hidden lg:block">
              <div className="sticky top-24 space-y-4">

                {/* Book a Service card */}
                <div className="rounded-2xl overflow-hidden border border-[#e4e4e4] bg-white shadow-[0_4px_24px_rgba(0,0,0,0.06)]">
                  {/* Dark header */}
                  <div className="bg-foreground px-5 py-4">
                    <div className="flex items-center gap-2 mb-0.5">
                      <div className="w-[3px] h-4 bg-primary rounded-full" />
                      <h3 className="font-heading font-bold text-white text-[12.5px] uppercase tracking-[0.1em]">
                        Book a Service
                      </h3>
                    </div>
                    <p className="text-[10.5px] text-white/45 font-body ml-[11px]">
                      Expert Royal Enfield care in Hubli.
                    </p>
                  </div>
                  {/* CTA buttons */}
                  <div className="p-4 space-y-2.5">
                    {/* Book Service — opens booking modal */}
                    <BookServiceButton
                      className="flex items-center justify-center w-full overflow-hidden bg-primary hover:bg-primary-dark text-white py-3 rounded-xl font-heading font-bold text-[11px] uppercase tracking-[0.14em] transition-all duration-300 hover:shadow-[0_0_20px_rgba(254,36,20,0.30)]"
                    />
                    {/* Call Now — outlined */}
                    <a
                      href={`tel:${business.phone1}`}
                      className="flex items-center justify-center w-full py-3 rounded-xl font-heading font-semibold text-[11px] uppercase tracking-[0.12em] text-foreground/55 hover:text-primary transition-colors duration-200"
                      style={{ border: "1px solid #e0e0e0" }}
                    >
                      Call Now
                    </a>
                  </div>
                  {/* Hours footer */}
                  <div className="px-4 pb-4 pt-0 border-t border-[#f0f0f0]">
                    <p className="text-[10.5px] text-muted-foreground text-center font-body pt-3">
                      Mon–Sat · 10 AM – 8 PM
                    </p>
                    <p className="text-[9.5px] text-muted-foreground/55 text-center font-label uppercase tracking-[0.14em] mt-0.5">
                      Doorstep pickup available
                    </p>
                  </div>
                </div>

                {/* Article info card */}
                <div className="rounded-2xl border border-[#e4e4e4] bg-white p-4 shadow-[0_2px_12px_rgba(0,0,0,0.04)]">
                  <h4 className="font-heading font-bold text-foreground text-[10.5px] uppercase tracking-[0.14em] mb-3">
                    About This Article
                  </h4>
                  <div className="space-y-2 text-[11px]">
                    <div className="flex items-center justify-between">
                      <span className="text-muted-foreground font-body">Author</span>
                      <span className="font-medium text-foreground">{post.author}</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-muted-foreground font-body">Published</span>
                      <span className="font-medium text-foreground">
                        {new Date(post.publishedAt).toLocaleDateString("en-IN", {
                          month: "short",
                          year: "numeric",
                        })}
                      </span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-muted-foreground font-body">Reading time</span>
                      <span className="font-medium text-foreground">{readTime} min</span>
                    </div>
                  </div>
                  {/* Tags */}
                  <div className="mt-3 pt-3 border-t border-[#f0f0f0] flex flex-wrap gap-1.5">
                    {post.tags.slice(0, 4).map((tag) => (
                      <span
                        key={tag}
                        className="text-[8.5px] font-label text-primary uppercase tracking-[0.15em] bg-primary/8 border border-primary/15 px-2 py-0.5 rounded-full"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Back to blog link */}
                <Link
                  href="/blog"
                  className="flex items-center gap-2 text-[10.5px] font-label text-muted-foreground hover:text-primary uppercase tracking-[0.14em] transition-colors duration-200"
                >
                  <ChevronRight className="h-3 w-3 rotate-180 shrink-0" />
                  All Articles
                </Link>
              </div>
            </aside>
          </div>
        </div>
      </section>

      <ServiceCTABanner />
    </>
  );
}
