# NEXTU Portfolio

Next.js 16 + Tailwind 4 포트폴리오. 내용·이미지·레이아웃은 설정 페이지(`/admin`)에서 관리합니다.

## 로컬 실행

```bash
npm install
cp .env.example .env.local   # ADMIN_USERNAME / ADMIN_PASSWORD 를 채워 넣기
npm run dev
```

- 사이트: http://localhost:3000
- 설정 페이지: http://localhost:3000/admin

DB·Blob 을 연결하지 않으면 로컬에서는 설정이 `.data/site.json`, 이미지가 `public/uploads/` 에 저장됩니다 (둘 다 git 제외).

## 설정 페이지로 할 수 있는 것

- 사이트 기본: 로고, 사이트 이름, 포인트 색, 연락처
- 홈 / 카테고리 페이지를 **블록** 단위로 구성
  - 블록 종류: 메인 이미지, 원형 카테고리 메뉴, 카테고리별 작업 줄, 키워드, 메인 배너, 작업 진열, 소개 글
  - 블록마다 레이아웃 선택, 표시/숨김, 순서 변경(↑↓), 복제, 삭제
  - 슬라이드·배너·작업도 추가/삭제/순서 변경, 이미지 업로드로 교체
- 카테고리 추가/삭제/순서 변경(상단 메뉴 순서), 숨김
- 페이지 템플릿: 쇼핑몰형 / 매거진형 / 갤러리형 / 소개형
- 저장하면 사이트에 바로 반영됩니다 (⌘S 저장, 저장 전 ‘되돌리기’ 가능)

## Vercel 배포 설정 (최초 1회)

1. Vercel 프로젝트 → **Storage** → **Neon (Postgres)** 생성 후 이 프로젝트에 연결
   → `DATABASE_URL` 이 자동으로 들어옵니다. 테이블은 첫 저장 때 자동 생성됩니다.
2. Vercel 프로젝트 → **Storage** → **Blob** 생성 후 연결 (Public 스토어)
   → 이미지 업로드용 환경변수가 자동으로 들어옵니다.
3. **Settings → Environment Variables** 에 추가
   - `ADMIN_USERNAME`: 설정 페이지 아이디 (비워두면 `admin`)
   - `ADMIN_PASSWORD`: 설정 페이지 비밀번호
   - `ADMIN_SESSION_SECRET`: 아무 긴 랜덤 문자열 (예: `openssl rand -hex 32`)
4. **Redeploy** 하면 `/admin` 에서 로그인할 수 있습니다.

Neon·Blob 모두 Hobby(무료) 한도 안에서 쓸 수 있습니다.

## 구조

| 경로 | 내용 |
| --- | --- |
| `src/lib/schema.ts` | 설정 데이터 구조 (zod) |
| `src/lib/defaults.ts` | 저장된 설정이 없을 때의 기본값 |
| `src/lib/templates.ts` | 블록 기본값, 페이지 템플릿, 레이아웃 이름 |
| `src/lib/store.ts` | 설정 읽기/저장 (Neon 또는 로컬 파일), 캐시 |
| `src/components/blocks/` | 블록별 화면 컴포넌트 |
| `src/app/admin/` | 설정 페이지, 로그인, 저장 액션 |
| `src/app/api/admin/upload/` | 이미지 업로드 (Blob 또는 로컬) |
