# Ginji Portfolio

Website cá nhân của Ginji (CoCo), viết bằng HTML, CSS và JavaScript thuần. Không cần cài thư viện hoặc build.

## Cấu trúc

- `public/index.html`: nội dung trang.
- `public/styles.css`: giao diện và bố cục responsive.
- `public/navigation-start.js`: xóa hash cũ trước khi render và xử lý reload về Hero.
- `public/app.js`: chuyển ngôn ngữ, ánh sao và tương tác khi cuộn.
- `public/assets/`: ảnh và tài nguyên tĩnh.
- `.github/workflows/pages.yml`: triển khai trực tiếp lên GitHub Pages.

## Xem trên máy

Mở `public/index.html` trong trình duyệt, hoặc phục vụ thư mục `public` bằng HTTP server tĩnh.

Kiểm tra cú pháp JavaScript nếu có Node.js:

```sh
node --check public/app.js
node --check public/navigation-start.js
```

## GitHub Pages

URL production: https://ginjifoxxo.github.io/

Repository hiện tại: `ginjifoxxo/ginjifoxxo.github.io`. Nếu cần kiểm tra thiết lập Pages:

1. Mở **Settings → Pages → Build and deployment**.
2. Chọn **Source: GitHub Actions**.
3. Push workflow lên nhánh `main`. Xem tiến trình tại **Actions → Deploy to GitHub Pages**; có thể chạy lại bằng **Run workflow**.

Workflow kiểm tra cú pháp JavaScript, đóng gói riêng thư mục `public` và triển khai bằng các GitHub Pages actions chính thức. Không có bước build, dependency bên ngoài hay token triển khai thủ công; dùng `GITHUB_TOKEN` của workflow.

CSS, JavaScript và ảnh dùng đường dẫn tương đối (`styles.css`, `app.js`, `assets/...`), hoạt động ở domain gốc và cả khi xem dưới thư mục con. Các button điều hướng section không thay đổi URL; hash cũ được xóa mà không tạo history entry mới. Reload trở về Hero.

Music Gacha tải metadata từ `public/data/music.json`, chọn rarity theo trọng số rồi chọn track, tránh lặp liên tiếp. Mỗi lần quay chỉ dựng 21 card tạm; collection lưu localStorage. Nhạc không được autoplay/nhúng: người dùng tự bấm link YouTube sau kết quả.

Mỗi lần push lên `main` sẽ cập nhật website. Chờ workflow thành công trước khi kiểm tra bản mới.

Nguồn và cách xử lý logo social được ghi tại `public/assets/social/README.md`.

## Ngắt nền tảng triển khai cũ

Nếu project vẫn được liên kết với Vercel, mở project đó tại **Settings → Git** và ngắt kết nối repository. Xóa cấu hình trong repository không tự ngắt Git integration ở dịch vụ bên ngoài. Không cần xóa project hay deployment cũ để dùng GitHub Pages.

Luồng triển khai của repository này: **GitHub → GitHub Actions → GitHub Pages**.

## Đồng bộ playlist nhạc

Playlist hiện tại: https://www.youtube.com/playlist?list=PLF_QC1tSP8yo

Chỉ dùng yt-dlp khi phát triển (không phải dependency runtime):

```sh
python -m pip install yt-dlp
python scripts/sync-youtube-playlist.py
```

Script cập nhật `public/data/music.json`, giữ rawTitle/channel, deduplicate theo videoId, báo mục bị loại và artist chưa xác định. Artist chỉ lấy khi metadata ghi rõ; channel không được coi là artist. Không tải audio/video/thumbnail. Rarity ban đầu là hash videoId ổn định, không đánh giá chất lượng hay độ phổ biến; các rarity/tags đã chỉnh tay được giữ khi resync cùng videoId. Khi sync lỗi, dữ liệu cũ giữ nguyên.

Tùy chọn: `--playlist ID_OR_URL`, `--output PATH`, hoặc `--input yt-dlp-export.json` để chuẩn hóa export có sẵn. Trọng số quay 50/28/16/6 nằm ở đầu `public/music-gacha.js`, độc lập số track trong từng pool. Có thể bổ sung artist hoặc sửa title/rarity thủ công sau khi xác minh; sync chỉ cam kết giữ rarity/tags.

Lần sync 2026-10-12: 280 mục trả về, 280 track, 0 trùng, 0 unavailable trả về, 280 artist trống. Đây là kiểm tra flat metadata, không đảm bảo khả năng phát ở mọi vùng/quyền truy cập. Rarity: common 140, rare 83, legendary 43, epic 14.

Kiểm tra logic:

```sh
node --test tests/*.test.cjs
python tests/test_music_sync.py
```
