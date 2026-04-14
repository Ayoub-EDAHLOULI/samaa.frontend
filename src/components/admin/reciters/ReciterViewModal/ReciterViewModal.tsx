"use client";

import "./ReciterViewModal.scss";
import { useEffect, useState } from "react";
import Image from "next/image";
import { X, Loader2, Mic, ExternalLink, Pencil } from "lucide-react";
import {
  Reciter,
  AdminReciter,
  ReciterTranslation,
} from "@/types/reciters.types";
import { Language } from "@/types/languages.types";
import { reciterService } from "@/services/reciter.service";
import { languageService } from "@/services/language.service";
import fullImageUrl from "@/utils/fullImageUrl";

interface Props {
  reciter: Reciter;
  onClose: () => void;
  onEdit: (reciter: Reciter) => void;
}

function InfoRow({ label, value }: { label: string; value: React.ReactNode }) {
  return (
    <div className="info-row">
      <span className="info-label">{label}</span>
      <span className="info-value">{value}</span>
    </div>
  );
}

export default function ReciterViewModal({ reciter, onClose, onEdit }: Props) {
  const [adminReciter, setAdminReciter] = useState<AdminReciter | null>(null);
  const [languages, setLanguages] = useState<Language[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("en");

  useEffect(() => {
    const load = async () => {
      try {
        const [detail, langs] = await Promise.all([
          reciterService.getById(reciter.id),
          languageService.getAll(),
        ]);
        setAdminReciter(detail);
        setLanguages(langs);
        const defaultLang =
          langs.find((l) => l.isDefault)?.code ?? langs[0]?.code ?? "en";
        setActiveTab(defaultLang);
      } finally {
        setLoading(false);
      }
    };
    load();
  }, [reciter.id]);

  const handleBackdrop = (e: React.MouseEvent<HTMLDivElement>) => {
    if (e.target === e.currentTarget) onClose();
  };

  const activeTrans: ReciterTranslation | undefined =
    adminReciter?.translations.find((t) => t.language === activeTab);

  const imageUrl = adminReciter?.imageUrl
    ? fullImageUrl(adminReciter.imageUrl)
    : null;

  return (
    <div className="modal-backdrop" onClick={handleBackdrop}>
      <div className="view-modal-card">
        {/* Header */}
        <div className="view-modal-header">
          <div className="view-header-info">
            <h2>
              {adminReciter?.translations.find((t) => t.language === "en")
                ?.name ??
                adminReciter?.translations[0]?.name ??
                reciter.slug}
            </h2>
            <span className="view-header-slug">{reciter.slug}</span>
          </div>
          <div className="view-header-actions">
            <button
              className="btn-edit-header"
              onClick={() => onEdit(reciter)}
              title="Edit reciter"
            >
              <Pencil size={15} />
              Edit
            </button>
            <button className="modal-close" onClick={onClose} type="button">
              <X size={18} />
            </button>
          </div>
        </div>

        {loading ? (
          <div className="view-loading">
            <Loader2 size={22} className="spin" />
            <span>Loading…</span>
          </div>
        ) : (
          <div className="view-modal-body">
            {/* Image banner */}
            {imageUrl && (
              <div className="view-image-banner">
                <Image
                  src={imageUrl}
                  alt={adminReciter?.translations[0]?.name ?? reciter.slug}
                  fill
                  className="banner-img"
                  unoptimized
                />
                <div className="banner-overlay" />
              </div>
            )}

            {/* Core info */}
            <div className="view-section">
              <p className="view-section-title">Core</p>
              <div className="info-grid">
                <InfoRow
                  label="Country"
                  value={
                    adminReciter?.countryCode ? (
                      <span className="mono">
                        {adminReciter.countryCode.toUpperCase()}
                      </span>
                    ) : (
                      <span className="muted">—</span>
                    )
                  }
                />
                <InfoRow
                  label="Style"
                  value={
                    adminReciter?.style ?? <span className="muted">—</span>
                  }
                />
                <InfoRow
                  label="Discoveries"
                  value={reciter.totalDiscoveries.toLocaleString()}
                />
                <InfoRow
                  label="Added"
                  value={new Date(reciter.createdAt).toLocaleDateString()}
                />
                {adminReciter?.spotifyUrl && (
                  <InfoRow
                    label="Spotify"
                    value={
                      <a
                        href={adminReciter.spotifyUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="external-link"
                      >
                        Open <ExternalLink size={12} />
                      </a>
                    }
                  />
                )}
                {adminReciter?.youtubeUrl && (
                  <InfoRow
                    label="YouTube"
                    value={
                      <a
                        href={adminReciter.youtubeUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="external-link"
                      >
                        Open <ExternalLink size={12} />
                      </a>
                    }
                  />
                )}
              </div>
            </div>

            {/* Translations */}
            <div className="view-section">
              <p className="view-section-title">Translations</p>

              {languages.length === 0 ? (
                <p className="muted">No languages configured.</p>
              ) : (
                <div className="lang-tabs-section">
                  <div className="lang-tabs" role="tablist">
                    {languages.map((lang) => {
                      const hasTrans = adminReciter?.translations.some(
                        (t) => t.language === lang.code && t.name,
                      );
                      return (
                        <button
                          key={lang.code}
                          type="button"
                          role="tab"
                          aria-selected={activeTab === lang.code}
                          className={`lang-tab${activeTab === lang.code ? " active" : ""}${!hasTrans ? " empty" : ""}`}
                          onClick={() => setActiveTab(lang.code)}
                        >
                          {lang.code.toUpperCase()}
                          {lang.isDefault && (
                            <span
                              className="tab-default-dot"
                              title="Default language"
                            />
                          )}
                        </button>
                      );
                    })}
                  </div>

                  <div className="lang-tab-content">
                    {!activeTrans?.name ? (
                      <p className="no-translation-hint">
                        No translation available for this language.
                      </p>
                    ) : (
                      <div className="translation-detail">
                        <div className="trans-row">
                          <div className="trans-field">
                            <span className="trans-label">Name</span>
                            <span
                              className="trans-value"
                              dir={activeTab === "ary" ? "rtl" : "ltr"}
                            >
                              {activeTrans.name}
                            </span>
                          </div>
                          {activeTrans.nationality && (
                            <div className="trans-field">
                              <span className="trans-label">Nationality</span>
                              <span
                                className="trans-value"
                                dir={activeTab === "ary" ? "rtl" : "ltr"}
                              >
                                {activeTrans.nationality}
                              </span>
                            </div>
                          )}
                        </div>

                        {activeTrans.shortBio && (
                          <div className="trans-field full">
                            <span className="trans-label">Short Bio</span>
                            <p
                              className="trans-text"
                              dir={activeTab === "ary" ? "rtl" : "ltr"}
                            >
                              {activeTrans.shortBio}
                            </p>
                          </div>
                        )}

                        {activeTrans.biography && (
                          <div className="trans-field full">
                            <span className="trans-label">Biography</span>
                            <p
                              className="trans-text bio"
                              dir={activeTab === "ary" ? "rtl" : "ltr"}
                            >
                              {activeTrans.biography}
                            </p>
                          </div>
                        )}

                        {(activeTrans.seoTitle || activeTrans.tags) && (
                          <div className="trans-row">
                            {activeTrans.seoTitle && (
                              <div className="trans-field">
                                <span className="trans-label">SEO Title</span>
                                <span className="trans-value">
                                  {activeTrans.seoTitle}
                                </span>
                              </div>
                            )}
                            {activeTrans.tags && (
                              <div className="trans-field">
                                <span className="trans-label">Tags</span>
                                <div className="tags-list">
                                  {activeTrans.tags
                                    .split(",")
                                    .map((tag) => tag.trim())
                                    .filter(Boolean)
                                    .map((tag) => (
                                      <span key={tag} className="tag-pill">
                                        {tag}
                                      </span>
                                    ))}
                                </div>
                              </div>
                            )}
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                </div>
              )}
            </div>

            {/* No image fallback avatar */}
            {!imageUrl && (
              <div className="view-no-image">
                <Mic size={32} className="no-image-icon" />
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
