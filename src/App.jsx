import { forwardRef, useRef, useState } from "react";
import HTMLFlipBook from "react-pageflip";
import "./App.css";

const Page = forwardRef(({ children, className = "" }, ref) => {
  return (
    <div className={`page ${className}`} ref={ref}>
      {children}
    </div>
  );
});

function App() {
  const bookRef = useRef(null);
  const [currentPage, setCurrentPage] = useState(0);
  const [flipDirection, setFlipDirection] = useState("");

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

  return (
    <main className="app">
      <div className="yearbook">
        <h1 className="page-title">The Pets of CAID</h1>

        <div className="book-row">
          {/* LEFT ARROW */}
          <button
            className="nav-button"
            onClick={previousPage}
            disabled={currentPage === 0}
            aria-label="Previous page"
          >
            ←
          </button>

          {/* FLIP BOOK */}
          <div className={`book ${flipDirection}`}>
            <HTMLFlipBook
              width={290}
              height={435}
              size="fixed"
              minWidth={220}
              maxWidth={320}
              minHeight={330}
              maxHeight={480}
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

              {/* PAGE 1 */}
              <Page>
                <div className="page-content">
                  <div className="pet-photo">
                    🐈
                  </div>

                  <h2>Oat</h2>

                  <p className="superlative">
                    Most Likely to Knock Something Off the Counter
                  </p>

                  <div className="details">
                    <p>
                      <strong>Favorite activity</strong>
                      Watching birds
                    </p>

                    <p>
                      <strong>Favorite snack</strong>
                      Chicken
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

                  <p className="superlative">
                    Best Dressed
                  </p>
                </div>
              </Page>

              {/* PAGE 4 */}
              <Page>
                <div className="page-content">
                  <div className="pet-photo">
                    🐈‍⬛
                  </div>

                  <h2>Luna</h2>

                  <p className="superlative">
                    Most Mysterious
                  </p>
                </div>
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
          </div>

          {/* RIGHT ARROW */}
          <button
            className="nav-button"
            onClick={nextPage}
            disabled={currentPage >= 4}
            aria-label="Next page"
          >
            →
          </button>
        </div>
      </div>
    </main>
  );
}

export default App;