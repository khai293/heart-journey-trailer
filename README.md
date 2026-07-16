# The Heart Journey — Official Trailer

Trailer chính thức (~1 phút) cho **[The Heart Journey](https://khai293.github.io/heart-journey/)** —
bộ phim hoạt hình pixel không lời dài 8 phút về một chuyện tình.

**Xem trailer:** https://khai293.github.io/heart-journey-trailer/

## Trailer có gì

- 11 khoảnh khắc đẹp nhất cắt từ 10 chương của phim: bữa ăn đầu tiên, thư viện,
  tin nhắn đêm khuya, bình minh trên biển, lẩu đêm, rạp phim, cái nắm tay,
  nụ hôn má, chuyến đi ven biển, trái tim hợp nhất và bó hoa xanh nước biển.
- Title card, letterbox điện ảnh, nhạc nền procedural (Web Audio) dồn dần theo nhịp dựng.
- Kết thúc bằng nút **▶ Xem phim đầy đủ** dẫn sang bộ phim trọn vẹn.

## Chạy local

Mở `index.html` bằng trình duyệt bất kỳ, hoặc:

```
python -m http.server 8229
```

rồi vào `http://localhost:8229`.

## Kỹ thuật

- Canvas 384×216 supersample 3×, mọi cảnh là hàm thuần của thời gian `t`.
- `js/gfx.js`, `js/scenes1.js`, `js/scenes2.js`, `js/music.js` dùng chung với phim gốc;
  `js/trailer.js` là bộ máy cắt dựng riêng (shot list + music cues + title cards).

🤖 Generated with [Claude Code](https://claude.com/claude-code)
