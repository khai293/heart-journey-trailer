# The Heart Journey — Official Trailer

Trailer chính thức (~1 phút) cho **The Heart Journey** — bộ phim hoạt hình pixel
không lời về một chuyện tình. Trailer đứng độc lập, tự kể trọn vẹn phần mở đầu
của câu chuyện.

**Xem trailer:** https://khai293.github.io/heart-journey-trailer/

## Trailer có gì

- 11 khoảnh khắc: bữa ăn đầu tiên, thư viện, tin nhắn đêm khuya, bình minh trên biển,
  lẩu đêm, rạp phim, cái nắm tay, nụ hôn má, chuyến đi ven biển, trái tim hợp nhất
  và bó hoa xanh nước biển.
- Title card, letterbox điện ảnh, nhạc nền procedural (Web Audio) dồn dần theo nhịp dựng.

## Chạy local

Mở `index.html` bằng trình duyệt bất kỳ, hoặc:

```
python -m http.server 8229
```

rồi vào `http://localhost:8229`.

## Kỹ thuật

- Canvas 384×216 supersample 3×, mọi cảnh là hàm thuần của thời gian `t`.
- `js/gfx.js`, `js/scenes1.js`, `js/scenes2.js`, `js/music.js` là engine pixel dùng chung;
  `js/trailer.js` là bộ máy cắt dựng riêng (shot list + music cues + title cards).

🤖 Generated with [Claude Code](https://claude.com/claude-code)
