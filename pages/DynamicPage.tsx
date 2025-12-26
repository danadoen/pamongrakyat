import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import Layout from '../components/Layout';
import { getPageBySlug } from '../services/newsService';
import { Page } from '../types';

const DynamicPage: React.FC = () => {
  const { slug } = useParams<{ slug: string }>();
  const [page, setPage] = useState<Page | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const load = async () => {
      if (slug) {
        const data = await getPageBySlug(slug);
        setPage(data || null);
      }
      setLoading(false);
    };
    load();
  }, [slug]);

  if (loading) return <Layout><div className="text-center py-20">Memuat...</div></Layout>;
  if (!page) return <Layout><div className="text-center py-20">Halaman tidak ditemukan.</div></Layout>;

  return (
    <Layout>
      <div className="max-w-4xl mx-auto bg-white border border-gray-200 p-8 md:p-12 shadow-sm my-8 relative">
         {/* Decorative Corner */}
         <div className="absolute top-0 left-0 w-0 h-0 border-t-[60px] border-t-ink border-r-[60px] border-r-transparent"></div>
         
         <h1 className="font-serif text-4xl md:text-5xl font-bold mb-8 border-b-2 border-black pb-4 text-center">
            {page.title}
         </h1>
         
         <div className="prose prose-lg font-serif text-ink max-w-none prose-headings:font-bold prose-a:text-accent">
            {/* Rendering HTML content safely - in a real app use a sanitizer */}
            <div dangerouslySetInnerHTML={{ __html: page.content }} />
         </div>
      </div>
    </Layout>
  );
};

export default DynamicPage;