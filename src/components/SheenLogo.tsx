"use client";
import { useEffect, useRef } from "react";

/**
 * Hero logo with the living gold sheen (hero only): the gold areas — gate, seam and the GATE letters — share one
 * gradient whose highlight follows the pointer (device tilt on phones), plus a very slight 3D tilt.
 * The ribbon and the shadowed stem stay flat blue. Static when the visitor prefers reduced motion.
 */
export function SheenLogo({ svg, vbX, vbW, className }: { svg: string; vbX: number; vbW: number; className?: string }) {
  const box = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const el = box.current;
    if (!el || window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const grad = el.querySelector("#nvSheen") as SVGLinearGradientElement | null;
    if (!grad) return;
    let raf = 0, nx = 0.5, ny = 0.5;
    const apply = () => {
      raf = 0;
      const x1 = vbX + vbW * (nx - 0.55), x2 = vbX + vbW * (nx + 0.55);
      grad.setAttribute("x1", String(x1));
      grad.setAttribute("x2", String(x2));
      el.style.transform = `perspective(900px) rotateY(${((nx - 0.5) * 16).toFixed(2)}deg) rotateX(${(-(ny - 0.5) * 12).toFixed(2)}deg)`;
    };
    const set = (x: number, y: number) => { nx = Math.min(1, Math.max(0, x)); ny = Math.min(1, Math.max(0, y)); if (!raf) raf = requestAnimationFrame(apply); };
    const onMove = (e: PointerEvent) => set(e.clientX / window.innerWidth, e.clientY / window.innerHeight);
    const onTilt = (e: DeviceOrientationEvent) => { if (e.gamma !== null && e.beta !== null) set(0.5 + (e.gamma ?? 0) / 60, 0.5 + ((e.beta ?? 45) - 45) / 60); };
    window.addEventListener("pointermove", onMove, { passive: true });
    window.addEventListener("deviceorientation", onTilt, { passive: true });
    apply();
    return () => { window.removeEventListener("pointermove", onMove); window.removeEventListener("deviceorientation", onTilt); if (raf) cancelAnimationFrame(raf); };
  }, [vbX, vbW]);
  return <div ref={box} className={className} style={{ transition: "transform .25s ease-out", willChange: "transform" }} dangerouslySetInnerHTML={{ __html: svg }} />;
}
