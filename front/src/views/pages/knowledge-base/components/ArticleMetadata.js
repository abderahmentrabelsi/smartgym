export function ArticleMetadata({ data }) {
  return <>
    <div className="d-flex flex-column">
      {data.pubdate && <PublishedDate date={data.pubdate} />}
      {data.authors && <Authors authors={data.authors} />}
      {data.keywords && <Keywords keywords={data.keywords} />}
    </div>
  </>;
}


const PublishedDate = ({ date }) => {
  return (
    <span>
      <b>Published at:</b> {date.year}-{date.month}{date.day ? `-${date.day}` : ""}
    </span>
  );
};
const Authors = ({ authors }) => {
  return (
    <span>
      <b>Authors:</b> {authors.join(", ")}
    </span>
  );
};

const Keywords = ({ keywords }) => {
  return (
    <span>
      <b>Keywords:</b> {keywords.join(", ")}
    </span>
  );
};
