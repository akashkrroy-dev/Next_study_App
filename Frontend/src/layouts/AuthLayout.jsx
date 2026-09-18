import React, { useEffect, useState, useRef } from 'react'
import gsap from 'gsap';
import { Outlet } from "react-router-dom";
import { useGSAP } from '@gsap/react';
import { Draggable } from "gsap/Draggable";
import FlipOutlet from "../utils/FlipOutlet.jsx"
import "./css/zAuthLayout.css"


const AuthLayout = () => {

  const cardRef = useRef(null)
  const leftLineRef = useRef(null)
  const rightLineRef = useRef(null)
  const topLineRef = useRef(null)
  const bottomLineRef = useRef(null)
  const layoutRef = useRef(null)
  const textRef = useRef(null)

  const [coords, setCoords] = useState({ x: 0, y: 0 })

  function updateLines() {
    if (
      !cardRef.current ||
      !leftLineRef.current ||
      !rightLineRef.current ||
      !topLineRef.current ||
      !bottomLineRef.current ||
      !textRef.current
    ) {
      return;
    }

    const rect = cardRef.current.getBoundingClientRect();
    const GAP = 15

    leftLineRef.current.style.left = (rect.left - GAP) + "px";
    rightLineRef.current.style.left = (rect.right + GAP) + "px";
    topLineRef.current.style.top = (rect.top - GAP) + "px";
    bottomLineRef.current.style.top = (rect.bottom + GAP) + "px";

    const textWidth = textRef.current.offsetWidth || 280
    const OFFSET_X = 24;
    const OFFSET_Y = 24;

    textRef.current.style.left = (rect.left - GAP - textWidth - OFFSET_X) + "px";
    textRef.current.style.top = (rect.bottom + GAP - textRef.current.offsetHeight - OFFSET_Y) + "px";

    setCoords({ x: Math.round(rect.left + rect.width / 2), y: Math.round(rect.top + rect.height / 2) })
  }

  useGSAP(() => {
    gsap.set(cardRef.current, { x: 900, y: 125 });
    updateLines();

    Draggable.create(cardRef.current, {
      type: "x,y",
      bounds: ".auth-layout",
      dragClickables: false,
      onDrag: updateLines,
      onThrowUpdate: updateLines,
    });

    const handleMouseMove = (e) => {
      if (!layoutRef.current) return;

      const rect = layoutRef.current.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;

      layoutRef.current.style.setProperty('--x', `${x}px`);
      layoutRef.current.style.setProperty('--y', `${y}px`);
    };

    gsap.to([leftLineRef.current, rightLineRef.current], {
      backgroundPositionY: "20px",
      duration: 1,
      repeat: -1,
      ease: "linear",
    });

    gsap.to([topLineRef.current, bottomLineRef.current], {
      backgroundPositionX: "20px",
      duration: 1,
      repeat: -1,
      ease: "linear",
    });

    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  return (
    <div className="auth-layout" ref={layoutRef}>
        {/* lines */}
        <div className="left-line" ref={leftLineRef}></div>
        <div className="right-line" ref={rightLineRef}></div>
        <div className="top-line" ref={topLineRef}></div>
        <div className="bottom-line" ref={bottomLineRef}></div>

        <p className="ambient-copy" ref={textRef}>
          A quiet system for the parts of student life that pile up — attendance, habits, todos, events — tracked in one place, so nothing slips through.
        </p>

        <div className="coord-readout">
          X: {coords.x} · Y: {coords.y}
        </div>

        {/* Form Layout */}
        <div className="form-card" ref={cardRef}>
          <FlipOutlet />
        </div>
      </div>
  )
}

export default AuthLayout