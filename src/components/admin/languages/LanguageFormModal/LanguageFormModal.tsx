"use client";

import "./LanguageFormModal.scss";
import React from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { X, Loader2 } from "lucide-react";
import { Language } from "@/types/languages.types";
import { languageService } from "@/services/language.service";
import {
  languageCreateSchema,
  languageUpdateSchema,
  LanguageCreateValues,
  LanguageUpdateValues,
} from "@/validations/languages.schema";

interface Props {
  language: Language | null; // null = create mode
  onSave: (saved: Language) => void;
  onClose: () => void;
}

export default function LanguageFormModal({
  language,
  onSave,
  onClose,
}: Props) {
  const isEdit = language !== null;

  /* ── Create form ── */
  const createForm = useForm<LanguageCreateValues>({
    resolver: zodResolver(languageCreateSchema),
    defaultValues: { code: "", name: "", isDefault: false, isActive: true },
  });

  /* ── Edit form ── */
  const editForm = useForm<LanguageUpdateValues>({
    resolver: zodResolver(languageUpdateSchema),
    defaultValues: {
      name: language?.name ?? "",
      isDefault: language?.isDefault ?? false,
      isActive: language?.isActive ?? true,
    },
  });

  const {
    formState: { isSubmitting: isSubmittingCreate },
    handleSubmit: handleCreate,
    register: registerCreate,
    formState: createErrors,
  } = createForm;
  const {
    formState: { isSubmitting: isSubmittingEdit },
    handleSubmit: handleEdit,
    register: registerEdit,
    formState: editErrors,
  } = editForm;

  const isSubmitting = isEdit ? isSubmittingEdit : isSubmittingCreate;

  const onSubmitCreate = async (values: LanguageCreateValues) => {
    const saved = await languageService.create(values);
    onSave(saved);
  };

  const onSubmitEdit = async (values: LanguageUpdateValues) => {
    const saved = await languageService.update(language!.code, values);
    onSave(saved);
  };

  const handleBackdrop = (e: React.MouseEvent<HTMLDivElement>) => {
    if (e.target === e.currentTarget) onClose();
  };

  return (
    <div className="modal-backdrop" onClick={handleBackdrop}>
      <div className="modal-card">
        {/* Header */}
        <div className="modal-header">
          <h2>
            {isEdit ? `Edit — ${language.code.toUpperCase()}` : "Add Language"}
          </h2>
          <button className="modal-close" onClick={onClose} type="button">
            <X size={18} />
          </button>
        </div>

        {/* ── Create form ── */}
        {!isEdit && (
          <form onSubmit={handleCreate(onSubmitCreate)} noValidate>
            <div className="modal-body">
              <div className="form-group">
                <label>
                  Code <span className="required">*</span>
                </label>
                <input
                  type="text"
                  {...registerCreate("code")}
                  placeholder="e.g. en, fr, ary"
                  className={createErrors.errors.code ? "input-error" : ""}
                />
                {createErrors.errors.code && (
                  <p className="field-error">
                    {createErrors.errors.code.message}
                  </p>
                )}
              </div>

              <div className="form-group">
                <label>
                  Name <span className="required">*</span>
                </label>
                <input
                  type="text"
                  {...registerCreate("name")}
                  placeholder="e.g. English, Français"
                  className={createErrors.errors.name ? "input-error" : ""}
                />
                {createErrors.errors.name && (
                  <p className="field-error">
                    {createErrors.errors.name.message}
                  </p>
                )}
              </div>

              <div className="toggle-row">
                <div className="toggle-info">
                  <span className="toggle-label">Set as default</span>
                  <span className="toggle-description">
                    Makes this the fallback language for all content
                  </span>
                </div>
                <label className="toggle-switch">
                  <input type="checkbox" {...registerCreate("isDefault")} />
                  <span className="slider" />
                </label>
              </div>

              <div className="toggle-row">
                <div className="toggle-info">
                  <span className="toggle-label">Active</span>
                  <span className="toggle-description">
                    Inactive languages are hidden from the public
                  </span>
                </div>
                <label className="toggle-switch">
                  <input type="checkbox" {...registerCreate("isActive")} />
                  <span className="slider" />
                </label>
              </div>
            </div>

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
                ) : (
                  "Add Language"
                )}
              </button>
            </div>
          </form>
        )}

        {/* ── Edit form ── */}
        {isEdit && (
          <form onSubmit={handleEdit(onSubmitEdit)} noValidate>
            <div className="modal-body">
              <div className="form-group">
                <label>
                  Code <span className="readonly-badge">read-only</span>
                </label>
                <input type="text" value={language.code} disabled />
              </div>

              <div className="form-group">
                <label>
                  Name <span className="required">*</span>
                </label>
                <input
                  type="text"
                  {...registerEdit("name")}
                  placeholder="e.g. English, Français"
                  className={editErrors.errors.name ? "input-error" : ""}
                />
                {editErrors.errors.name && (
                  <p className="field-error">
                    {editErrors.errors.name.message}
                  </p>
                )}
              </div>

              <div className="toggle-row">
                <div className="toggle-info">
                  <span className="toggle-label">Set as default</span>
                  <span className="toggle-description">
                    Makes this the fallback language for all content
                  </span>
                </div>
                <label className="toggle-switch">
                  <input
                    type="checkbox"
                    {...registerEdit("isDefault")}
                    disabled={language.isDefault}
                  />
                  <span className="slider" />
                </label>
              </div>

              <div className="toggle-row">
                <div className="toggle-info">
                  <span className="toggle-label">Active</span>
                  <span className="toggle-description">
                    Inactive languages are hidden from the public
                  </span>
                </div>
                <label className="toggle-switch">
                  <input
                    type="checkbox"
                    {...registerEdit("isActive")}
                    disabled={language.isDefault}
                  />
                  <span className="slider" />
                </label>
              </div>

              {language.isDefault && (
                <p style={{ fontSize: "0.78rem", color: "#a0a0a0", margin: 0 }}>
                  The default language cannot be deactivated or unset as
                  default.
                </p>
              )}
            </div>

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
                ) : (
                  "Save Changes"
                )}
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}
