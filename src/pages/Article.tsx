import React from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { ChevronLeft } from 'lucide-react';
import { articles } from '@/data/articleContent';
import { Button } from '@/components/ui/button';
import { useUser } from '@/contexts/UserContext';

const Article = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { userData } = useUser();
  const { t } = useTranslation();
  
  const article = id ? articles[id] : null;
  
  const bodyText = article && userData.wiseBloomMode && article.bodyTextCellular 
    ? article.bodyTextCellular 
    : article?.bodyText;

  if (!article) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-heading mb-4">{t('article.not_found')}</h1>
          <Button onClick={() => navigate('/guide')}>
            {t('article.return')}
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="sticky top-0 bg-background border-b border-border z-10 px-6 py-4">
        <Button
          variant="ghost"
          onClick={() => navigate('/guide')}
          className="gap-2"
        >
          <ChevronLeft className="h-5 w-5" />
          {t('article.back')}
        </Button>
      </div>

      <article className="max-w-3xl mx-auto px-6 py-8 pb-24 animate-fade-in">
        <div className="mb-8 rounded-lg overflow-hidden">
          <img
            src={article.heroImage}
            alt={article.title}
            className="w-full h-64 object-cover"
          />
        </div>

        <h1 className="text-4xl font-heading font-semibold text-primary mb-6">
          {article.title}
        </h1>

        <div className="prose prose-lg max-w-none">
          <p className="text-foreground leading-relaxed text-lg whitespace-pre-line">
            {bodyText}
          </p>
        </div>
      </article>
    </div>
  );
};

export default Article;
