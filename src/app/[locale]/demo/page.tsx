"use client";

import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import { useTranslations } from "next-intl";
import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import { recognitionService } from "@/services/recognition.service";
import { RecognitionResultResponse } from "@/types/recognitions.types";

type DemoState =
  | "idle"
  | "recording"
  | "processing"
  | "match"
  | "nomatch"
  | "error";

// Backend accepts: audio/mpeg, audio/mp3, audio/wav, audio/aac, audio/m4a, audio/x-m4a, audio/mp4
// MediaRecorder in Chrome/Safari supports audio/mp4; Firefox supports audio/wav
function getSupportedMimeType(): string | null {
  if (typeof MediaRecorder === "undefined") return null;
  const candidates = [
    "audio/mp4",
    "audio/ogg;codecs=opus",
    "audio/ogg",
    "audio/wav",
  ];
  for (const type of candidates) {
    if (MediaRecorder.isTypeSupported(type)) return type;
  }
  return null;
}

const RECORD_SECONDS = 5;

export default function DemoPage() {
  const t = useTranslations("demoPage");

  const [state, setState] = useState<DemoState>("idle");
  const [countdown, setCountdown] = useState(RECORD_SECONDS);
  const [result, setResult] = useState<RecognitionResultResponse | null>(null);
  const [errorMsg, setErrorMsg] = useState<string>("");

  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const chunksRef = useRef<Blob[]>([]);
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
      mediaRecorderRef.current?.stream?.getTracks().forEach((t) => t.stop());
    };
  }, []);

  const startRecording = async () => {
    setResult(null);
    setErrorMsg("");

    let stream: MediaStream;
    try {
      stream = await navigator.mediaDevices.getUserMedia({ audio: true });
    } catch {
      setErrorMsg(
        "Microphone access denied. Please allow microphone permissions and try again.",
      );
      setState("error");
      return;
    }

    const mimeType = getSupportedMimeType();
    if (!mimeType) {
      stream.getTracks().forEach((t) => t.stop());
      setErrorMsg(
        "Your browser doesn't support a compatible audio format. Please use Chrome, Safari, or Firefox.",
      );
      setState("error");
      return;
    }

    chunksRef.current = [];
    const mr = new MediaRecorder(stream, { mimeType });
    mediaRecorderRef.current = mr;

    mr.ondataavailable = (e) => {
      if (e.data.size > 0) chunksRef.current.push(e.data);
    };

    mr.onstop = async () => {
      stream.getTracks().forEach((t) => t.stop());
      setState("processing");

      const recordedMime = mediaRecorderRef.current?.mimeType ?? "audio/mp4";
      const blob = new Blob(chunksRef.current, { type: recordedMime });
      try {
        const res = await recognitionService.identify(blob, {
          audioDuration: RECORD_SECONDS,
          deviceOs: "Web",
        });
        setResult(res);
        setState(res.isMatch ? "match" : "nomatch");
      } catch (err) {
        const msg =
          err instanceof Error
            ? err.message
            : "Recognition failed. Please try again.";
        setErrorMsg(msg);
        setState("error");
      }
    };

    mr.start();
    setState("recording");
    setCountdown(RECORD_SECONDS);

    let remaining = RECORD_SECONDS;
    timerRef.current = setInterval(() => {
      remaining -= 1;
      setCountdown(remaining);
      if (remaining <= 0) {
        clearInterval(timerRef.current!);
        mr.stop();
      }
    }, 1000);
  };

  const reset = () => {
    setState("idle");
    setResult(null);
    setErrorMsg("");
    setCountdown(RECORD_SECONDS);
  };

  const confidencePct = result ? Math.round(result.confidence * 100) : 0;

  return (
    <>
      <Navbar />
      <main className="min-h-screen bg-white dark:bg-slate-950 pt-24 pb-16">
        <div className="max-w-2xl mx-auto px-6 lg:px-8 text-center">
          <p className="text-emerald-500 dark:text-emerald-400 text-sm font-semibold tracking-widest uppercase mb-4">
            {t("label")}
          </p>
          <h1 className="text-4xl sm:text-5xl font-bold text-slate-900 dark:text-white mb-5">
            {t("title")}
          </h1>
          <p className="text-slate-500 dark:text-slate-400 text-lg mb-12">
            {t("subtitle")}
          </p>

          <div className="rounded-3xl border border-slate-100 dark:border-slate-800 bg-slate-50 dark:bg-slate-900 p-12 flex flex-col items-center gap-6">
            {/* --- Mic button --- */}
            <div className="relative">
              {/* Pulse ring while recording */}
              {state === "recording" && (
                <span className="absolute inset-0 rounded-full bg-red-400/30 animate-ping" />
              )}
              <div className="absolute inset-0 rounded-full bg-emerald-400/20 scale-150 blur-xl" />

              <button
                onClick={
                  state === "idle" ||
                  state === "match" ||
                  state === "nomatch" ||
                  state === "error"
                    ? startRecording
                    : undefined
                }
                disabled={state === "recording" || state === "processing"}
                className={`relative w-20 h-20 rounded-full text-white shadow-lg transition-all duration-200 flex items-center justify-center
                  ${
                    state === "recording"
                      ? "bg-red-500 shadow-red-200 dark:shadow-red-900/40 scale-110"
                      : state === "processing"
                        ? "bg-slate-400 cursor-not-allowed"
                        : "bg-emerald-500 hover:bg-emerald-600 active:scale-95 shadow-emerald-200 dark:shadow-emerald-900/40 cursor-pointer"
                  }`}
              >
                {state === "processing" ? (
                  /* Spinner */
                  <svg
                    className="w-7 h-7 animate-spin"
                    viewBox="0 0 24 24"
                    fill="none"
                  >
                    <circle
                      className="opacity-25"
                      cx="12"
                      cy="12"
                      r="10"
                      stroke="currentColor"
                      strokeWidth="3"
                    />
                    <path
                      className="opacity-75"
                      fill="currentColor"
                      d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z"
                    />
                  </svg>
                ) : (
                  /* Mic icon */
                  <svg
                    className="w-8 h-8"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth={1.8}
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <path d="M12 1a3 3 0 0 0-3 3v8a3 3 0 0 0 6 0V4a3 3 0 0 0-3-3z" />
                    <path d="M19 10v2a7 7 0 0 1-14 0v-2" />
                    <line x1="12" y1="19" x2="12" y2="23" />
                    <line x1="8" y1="23" x2="16" y2="23" />
                  </svg>
                )}
              </button>
            </div>

            {/* --- Status text --- */}
            <div>
              {state === "idle" && (
                <>
                  <p className="text-slate-900 dark:text-white font-semibold">
                    {t("tapToStart")}
                  </p>
                  <p className="text-slate-400 dark:text-slate-500 text-sm mt-1">
                    {t("recording")}
                  </p>
                </>
              )}
              {state === "recording" && (
                <>
                  <p className="text-red-500 font-semibold">Listening…</p>
                  <p className="text-slate-400 dark:text-slate-500 text-sm mt-1">
                    {countdown}s remaining
                  </p>
                </>
              )}
              {state === "processing" && (
                <>
                  <p className="text-slate-900 dark:text-white font-semibold">
                    Identifying reciter…
                  </p>
                  <p className="text-slate-400 dark:text-slate-500 text-sm mt-1">
                    Analysing audio with AI
                  </p>
                </>
              )}
              {(state === "match" || state === "nomatch") && (
                <button
                  onClick={reset}
                  className="text-emerald-500 hover:text-emerald-600 text-sm font-medium mt-1"
                >
                  Try again
                </button>
              )}
              {state === "error" && (
                <button
                  onClick={reset}
                  className="text-emerald-500 hover:text-emerald-600 text-sm font-medium mt-1"
                >
                  Try again
                </button>
              )}
            </div>

            {/* --- Result card --- */}
            <div className="w-full max-w-xs rounded-2xl border border-slate-100 dark:border-slate-800 bg-white dark:bg-slate-950 p-4 text-left">
              <p className="text-xs text-slate-400 dark:text-slate-500 uppercase tracking-wide mb-3">
                {t("resultPlaceholder")}
              </p>

              {/* Idle / processing */}
              {(state === "idle" ||
                state === "recording" ||
                state === "processing") && (
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-slate-100 dark:bg-slate-800 flex items-center justify-center text-lg">
                    🎙️
                  </div>
                  <p className="text-slate-400 dark:text-slate-500 text-sm">
                    {state === "processing" ? "Analysing…" : t("awaiting")}
                  </p>
                </div>
              )}

              {/* Match */}
              {state === "match" && result?.reciter && (
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-xl bg-slate-100 dark:bg-slate-800 overflow-hidden shrink-0 relative">
                    {result.reciter.imageUrl ? (
                      <Image
                        src={result.reciter.imageUrl}
                        alt={result.reciter.name}
                        fill
                        className="object-cover"
                        unoptimized
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-xl">
                        🎙️
                      </div>
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-slate-900 dark:text-white font-semibold text-sm truncate">
                      {result.reciter.name}
                    </p>
                    <div className="flex items-center gap-2 mt-1">
                      <div className="flex-1 h-1.5 rounded-full bg-slate-100 dark:bg-slate-800 overflow-hidden">
                        <div
                          className="h-full rounded-full bg-emerald-500"
                          style={{ width: `${confidencePct}%` }}
                        />
                      </div>
                      <span className="text-xs text-emerald-600 dark:text-emerald-400 font-medium whitespace-nowrap">
                        {confidencePct}%
                      </span>
                    </div>
                  </div>
                </div>
              )}

              {/* No match */}
              {state === "nomatch" && (
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-orange-50 dark:bg-orange-900/20 flex items-center justify-center text-lg">
                    🔍
                  </div>
                  <p className="text-slate-500 dark:text-slate-400 text-sm">
                    {result?.message ??
                      "No reciter identified. Try holding your device closer to the audio source."}
                  </p>
                </div>
              )}

              {/* Error */}
              {state === "error" && (
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-red-50 dark:bg-red-900/20 flex items-center justify-center text-lg">
                    ⚠️
                  </div>
                  <p className="text-red-500 dark:text-red-400 text-sm">
                    {errorMsg}
                  </p>
                </div>
              )}
            </div>
          </div>

          <p className="text-slate-400 dark:text-slate-500 text-sm mt-6">
            {t("tipPrefix")}{" "}
            <a
              href="#download"
              className="text-emerald-500 hover:text-emerald-600 font-medium"
            >
              {t("tipLink")}
            </a>{" "}
            {t("tipSuffix")}
          </p>
        </div>
      </main>
      <Footer />
    </>
  );
}
