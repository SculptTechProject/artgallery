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
    artist: ArtistMini;
};

export type Category = {
    id: number;
    name: string;
    slug: string;
    count: number;
};
