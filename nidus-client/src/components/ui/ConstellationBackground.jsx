import { useEffect, useRef, useState } from "react";
import {
  MessageCircle,
  Heart,
  Sparkles,
  Users,
  Lock,
  Star,
  Moon,
  Sun,
} from "lucide-react";

const icons = [MessageCircle, Heart, Sparkles, Users, Lock, Star, Moon, Sun];

export default function ConstellationBackground() {
  const canvasRef = useRef(null);
  const [nodes, setNodes] = useState([]);
  const iconRefs = useRef([]);
  const animationRef = useRef(null);

  // Détermine le nombre de nœuds selon la largeur
  const getNumNodes = () => (window.innerWidth <= 768 ? 8 : 18);

  useEffect(() => {
    let width = window.innerWidth;
    let height = window.innerHeight;
    let edges = [];
    let nodesArray = [];
    let animFrame;
    let resizeTimeout;

    function init() {
      width = window.innerWidth;
      height = window.innerHeight;
      const canvas = canvasRef.current;
      canvas.width = width;
      canvas.height = height;

      const numNodes = getNumNodes();
      nodesArray = [];
      for (let i = 0; i < numNodes; i++) {
        nodesArray.push({
          id: i,
          x: 100 + Math.random() * (width - 200),
          y: 100 + Math.random() * (height - 200),
          vx: (Math.random() - 0.5) * 0.2,
          vy: (Math.random() - 0.5) * 0.2,
          phase: Math.random() * Math.PI * 2,
          Icon: icons[i % icons.length],
        });
      }
      setNodes(nodesArray);
    }

    function updateEdges() {
      edges = [];
      for (let i = 0; i < nodesArray.length; i++) {
        for (let j = i + 1; j < nodesArray.length; j++) {
          const dx = nodesArray[i].x - nodesArray[j].x;
          const dy = nodesArray[i].y - nodesArray[j].y;
          const dist = Math.hypot(dx, dy);
          if (dist < 200) {
            edges.push({ from: i, to: j });
          }
        }
      }
    }

    function drawCanvas(timestamp) {
      const canvas = canvasRef.current;
      const ctx = canvas.getContext("2d");
      if (!ctx) return;
      ctx.clearRect(0, 0, width, height);

      const accent = getComputedStyle(document.documentElement)
        .getPropertyValue("--accent")
        .trim();

      // Mise à jour des positions
      for (let node of nodesArray) {
        node.x += node.vx;
        node.y += node.vy;
        if (node.x < 40 || node.x > width - 40) node.vx *= -0.9;
        if (node.y < 40 || node.y > height - 40) node.vy *= -0.9;
        node.x = Math.min(Math.max(node.x, 40), width - 40);
        node.y = Math.min(Math.max(node.y, 40), height - 40);
      }
      updateEdges();

      // Vague lumineuse
      const wave = (Math.sin(timestamp * 0.002) + 1) / 2;
      const centerX = width / 2 + Math.sin(timestamp * 0.001) * 120;
      const centerY = height / 2 + Math.cos(timestamp * 0.0012) * 100;

      // Dessiner les lignes
      for (let edge of edges) {
        const from = nodesArray[edge.from];
        const to = nodesArray[edge.to];
        const midX = (from.x + to.x) / 2;
        const midY = (from.y + to.y) / 2;
        const distToCenter = Math.hypot(midX - centerX, midY - centerY);
        const intensity =
          Math.max(0, 1 - distToCenter / 350) * (0.4 + wave * 0.6);
        ctx.beginPath();
        ctx.moveTo(from.x, from.y);
        ctx.lineTo(to.x, to.y);
        ctx.strokeStyle = accent;
        ctx.globalAlpha = 0.2 + intensity * 0.4;
        ctx.lineWidth = 1.5;
        ctx.stroke();
      }

      // Mettre à jour les positions des icônes HTML
      iconRefs.current.forEach((ref, idx) => {
        if (ref && nodesArray[idx]) {
          ref.style.transform = `translate(${nodesArray[idx].x - 14}px, ${nodesArray[idx].y - 14}px)`;
        }
      });
    }

    function animate(timestamp) {
      drawCanvas(timestamp);
      animFrame = requestAnimationFrame(animate);
    }

    function handleResize() {
      // Éviter les recalculs trop fréquents
      if (resizeTimeout) clearTimeout(resizeTimeout);
      resizeTimeout = setTimeout(() => {
        init();
        // Réassigner les refs des icônes après la régénération des nœuds
        iconRefs.current = iconRefs.current.slice(0, nodesArray.length);
      }, 150);
    }

    init();
    animate(0);
    window.addEventListener("resize", handleResize);

    return () => {
      cancelAnimationFrame(animFrame);
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  return (
    <div
      style={{
        position: "fixed",
        top: 0,
        left: 0,
        width: "100%",
        height: "100%",
        zIndex: 0,
      }}
    >
      <canvas
        ref={canvasRef}
        style={{ width: "100%", height: "100%", display: "block" }}
      />
      {nodes.map((node, idx) => {
        const IconComponent = node.Icon;
        return (
          <div
            key={node.id}
            ref={(el) => (iconRefs.current[idx] = el)}
            style={{
              position: "absolute",
              left: 0,
              top: 0,
              width: 28,
              height: 28,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              pointerEvents: "none",
              transition: "transform 0.05s linear",
              transform: `translate(${node.x - 14}px, ${node.y - 14}px)`,
              filter: "blur(2px)",
            }}
          >
            <IconComponent size={24} color="var(--accent)" strokeWidth={1.5} />
          </div>
        );
      })}
    </div>
  );
}
