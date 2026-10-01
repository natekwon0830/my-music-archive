# Music Archive

개인 음악 취향 아카이브 웹사이트입니다. 두 개의 화면으로 구성됩니다.

- 앨범 보관함: 앨범명, 아티스트 이름, 장르, 평점, 리뷰
- 라이브 보관함: YouTube 영상 ID, 아티스트 이름, 평점, 리뷰

## Google Sheets 입력 형식

### 앨범 시트

| 컬럼 | 예시 |
|---|---|
| album_name | OK Computer |
| artist_name | Radiohead |
| genre | Alternative Rock |
| rating | 9.5 |
| review | 혼란과 사랑이 동시에 흐르는 앨범 |

### 라이브 시트

| 컬럼 | 예시 |
|---|---|
| youtube_video_id | dQw4w9WgXcQ |
| artist_name | Khruangbin |
| rating | 9.0 |
| review | 무대 위 여유가 정말 좋았다 |

## 로컬 실행

```bash
npm run dev
```

브라우저에서 http://localhost:3000 을 엽니다.

## 프로젝트 구조

- `src/app/` : 홈, 앨범 페이지, 라이브 페이지
- `src/data/music.ts` : 예시 데이터와 스프레드시트 컬럼 정의
- `src/app/globals.css` : 전체 스타일

## 다음 단계

1. Google Sheets와 연결하기
2. Spotify API로 커버 이미지/장르 정보를 보강하기
3. YouTube 영상 ID를 기반으로 임베드 안정성 개선하기
4. 실제 스프레드시트와 연동된 서버 API를 추가하기
