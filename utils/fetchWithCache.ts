import cacheData from "memory-cache";

export default async function fetchWithCache(url, options, cacheTime) {
  const value = cacheData.get(url);
  if (value) {
    return value;
  } else {
    const res = await fetch(url, options);
    const data = await res.json();
    cacheData.put(url, data, cacheTime);
    return data;
  }
}
