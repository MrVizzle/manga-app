
export async function fetchMangaList(){
    API_Key = 'https://api.mangadex.org/manga?includes[]=cover_art'
    const response = await fetch(API_Key);
    
    if(!response.ok) {
        throw new Error('Failed to fetch manga list');
    }

    const data = await response.json();
    return data.data;
}

async function getLatestChapter(id) {
    try {
        const response = await fetch(`https://api.mangadex.org/manga/${id}/feed?limit=1&order[chapter]=desc&translatedLanguage[]=en`);
        
        if (!response.ok) {
            return 'Unknown';
        }

        const data = await response.json();

        if (!data.data || data.data.length === 0) {
            return 'Unknown';
        }

        const firstChapter = data.data[0];
        const chapter = firstChapter?.attributes?.chapter;

        if (chapter !== undefined && chapter !== null) {
            return chapter; // return as string
        }

        return 'Unknown';
    } catch (error) {
        return 'Unknown';
    }
}


// Get Individual Manga  by ID
export async function fetchMangaById(id) {
    const baseUrl = 'https://api.mangadex.org/manga';
    const response = await fetch(`${baseUrl}/${id}?includes[]=cover_art&includes[]=author`);

    if(!response.ok){
        throw new Error(`Failed to fetch manga with ID: ${id}`);
    }

    const data = await response.json();
    const manga = data.data;

    // GET Chapter count
    const latestChapter = await getLatestChapter(id);
     

    // Extract information
    const coverArt =  manga.relationships.find(rel => rel.type === 'cover_art')?.attributes?.fileName;
    const author = manga.relationships.find(rel => rel.type === 'author')?.attributes?.name;

    const coverUrl = coverArt
        ? `https://uploads.mangadex.org/covers/${manga.id}/${coverArt}.256.jpg`
        : null;

    return {
        id: manga.id,
        title: manga.attributes.title.en || 'No title available',
        description: manga.attributes.description.en || 'No description available',
        chapters: latestChapter,
        status: manga.attributes.status || 'Unknown',
        tags: manga.attributes.tags.map(tag => tag.attributes.name) || [],
        author: author || 'Unknown',
        coverUrl
    };
}


export async function searchManga(query, limit = 20) {
    const baseUrl = 'https://api.mangadex.org/manga';
    const response = await fetch(
        `${baseUrl}?title=${encodeURIComponent(query)}&limit=${limit}&includes[]=cover_art`
    );

    if (!response.ok) {
        throw new Error(`Failed to search manga: ${response.status}`);
    }

    const data = await response.json();
    
    // Transform the data to match your MangaCard component expectations
    return data.data.map(manga => {
        const cover = manga.relationships.find(rel => rel.type === 'cover_art');
        const title = manga.attributes.title.en || 
                     manga.attributes.title['ja-ro'] || 
                     manga.attributes.title.ja || 
                     Object.values(manga.attributes.title)[0] || 
                     'No title available';
        
        return {
            id: manga.id,
            title: title,
            coverUrl: cover ? 
                `https://uploads.mangadex.org/covers/${manga.id}/${cover.attributes.fileName}.512.jpg` :
                null
        };
    });
}