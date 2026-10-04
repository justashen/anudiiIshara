import { useEffect } from 'react';

export default function ProximityHover() {
  useEffect(() => {
    let elements: HTMLElement[] = [];
    
    const updateElements = () => {
      // Exclude elements with specific tailwind filter classes to prevent overriding
      elements = Array.from(document.querySelectorAll('h1, h2, h3, h4, p, span, a, img:not(.invert), button, .flower-mask')) as HTMLElement[];
    };
    
    updateElements();
    const observer = new MutationObserver(updateElements);
    observer.observe(document.body, { childList: true, subtree: true });

    let mouseX = -1000;
    let mouseY = -1000;
    let isMoving = false;

    const handleMouseMove = (e: MouseEvent) => {
      mouseX = e.clientX;
      mouseY = e.clientY;
      if (!isMoving) {
        isMoving = true;
        requestAnimationFrame(updateEffects);
      }
    };

    const updateEffects = () => {
      elements.forEach(el => {
        const rect = el.getBoundingClientRect();
        const elX = rect.left + rect.width / 2;
        const elY = rect.top + rect.height / 2;
        
        const distX = mouseX - elX;
        const distY = mouseY - elY;
        const distance = Math.sqrt(distX * distX + distY * distY);
        
        const maxDistance = 250;
        
        if (distance < maxDistance) {
          const intensity = 1 - (distance / maxDistance);
          const easeIntensity = Math.pow(intensity, 1.5);
          el.style.setProperty('--prox-int', easeIntensity.toFixed(3));
        } else {
          el.style.setProperty('--prox-int', '0');
        }
      });
      isMoving = false;
    };

    window.addEventListener('mousemove', handleMouseMove);
    
    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      observer.disconnect();
    };
  }, []);

  return null;
}
