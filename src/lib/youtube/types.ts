export interface YouTubeChannelResponse {
  items: {
    id: string;
    snippet: {
      title: string;
      customUrl?: string;
      thumbnails: {
        default: { url: string };
      };
    };
    statistics: {
      subscriberCount: string;
    };
    contentDetails: {
      relatedPlaylists: {
        uploads: string;
      };
    };
  }[];
}

export interface YouTubePlaylistItemsResponse {
  items: {
    snippet: {
      resourceId: {
        videoId: string;
      };
      title: string;
      description: string;
      thumbnails: {
        maxres?: { url: string };
        high?: { url: string };
        medium?: { url: string };
        default?: { url: string };
      };
      publishedAt: string;
    };
  }[];
  nextPageToken?: string;
  pageInfo: {
    totalResults: number;
  };
}

export interface YouTubeVideoDetailsResponse {
  items: {
    id: string;
    snippet: {
      title: string;
      description: string;
      publishedAt: string;
      thumbnails: {
        maxres?: { url: string };
        high?: { url: string };
        medium?: { url: string };
        default?: { url: string };
      };
    };
    contentDetails: {
      duration: string;
    };
    statistics: {
      viewCount: string;
      likeCount?: string;
      commentCount?: string;
    };
    status: {
      privacyStatus: string;
      publishAt?: string;
    };
  }[];
}

export interface YouTubeSearchResponse {
  items: {
    snippet: {
      channelId: string;
    };
  }[];
}
