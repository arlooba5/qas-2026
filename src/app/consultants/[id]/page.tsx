/**
 * 顧問／講師 個人介紹頁
 * 路徑：/consultants/[id]
 *
 * - 讀取 Firestore consultants/{id}，與顧問入口「個人資料」分頁是同一份資料
 * - Server Component + Firestore REST API（不需金鑰，依 Firestore 規則公開讀取），利於 SEO
 * - 每 60 秒重新驗證，顧問儲存後約 1 分鐘內更新
 * - 只顯示 status 為 "active" 的顧問
 */

import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { cache } from "react";

export const revalidate = 60;

const PROJECT_ID = "qas-2026";

type Profile = {
  id: string;
  name: string;
  title: string;
  description: string;
  tags: string[];
  photoUrl: string;
  emoji: string;
  roleType: "consultant" | "instructor";
  experience: string[];
  certifications: string[];
  courses: string[];
  consultingNote: string;
};

/* ---------- Firestore REST 解碼 ---------- */

type FsValue = {
  stringValue?: string;
  booleanValue?: boolean;
  integerValue?: string;
  doubleValue?: number;
  timestampValue?: string;
  nullValue?: null;
  arrayValue?: { values?: FsValue[] };
  mapValue?: { fields?: Record<string, FsValue> };
};

function decode(v: FsValue): unknown {
  if (v.stringValue !== undefined) return v.stringValue;
  if (v.booleanValue !== undefined) return v.booleanValue;
  if (v.integerValue !== undefined) return Number(v.integerValue);
  if (v.doubleValue !== undefined) return v.doubleValue;
  if (v.timestampValue !== undefined) return v.timestampValue;
  if (v.arrayValue) return (v.arrayValue.values ?? []).map(decode);
  if (v.mapValue) {
    return Object.fromEntries(
      Object.entries(v.mapValue.fields ?? {}).map(([k, x]) => [k, decode(x)]),
    );
  }
  return null;
}

const str = (v: unknown) => (typeof v === "string" ? v : "");
const list = (v: unknown) =>
  Array.isArray(v)
    ? v.filter((x): x is string => typeof x === "string" && x.trim() !== "")
    : [];

const getProfile = cache(async (id: string): Promise<Profile | null> => {
  if (!/^[A-Za-z0-9_-]{1,128}$/.test(id)) return null;
  const res = await fetch(
    "https://firestore.googleapis.com/v1/projects/" +
      PROJECT_ID +
      "/databases/(default)/documents/consultants/" +
      id,
    { next: { revalidate: 60 } },
  );
  if (!res.ok) return null;
  const json = (await res.json()) as { fields?: Record<string, FsValue> };
  if (!json.fields) return null;

  const d = decode({ mapValue: { fields: json.fields } }) as Record<string, unknown>;
  if (d.status !== "active") return null;

  return {
    id,
    name: str(d.name),
    title: str(d.title),
    description: str(d.description),
    tags: list(d.tags),
    photoUrl: str(d.photoUrl),
    emoji: str(d.emoji) || "👤",
    roleType: d.roleType === "instructor" ? "instructor" : "consultant",
    experience: list(d.experience),
    certifications: list(d.certifications),
    courses: list(d.courses),
    consultingNote: str(d.consultingNote),
  };
});

type PageProps = { params: Promise<{ id: string }> };

/* ---------- Metadata ---------- */

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { id } = await params;
  const p = await getProfile(id);
  if (!p) return { title: "找不到此頁面｜QAS 克斯" };
  const roleLabel = p.roleType === "instructor" ? "講師" : "顧問";
  const title = p.name + "｜QAS 克斯" + roleLabel;
  const description = p.description.slice(0, 120) || p.title || title;
  return {
    title,
    description,
    openGraph: { title, description, images: p.photoUrl ? [p.photoUrl] : undefined },
  };
}

/* ---------- 頁面 ---------- */

function ListBlock({ title, items }: { title: string; items: string[] }) {
  if (items.length === 0) return null;
  return (
    <section>
      <h2 className="mb-3 text-lg font-bold text-[#1a3a0f]">{title}</h2>
      <ul className="space-y-2 border-l-2 border-[#639922] pl-5 text-[15px] leading-relaxed text-stone-700">
        {items.map((x) => (
          <li key={x}>{x}</li>
        ))}
      </ul>
    </section>
  );
}

export default async function ConsultantDetailPage({ params }: PageProps) {
  const { id } = await params;
  const p = await getProfile(id);
  if (!p) notFound();

  const isInstructor = p.roleType === "instructor";
  const roleLabel = isInstructor ? "講師" : "顧問";

  return (
    <main className="bg-stone-50">
      {/* 主視覺 */}
      <section className="bg-[#1a3a0f] text-white">
        <div className="mx-auto flex max-w-4xl flex-col items-start gap-8 px-4 py-14 sm:flex-row sm:items-center">
          <div className="h-40 w-40 shrink-0 overflow-hidden rounded-full border-4 border-[#639922] bg-white/10">
            {p.photoUrl ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img src={p.photoUrl} alt={p.name} className="h-full w-full object-cover" />
            ) : (
              <div className="flex h-full w-full items-center justify-center text-6xl">{p.emoji}</div>
            )}
          </div>
          <div className="min-w-0">
            <span className="inline-block rounded bg-[#639922] px-2.5 py-0.5 text-sm font-semibold">
              QAS {roleLabel}
            </span>
            <h1 className="mt-3 text-4xl font-bold tracking-wide sm:text-5xl">{p.name}</h1>
            {p.title && <p className="mt-2 text-lg text-white/80">{p.title}</p>}
          </div>
        </div>
      </section>

      <div className="mx-auto grid max-w-4xl gap-10 px-4 py-12 md:grid-cols-[1fr_260px]">
        <div className="space-y-10">
          {p.tags.length > 0 && (
            <section>
              <h2 className="mb-3 text-lg font-bold text-[#1a3a0f]">專業領域</h2>
              <div className="flex flex-wrap gap-2">
                {p.tags.map((t) => (
                  <span
                    key={t}
                    className="rounded-full bg-[#EAF3DE] px-3.5 py-1.5 text-sm font-medium text-[#1a3a0f]"
                  >
                    {t}
                  </span>
                ))}
              </div>
            </section>
          )}

          {p.description && (
            <section>
              <h2 className="mb-3 text-lg font-bold text-[#1a3a0f]">個人簡介</h2>
              <p className="max-w-prose whitespace-pre-line text-[15px] leading-loose text-stone-700">
                {p.description}
              </p>
            </section>
          )}

          <ListBlock title="經歷" items={p.experience} />
          <ListBlock title="證照與認證" items={p.certifications} />
          <ListBlock title="主講課程" items={p.courses} />
        </div>

        {/* 側欄：預約與聯絡（公司統一聯絡資訊） */}
        <aside className="space-y-4 md:sticky md:top-6 md:self-start">
          {!isInstructor && (
            <div className="rounded-xl bg-white p-6 shadow-sm ring-1 ring-stone-200">
              <p className="font-bold text-[#1a3a0f]">預約一對一諮詢</p>
              {p.consultingNote && (
                <p className="mt-2 whitespace-pre-line text-sm leading-relaxed text-stone-600">
                  {p.consultingNote}
                </p>
              )}
              <Link
                href="/consultants"
                className="mt-4 block rounded-md bg-[#639922] px-4 py-2.5 text-center font-semibold text-white hover:bg-[#3B6D11]"
              >
                查看可預約時段
              </Link>
            </div>
          )}

          <div className="rounded-xl bg-white p-6 shadow-sm ring-1 ring-stone-200">
            <p className="font-bold text-[#1a3a0f]">
              邀請{p.name}
              {roleLabel}
            </p>
            <p className="mt-2 text-sm leading-relaxed text-stone-600">
              企業內訓、顧問輔導或課程合作，歡迎與我們聯繫。
            </p>
            <dl className="mt-4 space-y-2 text-sm text-stone-700">
              <div>
                <dt className="text-stone-500">電話</dt>
                <dd>
                  <a href="tel:0422433680" className="font-semibold hover:text-[#639922]">
                    04-2243-3680
                  </a>
                  <span className="ml-1 text-stone-500">（藍小姐／張先生）</span>
                </dd>
              </div>
              <div>
                <dt className="text-stone-500">LINE@</dt>
                <dd className="font-semibold">@713irmkk</dd>
              </div>
              <div>
                <dt className="text-stone-500">地址</dt>
                <dd>台中市北屯區文心路四段955號17樓</dd>
              </div>
            </dl>
            <a
              href="https://line.me/R/ti/p/@713irmkk"
              target="_blank"
              rel="noopener noreferrer"
              className="mt-5 block rounded-md border border-[#639922] px-4 py-2.5 text-center font-semibold text-[#3B6D11] hover:bg-[#EAF3DE]"
            >
              加 LINE 諮詢
            </a>
          </div>

          <Link href="/consultants" className="block text-center text-sm text-stone-500 hover:text-[#1a3a0f]">
            回顧問團隊
          </Link>
        </aside>
      </div>
    </main>
  );
}
