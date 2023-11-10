export async function tryCatchBlock(token, URL, initialSearchQuery, orderByQuery, orderTypeQuery) {
    try {
        const response = await fetch(URL, {
            method: 'POST',
            headers: {
                Authorization: `Bearer ${token}`,
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ search: initialSearchQuery, orderBy: orderByQuery, orderType: orderTypeQuery }),
        });
        if (response.ok) {
            // If the response is successful, parse the JSON data
            const posts = await response.json();

            return {
                props: { posts, initialSearchQuery, orderByQuery, orderTypeQuery },
            };
        } else {
            console.error('Error fetching data:', response.statusText);
            return {
                props: { posts: [] },
            };
        }
    } catch (error) {
        console.error('Error fetching data:', error);
        return {
            props: { posts: [] },
        };
    }
}