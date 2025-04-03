import { sanity } from '@/lib/sanity';
import Link from 'next/link';
import Image from 'next/image';

type Post = {
  _id: string;
  title: string;
  slug: { current: string };
  mainImage?: { asset: { url: string } };
};

export default async function HomePage() {
  const posts: Post[] = await sanity.fetch(`
    *[_type == "post"]{
      _id,
      title,
      slug,
      mainImage {
        asset -> {
          url
        }
      }
    }
  `);

  return (
    <main className='p-8 max-w-6xl mx-auto'>
      <h1 className='text-4xl font-bold mb-8'>Últimos posts</h1>
      <div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6'>
        {posts.map((post) => (
          <Link
            key={post._id}
            href={`/posts/${post.slug.current}`}
            className='block rounded-xl overflow-hidden shadow hover:shadow-lg transition'
          >
            {post.mainImage?.asset?.url && (
              <Image
                src={post.mainImage.asset.url}
                alt={post.title}
                width={500}
                height={192}
                className='w-full h-48 object-cover'
              />
            )}
            <div className='p-4 bg-white'>
              <h2 className='text-xl font-semibold'>{post.title}</h2>
            </div>
          </Link>
        ))}
      </div>
    </main>
  );
}
