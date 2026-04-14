"use client";

import "./ReciterFormModal.scss";
import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import { useForm, useWatch } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  reciterFormSchema,
  ReciterFormValues,
} from "@/validations/reciters.schema";
import { Reciter, AdminReciter } from "@/types/reciters.types";
import { Language } from "@/types/languages.types";
import { reciterService } from "@/services/reciter.service";
import { languageService } from "@/services/language.service";
import { X, Upload, Loader2 } from "lucide-react";
import fullImageUrl from "@/utils/fullImageUrl";

// ---------------------------------------------------------------------------
// Per-language placeholder text — add a new entry here when adding a language
// ---------------------------------------------------------------------------
const LANG_PLACEHOLDERS: Record<
  string,
  {
    name: string;
    nationality: string;
    shortBio: string;
    biography: string;
    seoTitle: string;
    tags: string;
  }
> = {
  en: {
    name: "e.g. Abdul Rahman Al-Sudais",
    nationality: "e.g. Saudi Arabia",
    shortBio: "Short biography in English…",
    biography: "Full biography in English…",
    seoTitle: "SEO title in English…",
    tags: "e.g. quran, mecca, tajweed",
  },
  fr: {
    name: "ex. Abderrahmane Al-Soudaïs",
    nationality: "ex. Arabie Saoudite",
    shortBio: "Courte biographie en français…",
    biography: "Biographie complète en français…",
    seoTitle: "Titre SEO en français…",
    tags: "ex. coran, la mecque, tajweed",
  },
  es: {
    name: "ej. Abderrahmán Al-Sudais",
    nationality: "ej. Arabia Saudita",
    shortBio: "Breve biografía en español…",
    biography: "Biografía completa en español…",
    seoTitle: "Título SEO en español…",
    tags: "ej. corán, la meca, tajweed",
  },
  ary: {
    name: "مثال: عبد الرحمن السديس",
    nationality: "مثال: المملكة العربية السعودية",
    shortBio: "نبذة مختصرة بالعربية…",
    biography: "السيرة الذاتية الكاملة بالعربية…",
    seoTitle: "عنوان SEO بالعربية…",
    tags: "مثال: قرآن، مكة، تجويد",
  },
};

const DEFAULT_PLACEHOLDERS = {
  name: "Reciter name…",
  nationality: "Nationality…",
  shortBio: "Short biography…",
  biography: "Full biography…",
  seoTitle: "SEO title…",
  tags: "Tags (comma-separated)…",
};

function ph(lang: string) {
  return LANG_PLACEHOLDERS[lang] ?? DEFAULT_PLACEHOLDERS;
}

// ---------------------------------------------------------------------------

interface Props {
  reciter: Reciter | null; // null = create mode
  onSave: () => void;
  onClose: () => void;
}

export default function ReciterFormModal({ reciter, onSave, onClose }: Props) {
  const isEdit = reciter !== null;

  const [languages, setLanguages] = useState<Language[]>([]);
  const [loadingData, setLoadingData] = useState(true);
  const [activeTab, setActiveTab] = useState("en");
  const [imagePreview, setImagePreview] = useState<string | null>(
    reciter?.imageUrl ?? null,
  );
  const [submitError, setSubmitError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const {
    register,
    handleSubmit,
    control,
    setValue,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<ReciterFormValues>({
    resolver: zodResolver(reciterFormSchema),
    defaultValues: {
      slug: "",
      countryCode: "",
      style: "",
      spotifyUrl: "",
      youtubeUrl: "",
      image: undefined,
      translations: {},
    },
  });

  // Auto-generate slug from the English name in create mode
  const enName = useWatch({
    control,
    name: "translations.en.name" as never,
  }) as string | undefined;

  useEffect(() => {
    if (!isEdit && enName) {
      const generated = (enName as string)
        .toLowerCase()
        .trim()
        .replace(/[^a-z0-9\s-]/g, "")
        .replace(/\s+/g, "-")
        .replace(/-+/g, "-");
      setValue("slug", generated, { shouldValidate: false });
    }
  }, [enName, isEdit, setValue]);

  // Fetch languages + (in edit mode) the full admin detail with all translations
  useEffect(() => {
    const load = async () => {
      try {
        const [langs, adminReciter]: [Language[], AdminReciter | null] =
          await Promise.all([
            languageService.getAll(),
            isEdit
              ? reciterService.getById(reciter!.id)
              : Promise.resolve(null),
          ]);

        setLanguages(langs);
        if (adminReciter) setImagePreview(adminReciter.imageUrl);

        // Default to the default language tab, else first
        const defaultLang =
          langs.find((l) => l.isDefault)?.code ?? langs[0]?.code ?? "en";
        setActiveTab(defaultLang);

        // Build translation defaults from existing data or empty strings
        const translations = Object.fromEntries(
          langs.map((lang) => {
            const existing = adminReciter?.translations.find(
              (t) => t.language === lang.code,
            );
            return [
              lang.code,
              {
                name: existing?.name ?? "",
                nationality: existing?.nationality ?? "",
                shortBio: existing?.shortBio ?? "",
                biography: existing?.biography ?? "",
                seoTitle: existing?.seoTitle ?? "",
                tags: existing?.tags ?? "",
              },
            ];
          }),
        );

        reset({
          slug: adminReciter?.slug ?? reciter?.slug ?? "",
          countryCode: adminReciter?.countryCode ?? "",
          style: adminReciter?.style ?? "",
          spotifyUrl: adminReciter?.spotifyUrl ?? reciter?.spotifyUrl ?? "",
          youtubeUrl: adminReciter?.youtubeUrl ?? reciter?.youtubeUrl ?? "",
          image: undefined,
          translations,
        });
      } finally {
        setLoadingData(false);
      }
    };
    load();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setValue("image", file);
      setImagePreview(URL.createObjectURL(file));
    }
  };

  const onSubmit = async (values: ReciterFormValues) => {
    try {
      setSubmitError(null);
      if (isEdit) {
        await reciterService.update(reciter!.id, values);
      } else {
        await reciterService.create(values);
      }
      onSave();
    } catch (err) {
      setSubmitError(
        err instanceof Error ? err.message : "Something went wrong.",
      );
    }
  };

  const handleBackdrop = (e: React.MouseEvent<HTMLDivElement>) => {
    if (e.target === e.currentTarget) onClose();
  };

  // Translation field errors for the active tab
  const tabErrors = (
    errors.translations as Record<string, Record<string, { message?: string }>>
  )?.[activeTab];

  return (
    <div className="modal-backdrop" onClick={handleBackdrop}>
      <div className="modal-card">
        {/* Header */}
        <div className="modal-header">
          <h2>{isEdit ? "Edit Reciter" : "Add Reciter"}</h2>
          <button className="modal-close" onClick={onClose} type="button">
            <X size={18} />
          </button>
        </div>

        {loadingData ? (
          <div className="modal-loading">
            <Loader2 size={22} className="spin" />
            <span>Loading…</span>
          </div>
        ) : (
          <form onSubmit={handleSubmit(onSubmit)} noValidate>
            <div className="modal-body">
              {/* Image upload */}
              <div
                className="image-upload-area"
                onClick={() => fileInputRef.current?.click()}
              >
                {imagePreview ? (
                  <Image
                    src={fullImageUrl(imagePreview)}
                    alt="Preview"
                    className="image-preview"
                    fill
                    unoptimized
                  />
                ) : (
                  <div className="image-placeholder">
                    <Upload size={24} />
                    <span>Click to upload image</span>
                  </div>
                )}
                <input
                  ref={fileInputRef}
                  type="file"
                  accept=".jpg,.jpeg,.png,.webp"
                  style={{ display: "none" }}
                  onChange={handleFileChange}
                />
              </div>

              {/* ── Core fields ── */}
              <p className="section-label">Core</p>
              <div className="form-grid">
                <div className="form-group">
                  <label>
                    Slug <span className="required">*</span>
                  </label>
                  <input
                    {...register("slug")}
                    placeholder="e.g. al-sudais"
                    className={errors.slug ? "input-error" : ""}
                  />
                  {errors.slug && (
                    <p className="field-error">{errors.slug.message}</p>
                  )}
                </div>

                <div className="form-group">
                  <label>Country Code</label>
                  <input
                    {...register("countryCode")}
                    placeholder="e.g. SA, MA, EG"
                    maxLength={3}
                  />
                </div>

                <div className="form-group">
                  <label>Style</label>
                  <input
                    {...register("style")}
                    placeholder="e.g. Mujawwad, Murattal"
                  />
                </div>

                <div className="form-group">
                  <label>Spotify URL</label>
                  <input
                    {...register("spotifyUrl")}
                    placeholder="https://open.spotify.com/…"
                    className={errors.spotifyUrl ? "input-error" : ""}
                  />
                  {errors.spotifyUrl && (
                    <p className="field-error">
                      {errors.spotifyUrl.message as string}
                    </p>
                  )}
                </div>

                <div className="form-group full-width">
                  <label>YouTube URL</label>
                  <input
                    {...register("youtubeUrl")}
                    placeholder="https://youtube.com/…"
                    className={errors.youtubeUrl ? "input-error" : ""}
                  />
                  {errors.youtubeUrl && (
                    <p className="field-error">
                      {errors.youtubeUrl.message as string}
                    </p>
                  )}
                </div>
              </div>

              {/* ── Translations ── */}
              <p className="section-label">Translations</p>

              {languages.length === 0 ? (
                <p className="no-langs-hint">
                  No languages found. Add a language first.
                </p>
              ) : (
                <div className="lang-tabs-section">
                  {/* Tab strip */}
                  <div className="lang-tabs" role="tablist">
                    {languages.map((lang) => (
                      <button
                        key={lang.code}
                        type="button"
                        role="tab"
                        aria-selected={activeTab === lang.code}
                        className={`lang-tab${activeTab === lang.code ? " active" : ""}`}
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
                    ))}
                  </div>

                  {/* Active tab content */}
                  {languages.map((lang) => (
                    <div
                      key={lang.code}
                      className="lang-tab-content"
                      hidden={activeTab !== lang.code}
                    >
                      <div className="form-grid">
                        <div className="form-group">
                          <label>Name</label>
                          <input
                            {...register(
                              `translations.${lang.code}.name` as never,
                            )}
                            placeholder={ph(lang.code).name}
                            className={
                              tabErrors?.name && activeTab === lang.code
                                ? "input-error"
                                : ""
                            }
                            dir={lang.code === "ary" ? "rtl" : "ltr"}
                          />
                          {tabErrors?.name && activeTab === lang.code && (
                            <p className="field-error">
                              {tabErrors.name.message}
                            </p>
                          )}
                        </div>

                        <div className="form-group">
                          <label>Nationality</label>
                          <input
                            {...register(
                              `translations.${lang.code}.nationality` as never,
                            )}
                            placeholder={ph(lang.code).nationality}
                            dir={lang.code === "ary" ? "rtl" : "ltr"}
                          />
                        </div>

                        <div className="form-group full-width">
                          <label>Short Bio</label>
                          <input
                            {...register(
                              `translations.${lang.code}.shortBio` as never,
                            )}
                            placeholder={ph(lang.code).shortBio}
                            dir={lang.code === "ary" ? "rtl" : "ltr"}
                          />
                        </div>

                        <div className="form-group full-width">
                          <label>Biography</label>
                          <textarea
                            {...register(
                              `translations.${lang.code}.biography` as never,
                            )}
                            rows={4}
                            placeholder={ph(lang.code).biography}
                            dir={lang.code === "ary" ? "rtl" : "ltr"}
                          />
                        </div>

                        <div className="form-group">
                          <label>SEO Title</label>
                          <input
                            {...register(
                              `translations.${lang.code}.seoTitle` as never,
                            )}
                            placeholder={ph(lang.code).seoTitle}
                            dir={lang.code === "ary" ? "rtl" : "ltr"}
                          />
                        </div>

                        <div className="form-group">
                          <label>Tags</label>
                          <input
                            {...register(
                              `translations.${lang.code}.tags` as never,
                            )}
                            placeholder={ph(lang.code).tags}
                            dir={lang.code === "ary" ? "rtl" : "ltr"}
                          />
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}

              {/* Global translations validation error */}
              {errors.translations?.root?.message && (
                <p className="translations-error">
                  {errors.translations.root.message}
                </p>
              )}
              {(errors.translations as { message?: string })?.message && (
                <p className="translations-error">
                  {(errors.translations as { message?: string }).message}
                </p>
              )}

              {submitError && (
                <p className="translations-error">{submitError}</p>
              )}
            </div>

            {/* Footer */}
            <div className="modal-footer">
              <button type="button" className="btn-secondary" onClick={onClose}>
                Cancel
              </button>
              <button
                type="submit"
                className="btn-primary"
                disabled={isSubmitting}
              >
                {isSubmitting ? (
                  <>
                    <Loader2 size={15} className="spin" /> Saving…
                  </>
                ) : isEdit ? (
                  "Save Changes"
                ) : (
                  "Add Reciter"
                )}
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}
