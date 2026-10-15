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

Music Gacha tải metadata từ `public/data/music.json`, chọn đều ngẫu nhiên giữa các track, tránh lặp liên tiếp. Mỗi lần quay dựng 21 card tạm trong popup gọn, chạy ngẫu nhiên 7,0–9,0 giây theo bước 0,1 giây rồi tự chuyển sang popup kết quả riêng. Không có rarity/NEW/collection trên UI. Nhạc không được autoplay/nhúng: người dùng tự bấm link YouTube sau kết quả.

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

Tùy chọn: `--playlist ID_OR_URL`, `--output PATH`, hoặc `--input yt-dlp-export.json` để chuẩn hóa export có sẵn. Rarity trong JSON là metadata legacy được script giữ nguyên; gacha không dùng trường này để chọn bài hay hiển thị. Có thể bổ sung artist hoặc sửa title/rarity thủ công sau khi xác minh; sync chỉ cam kết giữ rarity/tags.

Lần sync 2026-10-12: 280 mục trả về, 280 track, 0 trùng, 0 unavailable trả về, 280 artist trống. Đây là kiểm tra flat metadata, không đảm bảo khả năng phát ở mọi vùng/quyền truy cập. Rarity: common 140, rare 83, legendary 43, epic 14.

Kiểm tra logic:

```sh
node --test tests/*.test.cjs
python tests/test_music_sync.py
```

Popup quay có entrance 400 ms (backdrop 350 ms), chờ animationend với fallback 500 ms rồi nghỉ 120 ms trước khi reel chạy. Đóng popup sẽ hủy pending start. Reduced motion bỏ entrance/pause và trả kết quả ngay.

Bốn section Hero/About/Fursona/Gallery là scene đảo chiều. Mỗi lần cuộn,
JS đo bốn layout box trong một RAF khi cần, dùng dải vào 16%/ra 8% viewport
để tránh flicker, giữ scene dài đọc được và không thay đổi document flow.
Scene vào scale .975/opacity 0/blur 4px → rõ; scene rời phía trên scale 1.025.
Transition 600 ms; Hero lần đầu stagger nhóm 100 ms, không translateY.
Bootstrap trước paint có fallback 1,8 giây; reduced motion luôn hiện nội dung.
Scene không nhìn thấy dùng inert để tránh focus/click vô hình.

Landing point được chọn độc lập sau winner: `0.10 + Math.random() * 0.80`,
dùng đúng một giá trị mỗi lượt cho animation và căn lại khi resize/kết thúc.
Marker vẫn cố định, kích thước lấy từ DOM. Cách chọn bài/tránh lặp không đổi;
không dùng xác suất lưu trong dataset. Playlist được fetch với `cache: 'no-store'`.

Link kết quả luôn là YouTube HTTPS canonical. Mobile dùng cùng tab để hệ
điều hành có thể xử lý app/universal link, fallback tự nhiên về YouTube web;
desktop vẫn mở tab mới. Không thể ép mở app nếu cài đặt hệ điều hành chặn.

Workflow `sync-music.yml` chạy thứ Hai 08:15 Việt Nam (01:15 UTC), hoặc bằng
workflow_dispatch. Dùng yt-dlp metadata-only và script sync hiện có; JSON mới
được kiểm tra structure, track không rỗng, ID duy nhất và URL canonical, ghi
file tạm rồi validate lại trước atomic replace. Sync lỗi giữ nguyên dữ liệu.
Timestamp đơn thuần không gây thay đổi. Chỉ khi có diff music.json mới tạo
commit `chore: sync music playlist` bằng GITHUB_TOKEN. Sau push, workflow gọi
workflow Pages dùng chung để deploy main mới nhất, vì push bằng GITHUB_TOKEN
không tự kích hoạt push workflow. Branch protection có thể chặn bot push;
workflow khi đó báo lỗi và không force push. Lịch GitHub có thể chạy trễ.


## Nhạc nền và refsheet

Nhạc nền duy nhất: Chocolate Lemon — ミツキヨ, `public/audio/chocolate-lemon.mp3`
(192 kbps stereo, 5.237.612 byte, khoảng 3:38), giữ WAV ngoài repository.
Player là đĩa tròn góc dưới trái, dùng đúng ảnh người dùng cung cấp tại
`public/assets/music/chocolate-lemon-disc.png`. Nhãn bài/artist hiện khi hover,
keyboard focus hoặc 2,8 giây sau touch. Đĩa dùng CSS timeline 10 giây/vòng,
chỉ đổi animation-play-state để pause/resume không reset góc hay thời gian nhạc.
Reduced motion bỏ chuyển động đĩa. Không có prev/next hoặc playlist player.

Autoplay thử một lần ở volume 0,15. Nếu bị chặn, chỉ thử lại tại tương tác thật
đầu tiên (disc tự xử lý click để không double-toggle). Từ chối autoplay không
báo lỗi. Lỗi media vô hiệu hóa control. Loop giữ nguyên. Không autoplay muted,
không tự unmute, không retry loop. Một số OS mobile quản lý âm lượng bằng
volume hệ thống thay vì HTMLMediaElement.volume.

Ref. A/B vẫn dùng mapping hiện có. Ảnh inline là button mở native dialog,
object-fit contain, backdrop tối/blur và animation nhẹ 240 ms (reduced motion
bỏ animation). Đóng bằng ×, backdrop hoặc Escape, trả focus mà không cuộn.
Đã bỏ caption dưới refsheet và toàn bộ section Một lời chào; Gallery nối footer.


## Wheel và Gallery

Desktop fine pointer nhận wheel rời rạc (line-mode hoặc pixel ticks lớn, nguyên
bội 20); delta nhỏ/phân số, touch/trackpad thông thường giữ native. Phân biệt
mouse/trackpad là heuristic, không có nhận dạng phần cứng tuyệt đối. Wheel dùng
cùng scrollRaf với navbar: phản hồi ngay 18%, tail time-based tau 80 ms (khoảng
400 ms), clamp đầu/cuối. Navbar, pointer, keyboard, modal và reduced motion hủy
inertia; không bắt wheel của dialog hoặc container cuộn riêng. Scrollbar desktop
thin khoảng 9px, palette xanh xám; không đổi overlay scrollbar mobile.

Gallery dùng `public/data/gallery.json` (hiện 23 Art + 8 Fursuit), xem
`public/assets/gallery/README.md`. Hai thư mục upload riêng:
- `public/assets/gallery/art/`: drawings/illustrations/commissions/fanart.
- `public/assets/gallery/fursuit/`: real fursuit/event/portrait photos.

Filter All/Art/Fursuit, tối đa 5 preview + tile +N nếu còn ảnh, overlay masonry
scrollable cho filter hiện tại, lightbox contain riêng cho từng ảnh. Native
dialog giữ focus, hỗ trợ ×/backdrop/Escape. Lazy/async loading, dimensions nếu
có, previewSrc tùy chọn. Empty state không tạo ảnh giả hoặc +0. Bộ ảnh người dùng cung cấp đã được lập chỉ mục với kích thước theo EXIF orientation
và alt mô tả nội dung. Giữ nguyên tên và file gốc; fixture kiểm thử không nằm trong dữ liệu production.
