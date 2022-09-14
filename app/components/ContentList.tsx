type ContentListProps = {
  title: string;
  description: string;
  list: string;
};

const ContentList = ({ title, description, list }: ContentListProps) => {
  return (
    <div className="section-inner">
      <header className="page-header">
        <h2 className="entry-title">{title}</h2>
        <div className="page-description">{description}</div>
      </header>
      <div className="posts" id="posts">
        <ul>{list}</ul>
      </div>
    </div>
  );
};

export default ContentList;
