type ImageCardProps = {
  title: string;
  imageUrl: string;
  updatedAt?: string;
};

const ImageCard: React.FC<ImageCardProps> = ({
  title,
  imageUrl,
  updatedAt = "Last update 1w ago",
}) => {
  return (
    <div className="image-card">
      <div className="image-header">
        <span className="image-title">{title}</span>
        <span className="image-sub">{updatedAt}</span>
      </div>

      <div className="image-wrapper">
        <img src={imageUrl} alt={title} />
      </div>
    </div>
  );
};

export default ImageCard;
