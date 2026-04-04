"use client";
import Link from "next/link";

const products = [
  {
    id: 1,
    name: "Classic White Shirt",
    price: "$35",
    image: "https://via.placeholder.com/500x650?text=White+Shirt",
  },
  {
    id: 2,
    name: "Beige Blazer",
    price: "$60",
    image: "https://via.placeholder.com/500x650?text=Beige+Blazer",
  },
  {
    id: 3,
    name: "Black Wide Pants",
    price: "$45",
    image: "https://via.placeholder.com/500x650?text=Wide+Pants",
  },
  {
    id: 4,
    name: "Minimal Dress",
    price: "$55",
    image: "https://via.placeholder.com/500x650?text=Minimal+Dress",
  },
];

export default function HomePage() {
  return (
    <main className="min-h-screen bg-white text-black">
      <header className="bg-white border-b border-gray-200 sticky top-0 z-50">
        <div className="flex items-center justify-between px-6 md:px-10 py-5">
          <div className="flex items-center gap-6">
            <button className="text-2xl">☰</button>

            <Link href="/home" className="text-3xl font-serif tracking-tight">
              Lily Studio
            </Link>

            <nav className="hidden md:flex gap-8 text-sm uppercase tracking-wider ml-6">
              <Link href="/home">New In</Link>
              <Link href="/shop">Shop</Link>
              <Link href="/trends">Trends</Link>
              <Link href="/sale">Sale</Link>
            </nav>
          </div>

          <div className="flex items-center gap-6 text-sm uppercase tracking-wider">
            <Link href="/search">Search</Link>
            <Link href="/">Account</Link>
            <Link href="/cart">Cart (0)</Link>
          </div>
        </div>
      </header>

      <section className="relative h-[85vh] w-full overflow-hidden">
        <img
          src="pulic/hero.jpg"
          className="absolute inset-0 h-full w-full object-cover"
        />

        <div className="absolute inset-0 bg-black/10"></div>

        <div className="relative z-10 flex h-full items-center px-6 md:px-12 lg:px-20">
          <div className="max-w-xl text-white">
            <p className="uppercase tracking-[0.2em] text-sm mb-4">
              New Season
            </p>

            <h2 className="text-5xl md:text-7xl font-serif leading-tight mb-6">
              Elegant essentials for every wardrobe
            </h2>

            <p className="text-white/90 mb-8 leading-7 text-base md:text-lg">
              Timeless silhouettes, soft neutrals, and thoughtful pieces designed
              for a refined and practical lifestyle.
            </p>

            <button className="border border-white px-8 py-3 uppercase text-sm tracking-wider text-white hover:bg-white hover:text-black transition">
              Shop Collection
            </button>
          </div>
        </div>
      </section>

      <section className="px-6 md:px-10 py-16">
        <div className="flex items-center justify-between mb-10">
          <h3 className="text-3xl font-serif">Featured Pieces</h3>
          <Link
            href="/shop"
            className="uppercase text-sm tracking-wider border-b border-black"
          >
            View All
          </Link>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
          {products.map((product) => (
            <div key={product.id}>
              <div className="bg-[#f8f6f2] overflow-hidden">
                <img
                  src={product.image}
                  alt={product.name}
                  className="w-full h-[420px] object-cover"
                />
              </div>

              <div className="pt-4">
                <h4 className="text-lg">{product.name}</h4>
                <p className="text-neutral-600 mb-3">{product.price}</p>
                <button className="w-full border border-black py-2 uppercase text-sm tracking-wider hover:bg-black hover:text-white transition">
                  Add to Cart
                </button>
              </div>
            </div>
          ))}
        </div>
      </section>

      <footer className="bg-white border-t border-gray-200 px-6 md:px-10 py-10">
        <div className="grid md:grid-cols-3 gap-8 text-sm">
          <div>
            <h4 className="font-semibold mb-3 uppercase tracking-wider">
              Lily Studio
            </h4>
            <p className="text-neutral-700 leading-6">
              Minimal, elegant fashion for women who value quality, simplicity,
              and timeless style.
            </p>
          </div>

          <div>
            <h4 className="font-semibold mb-3 uppercase tracking-wider">Help</h4>
            <div className="space-y-2 text-neutral-700">
              <p>Contact Us</p>
              <p>Shipping</p>
              <p>Returns</p>
            </div>
          </div>

          <div>
            <h4 className="font-semibold mb-3 uppercase tracking-wider">Follow</h4>
            <div className="space-y-2 text-neutral-700">
              <p>Instagram</p>
              <p>Facebook</p>
              <p>Pinterest</p>
            </div>
          </div>
        </div>
      </footer>
    </main>
  );
}