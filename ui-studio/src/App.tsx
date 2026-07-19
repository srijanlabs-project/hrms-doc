import { useEffect, useMemo, useState } from "react";
import { screens, screenFamilies } from "./data/screens.generated";

type ViewMode = "desktop" | "mobile";

const familyOrder = [
  "w0",
  "glb",
  "emp",
  "mgr",
  "hro",
  "peo",
  "wrk",
  "pay",
  "lev",
  "doc",
  "rec",
  "hlp",
  "anl",
  "ast",
  "ctr",
  "hsw"
];

const familyEntries = familyOrder
  .filter((key) => key in screenFamilies)
  .map((key) => ({ key, label: screenFamilies[key as keyof typeof screenFamilies] }));

function statValue(label: string, value: string) {
  return (
    <div className="stat-card">
      <div className="stat-label">{label}</div>
      <div className="stat-value">{value}</div>
    </div>
  );
}

export function App() {
  const [search, setSearch] = useState("");
  const [activeFamily, setActiveFamily] = useState<string>("all");
  const [viewMode, setViewMode] = useState<ViewMode>("desktop");
  const [activeRef, setActiveRef] = useState<string>(screens[0]?.ref ?? "");

  const filteredScreens = useMemo(() => {
    return screens.filter((screen) => {
      const matchesFamily = activeFamily === "all" || screen.familyKey === activeFamily;
      const q = search.trim().toLowerCase();
      const matchesSearch =
        q.length === 0 ||
        screen.ref.toLowerCase().includes(q) ||
        screen.title.toLowerCase().includes(q) ||
        screen.familyLabel.toLowerCase().includes(q);
      return matchesFamily && matchesSearch;
    });
  }, [activeFamily, search]);

  const activeScreen =
    filteredScreens.find((screen) => screen.ref === activeRef) ??
    filteredScreens[0] ??
    screens[0];

  useEffect(() => {
    if (!activeScreen) {
      return;
    }
    if (activeScreen.ref !== activeRef) {
      setActiveRef(activeScreen.ref);
    }
  }, [activeRef, activeScreen]);

  const desktopCount = screens.filter((screen) => screen.desktopAsset.length > 0).length;
  const mobileCount = screens.filter((screen) => screen.mobileAsset.length > 0).length;
  const activeIndex = filteredScreens.findIndex((screen) => screen.ref === activeScreen?.ref);
  const activeAsset = viewMode === "desktop" ? activeScreen?.desktopAsset : activeScreen?.mobileAsset;
  const totalFamilies = familyEntries.length;
  const activeAssetName = activeAsset ? activeAsset.slice(1) : "";

  return (
    <div className="studio-app">
      <aside className="studio-sidebar">
        <div className="brand-block">
          <div className="brand-mark">Staffsy</div>
          <div className="brand-subtitle">UI Studio</div>
        </div>

        <div className="nav-section">
          <button
            className={`family-button ${activeFamily === "all" ? "is-active" : ""}`}
            onClick={() => setActiveFamily("all")}
          >
            All Screens
            <span className="pill">{screens.length}</span>
          </button>
          {familyEntries.map((family) => {
            const count = screens.filter((screen) => screen.familyKey === family.key).length;
            return (
              <button
                key={family.key}
                className={`family-button ${activeFamily === family.key ? "is-active" : ""}`}
                onClick={() => setActiveFamily(family.key)}
              >
                {family.label}
                <span className="pill">{count}</span>
              </button>
            );
          })}
        </div>

        <div className="sidebar-note">
          <div className="note-title">Build intent</div>
          <p>
            This studio turns the current Staffsy mockup library into a navigable development reference while the
            fully coded screen set is implemented family by family.
          </p>
          <div className="note-grid">
            <div>
              <strong>{desktopCount}</strong>
              <span>Desktop-ready</span>
            </div>
            <div>
              <strong>{mobileCount}</strong>
              <span>Mobile-ready</span>
            </div>
            <div>
              <strong>{totalFamilies}</strong>
              <span>Screen families</span>
            </div>
          </div>
        </div>
      </aside>

      <main className="studio-main">
        <header className="studio-header">
          <div>
            <div className="eyebrow">Enterprise HRMS</div>
            <h1>Screen Implementation Studio</h1>
            <p className="header-copy">
              Design-system aligned screen review using the current mockup baseline, tokens, and Staffsy language.
            </p>
          </div>
          <div className="mode-switch">
            <button className={viewMode === "desktop" ? "is-active" : ""} onClick={() => setViewMode("desktop")}>
              Desktop
            </button>
            <button className={viewMode === "mobile" ? "is-active" : ""} onClick={() => setViewMode("mobile")}>
              Mobile
            </button>
          </div>
        </header>

        <section className="studio-stats">
          {statValue("Screen count", String(screens.length))}
          {statValue(
            "Current family",
            activeFamily === "all" ? "All" : screenFamilies[activeFamily as keyof typeof screenFamilies]
          )}
          {statValue("Filtered", String(filteredScreens.length))}
          {statValue("Preview mode", viewMode === "desktop" ? "Desktop" : "Mobile")}
        </section>

        <section className="studio-toolbar">
          <input
            className="search-input"
            value={search}
            onChange={(event) => setSearch(event.target.value)}
            placeholder="Search screen ref, title, or family"
          />
          <div className="token-badges">
            <span className="token-badge">Human Centered</span>
            <span className="token-badge token-ai">AI Powered</span>
            <span className="token-badge">Enterprise Grade</span>
            <span className="token-badge">Accessible</span>
          </div>
        </section>

        <section className="studio-content">
          <div className="screen-list-panel">
            <div className="panel-header">
              <h2>Screens</h2>
              <span>{filteredScreens.length} visible</span>
            </div>
            <div className="screen-list">
              {filteredScreens.map((screen) => (
                <button
                  key={screen.ref}
                  className={`screen-list-item ${activeScreen?.ref === screen.ref ? "is-active" : ""}`}
                  onClick={() => setActiveRef(screen.ref)}
                >
                  <div className="screen-ref">{screen.ref}</div>
                  <div className="screen-title">{screen.title}</div>
                  <div className="screen-family">{screen.familyLabel}</div>
                  <div className="variant-row">
                    <span className={`variant-pill ${screen.desktopAsset ? "is-ready" : ""}`}>Desktop</span>
                    <span className={`variant-pill ${screen.mobileAsset ? "is-ready" : ""}`}>Mobile</span>
                  </div>
                </button>
              ))}
            </div>
          </div>

          <div className="preview-panel">
            {activeScreen ? (
              <>
                <div className="panel-header preview-header">
                  <div>
                    <div className="screen-ref">{activeScreen.ref}</div>
                    <h2>{activeScreen.title}</h2>
                    <div className="screen-family">{activeScreen.familyLabel}</div>
                  </div>
                  <div className="preview-actions">
                    <div className="preview-tags">
                      <span className="preview-tag">Mockup-backed</span>
                      <span className="preview-tag preview-tag-ai">Design-system aligned</span>
                    </div>
                    <div className="preview-nav">
                      <button
                        disabled={activeIndex <= 0}
                        onClick={() => activeIndex > 0 && setActiveRef(filteredScreens[activeIndex - 1].ref)}
                      >
                        Previous
                      </button>
                      <button
                        disabled={activeIndex === -1 || activeIndex >= filteredScreens.length - 1}
                        onClick={() =>
                          activeIndex >= 0 &&
                          activeIndex < filteredScreens.length - 1 &&
                          setActiveRef(filteredScreens[activeIndex + 1].ref)
                        }
                      >
                        Next
                      </button>
                    </div>
                  </div>
                </div>

                <div className="preview-meta">
                  <div className="meta-card">
                    <span className="meta-label">Registry position</span>
                    <strong>
                      {activeIndex + 1} / {filteredScreens.length}
                    </strong>
                  </div>
                  <div className="meta-card">
                    <span className="meta-label">Available variants</span>
                    <strong>
                      {activeScreen.desktopAsset ? "Desktop" : ""}
                      {activeScreen.desktopAsset && activeScreen.mobileAsset ? " + " : ""}
                      {activeScreen.mobileAsset ? "Mobile" : ""}
                    </strong>
                  </div>
                  <div className="meta-card meta-card-wide">
                    <span className="meta-label">Current asset</span>
                    <strong>{activeAssetName || `No ${viewMode} preview available`}</strong>
                  </div>
                </div>

                <div className={`preview-frame ${viewMode === "mobile" ? "is-mobile" : ""}`}>
                  {activeAsset ? (
                    <img alt={`${activeScreen.title} ${viewMode} preview`} src={activeAsset} />
                  ) : (
                    <div className="empty-preview">No {viewMode} preview available for this screen yet.</div>
                  )}
                </div>
              </>
            ) : (
              <div className="empty-preview">No screens matched the current filter.</div>
            )}
          </div>
        </section>
      </main>
    </div>
  );
}
