// youtubeApi.js

const { google } = require('googleapis');
const config = require('./config');

async function getVideoTitle(videoId) {
    const youtube = google.youtube({
        version: 'v3',
        auth: config.apiKey
    });

    try {
        const response = await youtube.videos.list({
            part: 'snippet',
            id: videoId
        });

        const video = response.data.items[0];
        const title = video.snippet.title;
        return title;
    } catch (error) {
        console.error('Error fetching video title:', error.message);
        throw error;
    }
}

// YouTube 動画の URL から ID を抽出する
function extractVideoIdFromUrl(url) {
    // YouTube 動画の URL から ID を抽出する
    const match = url.match(/(?:youtube\.com\/(?:[^\/\n\s]+\/\S+\/|(?:v|e(?:mbed)?)\/|\S*?[?&]v=)|youtu\.be\/)([a-zA-Z0-9_-]{11})/);
    return match ? match[1] : null;
}


module.exports = {
    getVideoTitle: getVideoTitle,
    extractVideoIdFromUrl: extractVideoIdFromUrl
};
