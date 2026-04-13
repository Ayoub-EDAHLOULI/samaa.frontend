"use client";

import "./ReciterFormModal.scss";
import React, { useEffect, useRef, useState } from "react";
import Image from "next/image";
import { useForm, useWatch } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  reciterFormSchema,
  ReciterFormValues,
} from "@/validations/reciters.schema";
import { Reciter } from "@/types/reciters.types";
import { reciterService } from "@/services/reciter.service";
import { X, Upload, Loader2 } from "lucide-react";

interface Props {
  reciter: Reciter | null; // null = create mode
  onSave: (saved: Reciter) => void;
  onClose: () => void;
}

export default function ReciterFormModal({ reciter, onSave, onClose }: Props) {
  const isEdit = reciter !== null;
  const [imagePreview, setImagePreview] = useState<string | null>(
    reciter?.imageUrl ?? null,
  );
  const fileInputRef = useRef<HTMLInputElement>(null);

  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors, isSubmitting },
  } = useForm<ReciterFormValues>({
    resolver: zodResolver(reciterFormSchema),
    defaultValues: {
      name: reciter?.name ?? "",
      slug: reciter?.slug ?? "",
      biography: reciter?.biography ?? "",
      nationality: reciter?.nationality ?? "",
      spotifyUrl: reciter?.spotifyUrl ?? "",
      youtubeUrl: reciter?.youtubeUrl ?? "",
    },
  });

  // Auto-generate slug from name in create mode
  const nameValue = useWatch({ name: "name" });
  useEffect(() => {
    if (!isEdit && nameValue) {
      const generated = nameValue
        .toLowerCase()
        .trim()
        .replace(/[^a-z0-9\s-]/g, "")
        .replace(/\s+/g, "-")
        .replace(/-+/g, "-");
      setValue("slug", generated, { shouldValidate: false });
    }
  }, [nameValue, isEdit, setValue]);

  // Local image preview when user picks a file
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setImagePreview(URL.createObjectURL(file));
    }
  };

  const onSubmit = async (values: ReciterFormValues) => {
    try {
      const saved = isEdit
        ? await reciterService.update(reciter.id, values)
        : await reciterService.create(values);
      onSave(saved);
    } catch (err) {
      // bubble up to parent's catch via re-throw
      throw err;
    }
  };

  // Close on backdrop click
  const handleBackdrop = (e: React.MouseEvent<HTMLDivElement>) => {
    if (e.target === e.currentTarget) onClose();
  };

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

        <form onSubmit={handleSubmit(onSubmit)} noValidate>
          <div className="modal-body">
            {/* Image upload */}
            <div
              className="image-upload-area"
              onClick={() => fileInputRef.current?.click()}
            >
              {imagePreview ? (
                <Image
                  src={imagePreview}
                  alt="Preview"
                  className="image-preview"
                  fill
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
                onChange={(e) => {
                  setValue("image", e.target.files?.[0] ?? null);
                  handleFileChange(e);
                }}
              />
            </div>

            {/* Two-column grid for short fields */}
            <div className="form-grid">
              <div className="form-group">
                <label>
                  Name <span className="required">*</span>
                </label>
                <input
                  {...register("name")}
                  placeholder="e.g. Abdul Rahman Al-Sudais"
                  className={errors.name ? "input-error" : ""}
                />
                {errors.name && (
                  <p className="field-error">{errors.name.message}</p>
                )}
              </div>

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
                <label>Nationality</label>
                <input
                  {...register("nationality")}
                  placeholder="e.g. Saudi Arabia"
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

              <div className="form-group full-width">
                <label>Biography</label>
                <textarea
                  {...register("biography")}
                  rows={4}
                  placeholder="Short biography of the reciter…"
                />
              </div>
            </div>
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
      </div>
    </div>
  );
}
