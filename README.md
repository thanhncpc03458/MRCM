# MRCM — Christmas Wonderland

Một website thiệp Giáng Sinh tương tác, responsive và không phụ thuộc backend.

## Chạy local

Mở [index.html](./index.html) trực tiếp bằng trình duyệt, hoặc chạy một static server:

```bash
python3 -m http.server 8000
```

Sau đó truy cập `http://localhost:8000`.

Trải nghiệm gồm mở hộp quà, tuyết rơi, lời chúc đánh máy, đèn cây thông, điều ước, thư bí mật và nhạc nền tạo bằng Web Audio API (chỉ phát sau khi người dùng tương tác).

## Xuất bản công khai

Workflow GitHub Pages sẽ tự động triển khai website sau mỗi lần cập nhật nhánh `main`. Lần đầu, vào **Settings → Pages**, chọn **GitHub Actions** ở mục **Source**, rồi chạy lại workflow `Deploy Christmas Wonderland`. Link công khai có dạng:

`https://thanhncpc03458.github.io/MRCM/`