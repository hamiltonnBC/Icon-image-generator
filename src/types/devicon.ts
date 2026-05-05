export interface DeviconEntry {
  name: string;
  altnames: string[];
  tags: string[];
  versions: {
    svg: string[];
    font: string[];
  };
  color: string;
  aliases: Array<{ base: string; alias: string }>;
}
