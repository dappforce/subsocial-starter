import "../App.css";

const Tag = ({ title }: { title: string }) => {
  return <div className="tag">
    {title}
  </div>
}

export default Tag;