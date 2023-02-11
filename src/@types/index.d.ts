export interface Song {
  id: string;
  uid: string;
  display_name: string | null;
  original_name: string;
  modified_name: string;
  genre: string;
  comment_count: number;
  url: null;
}

export interface Comment {
  id: string;
  content: string;
  datePosted: string;
  sid: string | string[];
  name: string | null;
  uid: string;
}
