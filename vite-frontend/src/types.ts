export interface JikanResponse<T> {
  data: T;
  pagination?: {
    last_visible_page: number;
    has_next_page: boolean;
    current_page: number;
    items: {
      count: number;
      total: number;
      per_page: number;
    };
  };
}

export interface Anime {
  mal_id: number;
  url: string;
  images: {
    jpg: { image_url: string; small_image_url: string; large_image_url: string; };
    webp: { image_url: string; small_image_url: string; large_image_url: string; };
  };
  trailer: { youtube_id: string; url: string; embed_url: string; };
  titles: { type: string; title: string; }[];
  title: string;
  title_english: string;
  type: string;
  source: string;
  episodes: number;
  status: string;
  airing: boolean;
  aired: { from: string; to: string; };
  duration: string;
  rating: string;
  score: number;
  scored_by: number;
  rank: number;
  popularity: number;
  members: number;
  favorites: number;
  synopsis: string;
  background: string;
  season: string;
  year: number;
  broadcast: { day: string; time: string; timezone: string; string: string; };
  producers: { mal_id: number; type: string; name: string; url: string; }[];
  licensors: any[];
  studios: { mal_id: number; type: string; name: string; url: string; }[];
  genres: { mal_id: number; type: string; name: string; url: string; }[];
  themes: any[];
  explicit_genres: any[];
  demographics: any[];
}

export interface Character {
  mal_id: number;
  url: string;
  images: { jpg: { image_url: string; small_image_url: string; }; webp: { image_url: string; small_image_url: string; }; };
  name: string;
  name_kanji: string;
  nicknames: string[];
  favorites: number;
  about: string;
}

export interface Person {
  mal_id: number;
  url: string;
  images: { jpg: { image_url: string; }; };
  name: string;
  alternate_names: string[];
  birthday: string;
  favorites: number;
  about: string;
}

export interface ImageUrls {
  image_url: string;
  small_image_url: string;
  large_image_url: string;
}

export interface Genre {
  mal_id: number;
  type: string;
  name: string;
  url: string;
}

export interface News {
  mal_id: number;
  url: string;
  title: string;
  date: string;
  author_username: string;
  author_url: string;
  forum_url: string;
  images: { jpg: { image_url: string; }; };
  comments: number;
  excerpt: string;
}

export interface Manga {
  mal_id: number;
  url: string;
  images: {
    jpg: ImageUrls;
    webp: ImageUrls;
  };
  title: string;
  title_english: string;
  title_japanese: string;
  type: string;
  chapters: number;
  volumes: number;
  status: string;
  publishing: boolean;
  published: {
    from: string;
    to: string;
    prop: {
      from: { day: number; month: number; year: number; };
      to: { day: number; month: number; year: number; };
    };
    string: string;
  };
  score: number;
  scored: number;
  scored_by: number;
  rank: number;
  popularity: number;
  members: number;
  favorites: number;
  synopsis: string;
  background: string;
  authors: { mal_id: number; type: string; name: string; url: string; }[];
  serializations: { mal_id: number; type: string; name: string; url: string; }[];
  genres: Genre[];
}

export interface InternalArticle {
  id: string;
  title: string;
  excerpt: string;
  image: string;
  author: string;
  date: string;
  category: 'Top' | 'Review' | 'Video' | 'Analysis' | 'YouTube';
  youtubeId?: string;
  likes: number;
}

export interface Review {
  mal_id: number;
  url: string;
  type: string;
  votes: number;
  date: string;
  review: string;
  score: number;
  tags: string[];
  is_spoiler: boolean;
  is_preliminary: boolean;
  user: {
    url: string;
    username: string;
    images: { jpg: { image_url: string; }; webp: { image_url: string; }; };
  };
}

export interface Studio {
  mal_id: number;
  url: string;
  titles: { type: string; title: string; }[];
  images: { jpg: { image_url: string; }; };
  name: string;
  favorites: number;
  about: string;
  count: number;
}
