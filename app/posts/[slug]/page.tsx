import { sanity } from '@/lib/sanity';
import { notFound } from 'next/navigation';
import Image from 'next/image';

type Block = {
  _type: string;
  children?: Array<{
    text: string;
  }>;
};

type Post = {
  title: string;
  mainImage?: { asset: { url: string } };
  body?: Block[];
};

type SanityPost = {
  slug: {
    current: string;
  };
};

export async function generateStaticParams() {
  const posts = await sanity.fetch(`*[_type == "post"]{ slug }`);
  return posts.map((post: SanityPost) => ({ slug: post.slug.current }));
}

export default async function PostPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;

  const post: Post = await sanity.fetch(
    `*[_type == "post" && slug.current == $slug][0]{
      title,
      mainImage { asset -> { url } },
      body
    }`,
    { slug }
  );

  if (!post) return notFound();

  return (
    <main className='p-8 max-w-3xl mx-auto'>
      <h1 className='text-4xl font-bold mb-6'>{post.title}</h1>

      {post.mainImage?.asset?.url && (
        <Image
          src={post.mainImage.asset.url}
          alt={post.title}
          width={500}
          height={192}
          className='w-full h-64 object-cover rounded-xl mb-6'
        />
      )}

      <article className='prose prose-lg max-w-none'>
        {post.body?.map((block, i) =>
          block._type === 'block' ? (
            <p key={i}>
              {block.children
                ?.map((child: { text: string }) => child.text)
                .join('')}
            </p>
          ) : null
        )}
      </article>
    </main>
  );
}
