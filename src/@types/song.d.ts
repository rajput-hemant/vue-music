export default interface Song {
  id: string;
  uid: string;
  display_name: string | null;
  original_name: string;
  modified_name: string;
  genre: string;
  comment_count: number;
  url: null;
}
