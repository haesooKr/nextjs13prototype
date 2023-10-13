export default function sitemap() {
  const urls = [];
  const lastModifiedTime = new Date();
  const addAnEntry = (url) => {
    urls.push({
      url,
      lastModified: lastModifiedTime,
    });
  };

  addAnEntry("http://localhost:3000");
  addAnEntry("http://localhost:3000/posts");

  return urls;
}
