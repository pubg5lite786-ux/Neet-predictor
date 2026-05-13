'use client';

import { useFetch } from '@/src/hooks/useFetch';
import { API_ENDPOINTS } from '@/src/config';
import Link from 'next/link';

interface NewsArticle {
  _id: string;
  title: string;
  description: string;
  image: string;
  publishedAt: string;
}

export default function NewsSection() {
  const { data, loading } = useFetch<{ articles: NewsArticle[] }>(API_ENDPOINTS.NEWS.LIST);

  if (loading) return <div className="text-center py-20">Loading news...</div>;

  const articles = data?.articles?.slice(0, 3) || [];

  return (
    <section className="py-20 px-4">
      <div className="max-w-7xl mx-auto">
        <h2 className="text-4xl font-bold mb-12">📰 Latest NEET Updates</h2>
        <div className="grid md:grid-cols-3 gap-8">
          {articles.map(article => (
            <div key={article._id} className="bg-white rounded-lg shadow-lg overflow-hidden hover:shadow-xl transition">
              {article.image && (
                <img
                  src={article.image}
                  alt={article.title}
                  className="w-full h-48 object-cover"
                />
              )}
              <div className="p-4">
                <h3 className="text-lg font-bold mb-2">{article.title}</h3>
                <p className="text-gray-600 mb-4">{article.description}</p>
                <Link href={`/news/${article._id}`} className="text-blue-600 hover:underline">
                  Read More →
                </Link>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
