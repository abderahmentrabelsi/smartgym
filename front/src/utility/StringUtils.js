export function ShortenText(text, maxLength = 200) {
  if (!text || typeof text !== "string") return null;
  if (text.length <= maxLength) return text;

  return (
    text
      .trim()
      .split(" ")
      .reduce((words, word) => {
        if (words.join(" ").length + word.length <= maxLength)
          words.push(word);
        return words;
      }, [])
      .join(" ") + "..."
  );
}
