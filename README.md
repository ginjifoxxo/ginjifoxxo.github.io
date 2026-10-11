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

Music gacha có danh sách `musicTracks` trong `public/app.js`, hiện để trống vì chưa có bài hát được duyệt. Chỉ thêm track được người dùng cung cấp với `title`, `artist` và `url` tùy chọn. Track được chọn ngẫu nhiên, tránh lặp ngay bài trước; URL chỉ mở từ thao tác bấm trực tiếp. Khi danh sách rỗng, control hiển thị thông báo VI/EN và không gửi request nhạc.

Mỗi lần push lên `main` sẽ cập nhật website. Chờ workflow thành công trước khi kiểm tra bản mới.

Nguồn và cách xử lý logo social được ghi tại `public/assets/social/README.md`.

## Ngắt nền tảng triển khai cũ

Nếu project vẫn được liên kết với Vercel, mở project đó tại **Settings → Git** và ngắt kết nối repository. Xóa cấu hình trong repository không tự ngắt Git integration ở dịch vụ bên ngoài. Không cần xóa project hay deployment cũ để dùng GitHub Pages.

Luồng triển khai của repository này: **GitHub → GitHub Actions → GitHub Pages**.
