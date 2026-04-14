import Link from "next/link";

const products = [
  {
    id: 1,
    name: "Classic White Shirt",
    price: "$35",
    image: "https://picsum.photos/500/650?random=1",
  },
  {
    id: 2,
    name: "Beige Blazer",
    price: "$60",
    image: "https://picsum.photos/500/650?random=2",
  },
  {
    id: 3,
    name: "Black Wide Pants",
    price: "$45",
    image: "https://picsum.photos/500/650?random=3",
  },
  {
    id: 4,
    name: "Minimal Dress",
    price: "$55",
    image: "https://picsum.photos/500/650?random=4",
  },
];

export default function HomePage() {
  return (
    <main className="min-h-screen bg-white text-black">
      
      {/* HERO SECTION */}
      <section className="relative h-[90vh] w-full">
        <img
          src="/mini.jpg"
          alt="Hero"
          className="absolute inset-0 w-full h-full object-cover"
        />

        <div className="absolute inset-0 bg-black/20"></div>

        <div className="relative z-10 h-full flex items-center px-6 md:px-16">
          <div className="max-w-xl text-white">
            <p className="uppercase tracking-[0.2em] text-sm mb-4">New Season</p>

            <h2 className="text-5xl md:text-7xl font-serif leading-tight mb-6">
              Elegant essentials for every wardrobe
            </h2>

            <p className="mb-8 text-lg">
              Timeless silhouettes and modern minimalism designed for everyday elegance.
            </p>

            <button className="border border-white px-8 py-3 uppercase text-sm tracking-wider hover:bg-white hover:text-black transition">
              Shop Collection
            </button>
          </div>
        </div>
      </section>

      {/* PRODUCTS */}
      <section className="px-6 md:px-10 py-20">
        <div className="flex items-center justify-between mb-10">
          <h3 className="text-3xl md:text-4xl font-serif">Featured Pieces</h3>
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

    </main>
  );
}