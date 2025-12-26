import React from 'react';
import { Link } from 'react-router-dom';
import { Article } from '../types';

interface Props {
  article: Article;
  featured?: boolean;
  compact?: boolean;
}

const ArticleCard: React.FC<Props> = ({ article, featured, compact }) => {
  if (featured) {
    return (
      <div className="col-span-1 md:col-span-2 lg:col-span-3 border-b-2 border-ink pb-6 mb-6 group">
        <div className="grid md:grid-cols-2 gap-6">
          <div className="overflow-hidden border border-ink bg-gray-200 relative">
            <img 
              src={article.imageUrl} 
              alt={article.title} 
              className="w-full h-64 md:h-96 object-cover grayscale group-hover:grayscale-0 transition-all duration-500"
            />
            {article.isBreaking && (
              <span className="absolute top-0 left-0 bg-accent text-white px-3 py-1 text-xs font-bold uppercase tracking-wider animate-pulse">
                Breaking News
              </span>
            )}
          </div>
          <div className="flex flex-col justify-center">
            <span className="text-accent font-bold text-xs uppercase tracking-widest mb-2">{article.category}</span>
            <Link to={`/berita/${article.slug}`}>
              <h2 className="font-serif text-3xl md:text-5xl font-bold leading-tight mb-4 hover:text-accent transition-colors">
                {article.title}
              </h2>
            </Link>
            <p className="font-serif text-lg leading-relaxed text-ink-light mb-4 line-clamp-3 border-l-4 border-gray-300 pl-4">
              {article.summary}
            </p>
            <div className="mt-auto text-xs font-mono text-gray-500 flex items-center gap-2">
              <span className="uppercase font-bold">{article.author}</span>
              <span>&bull;</span>
              <span>{new Date(article.createdAt).toLocaleDateString('id-ID')}</span>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (compact) {
    return (
      <div className="flex gap-4 mb-4 border-b border-gray-300 pb-4">
        <div className="w-24 h-24 flex-shrink-0 border border-gray-400 overflow-hidden">
             <img src={article.imageUrl} alt={article.title} className="w-full h-full object-cover grayscale hover:grayscale-0 transition-all"/>
        </div>
        <div>
             <span className="text-accent text-[10px] uppercase font-bold">{article.category}</span>
             <Link to={`/berita/${article.slug}`}>
                <h4 className="font-serif font-bold text-lg leading-tight hover:underline">{article.title}</h4>
             </Link>
             <span className="text-xs text-gray-500 font-mono mt-1 block">{new Date(article.createdAt).toLocaleDateString()}</span>
        </div>
      </div>
    );
  }

  // Default Grid Card
  return (
    <div className="flex flex-col h-full border-r border-gray-300 pr-4 last:border-r-0 mb-8">
      <div className="mb-4 overflow-hidden border border-ink relative h-48">
        <img 
            src={article.imageUrl} 
            alt={article.title} 
            className="w-full h-full object-cover grayscale hover:grayscale-0 transition-all duration-300"
        />
      </div>
      <span className="text-accent text-xs uppercase font-bold mb-1">{article.category}</span>
      <Link to={`/berita/${article.slug}`}>
        <h3 className="font-serif text-2xl font-bold leading-tight mb-2 hover:underline decoration-2 decoration-accent">
          {article.title}
        </h3>
      </Link>
      <p className="text-sm text-ink-light mb-4 font-sans leading-relaxed line-clamp-3 flex-grow">
        {article.summary}
      </p>
      <div className="mt-auto pt-2 border-t border-gray-300 text-xs font-mono text-gray-500">
         {article.author} &bull; {new Date(article.createdAt).toLocaleDateString()}
      </div>
    </div>
  );
};

export default ArticleCard;