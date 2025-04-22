import { useCallback, useEffect, useRef, useState } from "react";
import "./App.css";
import Card from "./components/Card";
import { Comment } from "././types/types";

const App = () => {
  const [comments, setComments] = useState<Array<Comment>>([]);
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [pageNum, setPageNum] = useState<number>(1);
  const [hasMore, setHasMore] = useState<boolean>(true);
  const observerRef = useRef<IntersectionObserver | null>(null);
  const loadMoreRef = useRef<HTMLDivElement | null>(null);

  const loadComments = useCallback(() => {
    if (isLoading) return;
    if (observerRef.current) observerRef.current.disconnect();
    observerRef.current = new IntersectionObserver((entries) => {
      if (entries[0].isIntersecting && hasMore) {
        setPageNum((prev) => prev + 1);
      }
    });
    if (loadMoreRef.current) observerRef.current.observe(loadMoreRef.current);
  }, [hasMore, isLoading]);

  useEffect(() => {
    loadComments();
    return () => {
      if (observerRef.current) observerRef.current.disconnect();
    };
  }, [loadComments]);

  useEffect(() => {
    setIsLoading(true);
    fetch(
      `https://jsonplaceholder.typicode.com/comments?_limit=5&_page=${pageNum}`
    )
      .then((response) => response.json())
      .then((data) => {
        setComments((prev) => [...prev, ...data]);
        if (data.length === 0) setHasMore(false);
        setIsLoading(false);
      })
      .catch((error) => {
        setError("Error fetching data");
        console.error(error);
        setIsLoading(false);
      });
  }, [pageNum]);

  return (
    <div className="container">
      {comments.map((comment) => (
        <Card key={comment.id} comment={comment} />
      ))}
      {hasMore && <div ref={loadMoreRef} className="load-more" />}
      {isLoading && <p className="loading">Loading...</p>}
      {error && <p className="error">{error}</p>}
    </div>
  );
};

export default App;
