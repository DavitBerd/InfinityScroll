import { Comment } from "../../types/types";
import "./Card.scss";

interface CardProps {
    comment: Comment;
  }
  
  const Card = ({ comment }: CardProps) => {
    return (
      <div className="card">
        <h2>{comment.name}</h2>
        <p className="email">
          <strong>Email:</strong> {comment.email}
        </p>
        <p className="body">{comment.body}</p>
      </div>
    );
  };
  
  export default Card;
