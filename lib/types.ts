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
    id: string;
    title: string;
    description: string;
    date: string;
    imageUrl?: string;
    location: string;
};
