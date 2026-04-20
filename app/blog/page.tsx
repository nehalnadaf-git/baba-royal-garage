import type { Metadata } from "next";
import { blogPosts } from "@/lib/blogs";
import { buildBreadcrumbSchema, buildPageMetadata } from "@/lib/seo";
import Link from "next/link";
import { ArrowRight, Calendar, User, Tag, Clock } from "lucide-react";
import PageHero from "@/components/shared/PageHero";
import SchemaMarkup from "@/components/shared/SchemaMarkup";

export const metadata: Metadata = buildPageMetadata({
  title: "Royal Enfield Blog | Tips, Guides & News | Baba Royal Garage Hubli",
  description:
    "Royal Enfield maintenance tips, servicing guides, and buying advice from Baba Royal Garage, Hubli's dedicated RE specialist.",
  path: "/blog",
  keywords: ["Royal Enfield blog", "RE maintenance tips Hubli", "Baba Royal Garage guides"],
});

function getReadingTime(content: string): number {
  return Math.max(1, Math.ceil(content.split(/\s+/).length / 220));
}

export default function BlogPage() {
  const breadcrumbSchema = buildBreadcrumbSchema([
    { name: "Home", item: "/" },
    { name: "Blog", item: "/blog" },
  ]);

  return (
    <>
      <SchemaMarkup schema={breadcrumbSchema} />
      <PageHero
        overline="Knowledge Hub"
        title="Royal Enfield Tips & Guides"
        subtitle="Expert Royal Enfield advice from Hubli's specialist garage — maintenance, monsoon care, long ride preparation and more."
      />

      <section className="py-14 sm:py-20 bg-[hsl(210,5%,95%)]">
        <div className="container mx-auto px-5 sm:px-8 max-w-screen-xl">

          {/* Article count label */}
          <div className="flex items-center gap-4 mb-8 sm:mb-10">
            <p className="font-label text-[10px] sm:text-[11px] uppercase tracking-[0.22em] text-muted-foreground shrink-0">
              {blogPosts.length} Article{blogPosts.length !== 1 ? "s" : ""}
            </p>
            <div className="h-px flex-1 bg-border/60" />
          </div>

          {/* Cards grid — 1 col on mobile, 2 on sm, 3 on lg */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 sm:gap-6">
            {blogPosts.map((post) => {
              const readTime = getReadingTime(post.content);
              return (
                <Link
                  key={post.slug}
                  href={`/blog/${post.slug}`}
                  className="group relative bg-white rounded-2xl overflow-hidden border border-[#e8e8e8] shadow-[0_2px_16px_rgba(0,0,0,0.05)] hover:border-primary/20 hover:shadow-[0_12px_40px_rgba(254,36,20,0.09)] transition-all duration-300 hover:-translate-y-1.5 cursor-pointer flex flex-col"
                >
                  {/* Crimson accent line on hover */}
                  <div className="absolute top-0 left-0 right-0 h-[3px] bg-gradient-to-r from-transparent via-primary to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 z-10" />

                  {/* Featured Image */}
                  {post.image ? (
                    <div className="relative aspect-[16/9] overflow-hidden bg-foreground/5 shrink-0">
                      <img
                        src={post.image}
                        alt={post.title}
                        className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-[1.06]"
                      />
                      {/* Gradient overlay */}
                      <div className="absolute inset-0 bg-gradient-to-t from-black/45 via-black/5 to-transparent" />
                      {/* Tag pills on image */}
                      <div className="absolute bottom-3 left-3 flex flex-wrap gap-1.5">
                        {post.tags.slice(0, 2).map((tag) => (
                          <span
                            key={tag}
                            className="inline-flex items-center gap-1 font-label text-[8.5px] text-white uppercase tracking-[0.18em] bg-black/55 backdrop-blur-sm border border-white/20 px-2 py-0.5 rounded-full"
                          >
                            <Tag className="h-2 w-2 shrink-0" />
                            {tag}
                          </span>
                        ))}
                      </div>
                      {/* Reading time badge */}
                      <div className="absolute top-3 right-3 inline-flex items-center gap-1 text-white font-label text-[8.5px] uppercase tracking-[0.14em] bg-black/55 backdrop-blur-sm border border-white/20 px-2 py-0.5 rounded-full">
                        <Clock className="h-2 w-2 shrink-0" />
                        {readTime} min read
                      </div>
                    </div>
                  ) : (
                    /* Fallback when no image */
                    <div className="aspect-[16/9] bg-gradient-to-br from-foreground/5 to-primary/8 shrink-0 flex items-center justify-center">
                      <span className="font-heading text-primary/25 text-[56px] font-black uppercase leading-none">RE</span>
                    </div>
                  )}

                  {/* Card body */}
                  <div className="p-5 sm:p-6 flex-1 flex flex-col gap-3">
                    {/* Tag pills (only when no image) */}
                    {!post.image && (
                      <div className="flex flex-wrap gap-1.5">
                        {post.tags.slice(0, 2).map((tag) => (
                          <span
                            key={tag}
                            className="inline-flex items-center gap-1 font-label text-[9px] text-primary uppercase tracking-[0.18em] bg-primary/8 border border-primary/15 px-2.5 py-1 rounded-full"
                          >
                            <Tag className="h-2.5 w-2.5 shrink-0" />
                            {tag}
                          </span>
                        ))}
                      </div>
                    )}

                    {/* Title */}
                    <h2 className="font-heading font-bold text-foreground text-[14px] sm:text-[15px] uppercase tracking-[0.04em] leading-snug group-hover:text-primary transition-colors duration-300">
                      {post.title}
                    </h2>

                    {/* Excerpt */}
                    <p className="font-body text-muted-foreground text-[12.5px] sm:text-[13px] leading-relaxed line-clamp-3 flex-1">
                      {post.excerpt}
                    </p>

                    {/* Meta row */}
                    <div className="flex items-center justify-between font-label text-[10px] text-muted-foreground/65 pt-3 border-t border-[#f0f0f0] mt-auto">
                      <div className="flex items-center gap-1.5">
                        <User className="h-3 w-3 shrink-0" />
                        <span>{post.author}</span>
                      </div>
                      <div className="flex items-center gap-3">
                        <div className="flex items-center gap-1">
                          <Calendar className="h-3 w-3 shrink-0" />
                          <span>
                            {new Date(post.publishedAt).toLocaleDateString("en-IN", {
                              day: "numeric",
                              month: "short",
                              year: "numeric",
                            })}
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Read More footer */}
                  <div className="px-5 sm:px-6 py-3.5 border-t border-[#f0f0f0] bg-[#fafafa] group-hover:bg-primary/[0.03] transition-colors duration-300 flex items-center justify-between">
                    <span className="text-primary font-heading font-bold text-[10.5px] uppercase tracking-[0.14em] flex items-center gap-1.5">
                      Read Article
                      <ArrowRight className="h-3.5 w-3.5 shrink-0 group-hover:translate-x-1 transition-transform duration-300" />
                    </span>
                    <span className="text-[10px] font-label text-muted-foreground/50 uppercase tracking-wider">
                      {readTime} min
                    </span>
                  </div>
                </Link>
              );
            })}
          </div>
        </div>
      </section>
    </>
  );
}
