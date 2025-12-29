import React, { useRef, useEffect } from 'react';

/**
 * 金粉粒子效果 - Canvas 绘制向上飘动的金色粒子
 */
const GoldDustEffect = () => {
    const canvasRef = useRef(null);

    useEffect(() => {
        const canvas = canvasRef.current;
        if (!canvas) return;

        const ctx = canvas.getContext('2d');
        let width = window.innerWidth;
        let height = window.innerHeight;
        let animationId;

        canvas.width = width;
        canvas.height = height;

        // 金粉粒子
        const particles = Array.from({ length: 60 }, () => ({
            x: Math.random() * width,
            y: Math.random() * height,
            radius: Math.random() * 2 + 0.5,
            speedY: Math.random() * -0.5 - 0.1, // 向上飘动
            speedX: Math.random() * 0.4 - 0.2,
            opacity: Math.random() * 0.5 + 0.1,
            hue: Math.random() > 0.5 ? 45 : 35, // 金色/橙色
        }));

        const animate = () => {
            ctx.clearRect(0, 0, width, height);

            particles.forEach((p) => {
                ctx.beginPath();
                ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
                ctx.fillStyle = `hsla(${p.hue}, 100%, 70%, ${p.opacity})`;
                ctx.fill();

                p.y += p.speedY;
                p.x += p.speedX;

                // 循环：粒子飘出屏幕顶部后从底部重生
                if (p.y < -10) {
                    p.y = height + 10;
                    p.x = Math.random() * width;
                }
            });

            animationId = requestAnimationFrame(animate);
        };

        animate();

        const handleResize = () => {
            width = window.innerWidth;
            height = window.innerHeight;
            canvas.width = width;
            canvas.height = height;
        };

        window.addEventListener('resize', handleResize);

        return () => {
            window.removeEventListener('resize', handleResize);
            cancelAnimationFrame(animationId);
        };
    }, []);

    return (
        <canvas
            ref={canvasRef}
            className="fixed inset-0 pointer-events-none z-0"
        />
    );
};

export default GoldDustEffect;
