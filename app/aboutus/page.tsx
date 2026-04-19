export default function AboutPage() {
  return (
    <main className="bg-white text-black">

      {/* HERO IMAGE */}
      <section className="relative w-full h-[80vh]">
        <img
          src="/about.jpg" 
          alt="About Lily Studio"
          className="w-full h-full object-cover"
        />

        {/* Optional overlay */}
        <div className="absolute inset-0 bg-black/20"></div>

        {/* Text on image */}
        <div className="absolute bottom-10 left-6 md:left-16 text-white">
          <h1 className="text-4xl md:text-6xl font-serif">
            About Lily Studio
          </h1>
        </div>
      </section>

      {/* TEXT SECTION */}
      <section className="px-6 md:px-20 py-16 max-w-3xl">
        <p className="text-lg leading-8 text-neutral-700">
          Lily Studio is built on the idea of timeless simplicity and quiet elegance. 
          We focus on creating pieces that are minimal, versatile, and made to last beyond trends. 
          Every collection is thoughtfully curated to help you build a wardrobe that feels effortless, 
          refined, and uniquely yours.
        </p>

        <p className="text-lg leading-8 text-neutral-700 mt-6">
          Our approach is slow and intentional — prioritizing quality over quantity, 
          and design over excess. Lily Studio is not just about fashion, 
          but about mindful choices and everyday confidence.
        </p>
      </section>

    </main>
  );
}