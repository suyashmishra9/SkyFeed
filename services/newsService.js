const NEWS_API_KEY = '4bf85a5f2f7e479d80c5f32e52258aa6';
const NEWS_BASE_URL = 'https://newsapi.org/v2';

export class NewsService {
  static async getNewsHeadlines(category, country = 'us') {
    try {
      let url = `${NEWS_BASE_URL}/top-headlines?country=${country}&apiKey=${NEWS_API_KEY}`;
      
      if (category) {
        url += `&category=${category}`;
      }
      
      const response = await fetch(url);
      
      if (!response.ok) {
        throw new Error(`News API error: ${response.status}`);
      }
      
      const data = await response.json();
      return data.articles.filter(article => article.title && article.description);
    } catch (error) {
      console.error('Error fetching news data:', error);
      throw error;
    }
  }

  static async searchNews(query, language = 'en') {
    try {
      const response = await fetch(
        `${NEWS_BASE_URL}/everything?q=${encodeURIComponent(query)}&language=${language}&apiKey=${NEWS_API_KEY}&sortBy=publishedAt`
      );
      
      if (!response.ok) {
        throw new Error(`News API error: ${response.status}`);
      }
      
      const data = await response.json();
      return data.articles.filter(article => article.title && article.description);
    } catch (error) {
      console.error('Error searching news:', error);
      throw error;
    }
  }

  static async getWeatherBasedNews(weatherCategory) {
    try {
      let searchQueries = [];
      
      switch (weatherCategory) {
        case 'cold':
          // Depressing news keywords
          searchQueries = [
            'depression mental health',
            'sad news tragedy',
            'economic crisis',
            'unemployment layoffs',
            'climate change disaster',
            'pandemic deaths',
            'war conflict',
            'poverty hunger'
          ];
          break;
        case 'hot':
          // Fear-related news keywords
          searchQueries = [
            'terrorism attack',
            'crime violence',
            'cyber security threat',
            'natural disaster',
            'pandemic fear',
            'economic collapse',
            'war threat',
            'health emergency'
          ];
          break;
        case 'cool':
          // Winning and happiness news keywords
          searchQueries = [
            'success achievement',
            'sports victory',
            'technology breakthrough',
            'medical breakthrough',
            'economic growth',
            'innovation discovery',
            'awards recognition',
            'positive development'
          ];
          break;
      }
      
      // Get news for each query and combine
      const allArticles = [];
      
      for (const query of searchQueries.slice(0, 3)) { // Limit to 3 queries to avoid rate limits
        try {
          const articles = await this.searchNews(query);
          allArticles.push(...articles.slice(0, 5)); // Take first 5 articles from each query
        } catch (error) {
          console.warn(`Failed to fetch news for query "${query}":`, error);
        }
      }
      
      // Remove duplicates based on title
      const uniqueArticles = allArticles.filter((article, index, self) => 
        index === self.findIndex(a => a.title === article.title)
      );
      
      return uniqueArticles.slice(0, 20); // Return max 20 articles
    } catch (error) {
      console.error('Error fetching weather-based news:', error);
      // Fallback to general headlines if weather-based search fails
      return this.getNewsHeadlines();
    }
  }

  static getAvailableCategories() {
    return [
      'business',
      'entertainment',
      'general',
      'health',
      'science',
      'sports',
      'technology'
    ];
  }
}
