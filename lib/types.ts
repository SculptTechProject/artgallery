export type ArtistMini = {
  id: string;
  name: string;
  surname: string;
  biography: string;
};

export type Artwork = {
  id: string;
  title: string;
  description: string;
  imageUrl?: string;
  type: string;
  price: number;
  artist: ArtistMini;
};

export type Category = {
  id: number;
  name: string;
  slug: string;
  count: number;
};

export type Exhibition = {
  id: number;
  name: string;
  description: string;
  startDate: string;
  endDate: string;
  imageUrl?: string | null;
  location?: string;
  capacity: number;
  soldCount?: number;
};

export type Order = {
  id: string | number;
  date: string;
  customerEmail?: string | null;
  email?: string | null;
  user?: {
    email?: string | null;
  } | null;
  itemsCount: number;
  total: number;
};

export type Ticket = {
  id: string | number;
  exhibition?: string | null;
  exhibitionTitle?: string | null;
  date?: string | null;
  type?: string | null;
  email?: string | null;
  user?: {
    email?: string | null;
  } | null;
};
