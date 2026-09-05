import { useState } from "react";
import "./App.css";

function App() {
  const [spread, setSpread] = useState(0);

  const nextPage = () => {
    if (spread < 2) {
      setSpread(spread + 1);
    }
  };

  const previousPage = () => {
    if (spread > 0) {
      setSpread(spread - 1);
    }
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
            disabled={spread === 0}
            aria-label="Previous page"
          >
            ←
          </button>

          {/* BOOK */}
          <div className="book">

            {/* COVER */}
            {spread === 0 && (
              <img
                className="cover"
                src="/book cover.png"
                alt="CAID Pet Yearbook cover featuring a cat and dog in space"
              />
            )}

            {/* PAGES 1 + 2 */}
            {spread === 1 && (
              <div className="spread">

                <div className="page left-page">
                  <div className="page-content">
                    <span className="page-number">1</span>

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

                      <p>
                        <strong>Quote</strong>
                        “I meant to do that.”
                      </p>
                    </div>
                  </div>
                </div>

                <div className="page right-page">
                  <div className="page-content">
                    <span className="page-number">2</span>

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

                      <p>
                        <strong>Quote</strong>
                        “Is that for me?”
                      </p>
                    </div>
                  </div>
                </div>

              </div>
            )}

            {/* PAGES 3 + 4 */}
            {spread === 2 && (
              <div className="spread">

                <div className="page left-page">
                  <div className="page-content">
                    <span className="page-number">3</span>

                    <div className="pet-photo">
                      🐇
                    </div>

                    <h2>Mochi</h2>

                    <p className="superlative">
                      Best Dressed
                    </p>
                  </div>
                </div>

                <div className="page right-page">
                  <div className="page-content">
                    <span className="page-number">4</span>

                    <div className="pet-photo">
                      🐈‍⬛
                    </div>

                    <h2>Luna</h2>

                    <p className="superlative">
                      Most Mysterious
                    </p>
                  </div>
                </div>

              </div>
            )}

          </div>

          {/* RIGHT ARROW */}
          <button
            className="nav-button"
            onClick={nextPage}
            disabled={spread === 2}
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