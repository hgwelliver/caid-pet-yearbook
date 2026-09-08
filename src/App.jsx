import { forwardRef, useEffect, useRef, useState } from "react";
import HTMLFlipBook from "react-pageflip";
import "./App.css";

const commentsStorageKey = "pet-yearbook-comments-cleared";
const previousCommentsStorageKey = "pet-yearbook-comments";

const Page = forwardRef(({ children, className = "" }, ref) => {
  return (
    <div className={`page ${className}`} ref={ref}>
      {children}
    </div>
  );
});

const fontOptions = [
  { label: "Classic", value: 'Georgia, "Times New Roman", serif' },
  { label: "Handwritten", value: '"Segoe Script", "Lucida Handwriting", cursive' },
  { label: "Casual Handwriting", value: '"Bradley Hand", "Segoe Print", cursive' },
  { label: "Elegant Script", value: '"Mistral", "Segoe Script", cursive' },
  { label: "Marker", value: '"Chalkboard SE", "Comic Sans MS", cursive' },
  { label: "Playful", value: '"Comic Sans MS", cursive' },
  { label: "Typewriter", value: '"Courier New", monospace' },
];

const colorOptions = [
  { label: "Black", value: "#292722" },
  { label: "Gray", value: "#777777" },
  { label: "Purple", value: "#4d305f" },
  { label: "Light purple", value: "#9a7bb5" },
  { label: "Maroon", value: "#7a3041" },
];

function App() {
  const bookRef = useRef(null);
  const [currentPage, setCurrentPage] = useState(0);
  const [flipDirection, setFlipDirection] = useState("");
  const [isCommentOpen, setIsCommentOpen] = useState(false);
  const [commentText, setCommentText] = useState("");
  const [commentFont, setCommentFont] = useState(fontOptions[1].value);
  const [commentColor, setCommentColor] = useState(colorOptions[0].value);
  const [isColorPickerOpen, setIsColorPickerOpen] = useState(false);
  const [commentPage, setCommentPage] = useState("1");
  const [commentToDelete, setCommentToDelete] = useState(null);
  const [comments, setComments] = useState(() => {
    if (typeof window === "undefined") {
      return [];
    }

    try {
      window.localStorage.removeItem(previousCommentsStorageKey);
      const savedComments = window.localStorage.getItem(commentsStorageKey);
      const parsedComments = savedComments ? JSON.parse(savedComments) : [];

      return Array.isArray(parsedComments) ? parsedComments : [];
    } catch {
      return [];
    }
  });
  const lastPage = 11;

  useEffect(() => {
    window.localStorage.setItem(commentsStorageKey, JSON.stringify(comments));
  }, [comments]);

  const animateFlip = (direction, flip) => {
    setFlipDirection("");
    requestAnimationFrame(() => setFlipDirection(direction));
    flip();
  };

  const nextPage = () => {
    animateFlip("flip-next", () => {
    bookRef.current?.pageFlip().flipNext();
    });
  };

  const previousPage = () => {
    animateFlip("flip-previous", () => {
      bookRef.current?.pageFlip().flipPrev();
    });
  };

  const closeComment = () => {
    setIsCommentOpen(false);
    setIsColorPickerOpen(false);
    setCommentText("");
  };

  const addComment = (event) => {
    event.preventDefault();
    const trimmedComment = commentText.trim();

    if (!trimmedComment) {
      return;
    }

    setComments((existingComments) => [
      ...existingComments,
      {
        text: trimmedComment,
        font: commentFont,
        color: commentColor,
        page: Number(commentPage),
      },
    ]);
    closeComment();
  };

  const deleteComment = (commentToDelete) => {
    setComments((existingComments) =>
      existingComments.filter((comment) => comment !== commentToDelete),
    );
    setCommentToDelete(null);
  };

  const renderPageComments = (pageIndex) => {
    const pageComments = comments.filter((comment) => comment.page === pageIndex);

    if (pageComments.length === 0) {
      return null;
    }

    return (
      <div className="page-comments" aria-label="Comments">
        {pageComments.map((comment, index) => (
          <div className="page-comment-row" key={`${comment.text}-${index}`}>
            <p
              className="page-comment"
              style={{
                color: comment.color || colorOptions[0].value,
                fontFamily: comment.font,
              }}
            >
              {comment.text}
            </p>
            <button
              className="delete-comment-button"
              type="button"
              onClick={() => setCommentToDelete(comment)}
              aria-label={`Delete comment: ${comment.text}`}
              title="Delete comment"
            >
              x
            </button>
          </div>
        ))}
      </div>
    );
  };

  return (
    <main className="app">
      <div className="yearbook">
        <div className="book-row">
          {/* FLIP BOOK */}
          <div className={`book ${flipDirection}`}>
            {currentPage > 0 && (
              <button
                className="nav-button previous-button"
                onClick={previousPage}
                aria-label="Previous page"
              >
                ←
              </button>
            )}

            <HTMLFlipBook
              width={360}
              height={540}
              size="fixed"
              minWidth={220}
              maxWidth={400}
              minHeight={330}
              maxHeight={600}
              showCover={true}
              mobileScrollSupport={true}
              usePortrait={false}
              maxShadowOpacity={0.35}
              flippingTime={900}
              ref={bookRef}
              onFlip={(e) => setCurrentPage(e.data)}
              className="flip-book"
            >
              {/* FRONT COVER */}
              <Page className="cover-page">
                <img
                  src="/book%20cover.png"
                  alt="The Pets of CAID Yearbook Cover"
                  className="cover-image"
                />
              </Page>

              {/* FRONT SIGNING PAGE */}
              <Page className="signing-page">
                <div className="signing-page-content">
                  {renderPageComments(1)}
                </div>
              </Page>

              {/* TABLE OF CONTENTS */}
              <Page className="contents-page">
                <div className="contents-page-content">
                  <h2>Class of 2026</h2>

                  <p className="contents-subtext">
                    The furry friends of Core AI Design
                  </p>

                  <div className="paw-print-row" aria-hidden="true">
                    <span>🐾</span>
                    <span>🐾</span>
                    <span>🐾</span>
                    <span>🐾</span>
                    <span>🐾</span>
                  </div>

                  <ol className="contents-list">
                    <li>
                      <span>Oat</span>
                      <span>1</span>
                    </li>
                    <li>
                      <span>Pickles</span>
                      <span>2</span>
                    </li>
                    <li>
                      <span>Mochi</span>
                      <span>3</span>
                    </li>
                    <li>
                      <span>Luna</span>
                      <span>4</span>
                    </li>
                    <li>
                      <span>Biscuit</span>
                      <span>5</span>
                    </li>
                    <li>
                      <span>Clover</span>
                      <span>6</span>
                    </li>
                  </ol>
                </div>
              </Page>

              {/* PAGE 1 */}
              <Page>
                <div className="page-content">
                  <div className="pet-photo">
                    <img
                      src="/Oat.PNG"
                      alt="Oat"
                      className="pet-image"
                    />
                  </div>

                  <h2>Oat</h2>

                  <p className="owner">
                    <strong>Human:</strong>
                    Haley Welliver
                  </p>

                  <p className="superlative">
                    Most likely to be successful in total world domination
                  </p>

                  <div className="details">
                    <p>
                      <strong>Favorite activity</strong>
                      Going on walks
                    </p>

                    <p>
                      <strong>Favorite snack</strong>
                      Squeeze treats
                    </p>

                  </div>
                </div>
              </Page>

              {/* PAGE 2 */}
              <Page>
                <div className="page-content">
                  <div className="pet-photo">
                    🐕
                  </div>

                  <h2>Pickles</h2>

                  <p className="owner">
                    <strong>Human:</strong>
                    Jordan
                  </p>

                  <p className="superlative">
                    Best Hallway Zoomies
                  </p>

                  <div className="details">
                    <p>
                      <strong>Favorite activity</strong>
                      Going to the park
                    </p>

                    <p>
                      <strong>Favorite snack</strong>
                      Cheese
                    </p>

                  </div>
                </div>
              </Page>

              {/* PAGE 3 */}
              <Page>
                <div className="page-content">
                  <div className="pet-photo">
                    🐇
                  </div>

                  <h2>Mochi</h2>

                  <p className="owner">
                    <strong>Human:</strong>
                    Casey
                  </p>

                  <p className="superlative">
                    Best Dressed
                  </p>

                  <div className="details">
                    <p>
                      <strong>Favorite activity</strong>
                      Hopping through the garden
                    </p>

                    <p>
                      <strong>Favorite snack</strong>
                      Carrots
                    </p>

                  </div>
                </div>
              </Page>

              {/* PAGE 4 */}
              <Page>
                <div className="page-content">
                  <div className="pet-photo">
                    🐈‍⬛
                  </div>

                  <h2>Luna</h2>

                  <p className="owner">
                    <strong>Human:</strong>
                    Taylor
                  </p>

                  <p className="superlative">
                    Most Mysterious
                  </p>

                  <div className="details">
                    <p>
                      <strong>Favorite activity</strong>
                      Watching from high places
                    </p>

                    <p>
                      <strong>Favorite snack</strong>
                      Salmon
                    </p>

                  </div>
                </div>
              </Page>

              {/* PAGE 5 */}
              <Page>
                <div className="page-content">
                  <div className="pet-photo">
                    🐶
                  </div>

                  <h2>Biscuit</h2>

                  <p className="owner">
                    <strong>Human:</strong>
                    Morgan
                  </p>

                  <p className="superlative">
                    Most Enthusiastic Greeter
                  </p>

                  <div className="details">
                    <p>
                      <strong>Favorite activity</strong>
                      Chasing tennis balls
                    </p>

                    <p>
                      <strong>Favorite snack</strong>
                      Peanut butter
                    </p>
                  </div>
                </div>
              </Page>

              {/* PAGE 6 */}
              <Page>
                <div className="page-content">
                  <div className="pet-photo">
                    🐹
                  </div>

                  <h2>Clover</h2>

                  <p className="owner">
                    <strong>Human:</strong>
                    Riley
                  </p>

                  <p className="superlative">
                    Most Likely to Find a Hidden Snack
                  </p>

                  <div className="details">
                    <p>
                      <strong>Favorite activity</strong>
                      Exploring new tunnels
                    </p>

                    <p>
                      <strong>Favorite snack</strong>
                      Apple slices
                    </p>
                  </div>
                </div>
              </Page>

              {/* BACK SIGNING PAGE */}
              <Page className="signing-page">
                <div className="signing-page-content">
                  {renderPageComments(9)}
                </div>
              </Page>

              {/* BLANK PAGE */}
              <Page className="blank-page">
                {renderPageComments(10)}
              </Page>

              {/* BACK COVER */}
              <Page className="back-cover">
                <img
                  src="/back%20cover.png"
                  alt="The Pets of CAID Yearbook Back Cover"
                  className="cover-image"
                />
              </Page>
            </HTMLFlipBook>

            {currentPage < lastPage && (
              <button
                className="nav-button next-button"
                onClick={nextPage}
                aria-label="Next page"
              >
                →
              </button>
            )}
          </div>
        </div>

        <button
          className="comment-button"
          type="button"
          onClick={() => setIsCommentOpen(true)}
        >
          Add a comment
        </button>

      </div>

      {isCommentOpen && (
        <div className="comment-modal-backdrop" onMouseDown={closeComment}>
          <section
            className="comment-modal"
            role="dialog"
            aria-modal="true"
            aria-labelledby="comment-modal-title"
            onMouseDown={(event) => event.stopPropagation()}
          >
            <div className="comment-modal-header">
              <h2 id="comment-modal-title">Add a comment</h2>
              <button
                className="comment-close"
                type="button"
                onClick={closeComment}
                aria-label="Close comment window"
              >
                X
              </button>
            </div>

            <form onSubmit={addComment}>
              <label className="comment-label" htmlFor="comment-text">
                Your comment
              </label>
              <textarea
                id="comment-text"
                className="comment-textarea"
                value={commentText}
                onChange={(event) => setCommentText(event.target.value)}
                placeholder="Write a memory..."
                rows="5"
                autoFocus
              />

              <label className="comment-label" htmlFor="comment-font">
                Font
              </label>
              <select
                id="comment-font"
                className="comment-select"
                value={commentFont}
                onChange={(event) => setCommentFont(event.target.value)}
                style={{ fontFamily: commentFont }}
              >
                {fontOptions.map((font) => (
                  <option
                    key={font.label}
                    value={font.value}
                    style={{ fontFamily: font.value }}
                  >
                    {font.label}
                  </option>
                ))}
              </select>

              <label className="comment-label" htmlFor="comment-color">
                Pen color
              </label>
              <div className="comment-color-picker">
                <button
                  className="comment-color-trigger"
                  type="button"
                  aria-label="Pen color"
                  aria-haspopup="listbox"
                  aria-expanded={isColorPickerOpen}
                  onClick={() => setIsColorPickerOpen((isOpen) => !isOpen)}
                  style={{ backgroundColor: commentColor }}
                />

                {isColorPickerOpen && (
                  <div className="comment-color-menu" role="listbox" aria-label="Pen color options">
                    {colorOptions.map((color) => (
                      <button
                        className="comment-color-option"
                        type="button"
                        role="option"
                        aria-label={color.label}
                        aria-selected={commentColor === color.value}
                        key={color.label}
                        onClick={() => {
                          setCommentColor(color.value);
                          setIsColorPickerOpen(false);
                        }}
                        style={{ backgroundColor: color.value }}
                      />
                    ))}
                  </div>
                )}
              </div>

              <label className="comment-label" htmlFor="comment-page">
                Add it to
              </label>
              <select
                id="comment-page"
                className="comment-select"
                value={commentPage}
                onChange={(event) => setCommentPage(event.target.value)}
              >
                <option value="1">Front inside cover</option>
                <option value="9">Inside back cover left</option>
                <option value="10">Inside back cover right</option>
              </select>

              <div className="comment-modal-actions">
                <button
                  className="comment-cancel"
                  type="button"
                  onClick={closeComment}
                >
                  Cancel
                </button>
                <button className="comment-submit" type="submit">
                  Add comment
                </button>
              </div>
            </form>
          </section>
        </div>
      )}

      {commentToDelete && (
        <div
          className="comment-modal-backdrop"
          onMouseDown={() => setCommentToDelete(null)}
        >
          <section
            className="comment-modal delete-confirmation"
            role="alertdialog"
            aria-modal="true"
            aria-labelledby="delete-comment-title"
            onMouseDown={(event) => event.stopPropagation()}
          >
            <h2 id="delete-comment-title">
              Are you sure you want to delete this comment?
            </h2>

            <p
              className="comment-preview"
              style={{
                color: commentToDelete.color || colorOptions[0].value,
                fontFamily: commentToDelete.font,
              }}
            >
              {commentToDelete.text}
            </p>

            <div className="comment-modal-actions">
              <button
                className="comment-cancel"
                type="button"
                onClick={() => setCommentToDelete(null)}
              >
                Cancel
              </button>
              <button
                className="comment-submit delete-confirm-button"
                type="button"
                onClick={() => deleteComment(commentToDelete)}
              >
                Delete comment
              </button>
            </div>
          </section>
        </div>
      )}
    </main>
  );
}

export default App;