import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

// Ensure ScrollTrigger is registered safely in browser environments
if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
  gsap.defaults({
    ease: "power2.out",
    duration: 0.7,
  });
}

/**
 * Animate an element or list of elements fading and sliding upwards
 */
export function animateFadeUp(target, options = {}) {
  if (!target) return null;
  return gsap.fromTo(
    target,
    {
      opacity: 0,
      y: options.y ?? 28,
      ...(options.from || {}),
    },
    {
      opacity: 1,
      y: 0,
      duration: options.duration ?? 0.8,
      ease: options.ease ?? "power3.out",
      delay: options.delay ?? 0,
      clearProps: options.clearProps ?? "transform,opacity",
      ...(options.to || {}),
    }
  );
}

/**
 * Staggered fade and slide upwards for multiple child elements
 */
export function animateStagger(targets, options = {}) {
  if (!targets) return null;
  return gsap.fromTo(
    targets,
    {
      opacity: 0,
      y: options.y ?? 24,
      scale: options.scale ?? 0.98,
    },
    {
      opacity: 1,
      y: 0,
      scale: 1,
      stagger: options.stagger ?? 0.08,
      duration: options.duration ?? 0.7,
      ease: options.ease ?? "power2.out",
      delay: options.delay ?? 0,
      clearProps: options.clearProps ?? "transform,opacity",
    }
  );
}

/**
 * ScrollTrigger powered staggered reveal
 */
export function createScrollStagger(trigger, targets, options = {}) {
  if (!trigger || !targets) return null;
  return gsap.fromTo(
    targets,
    {
      opacity: 0,
      y: options.y ?? 35,
      scale: options.scale ?? 0.97,
    },
    {
      opacity: 1,
      y: 0,
      scale: 1,
      stagger: options.stagger ?? 0.1,
      duration: options.duration ?? 0.75,
      ease: options.ease ?? "power2.out",
      scrollTrigger: {
        trigger: trigger,
        start: options.start ?? "top 85%",
        once: options.once ?? true,
        toggleActions: "play none none none",
      },
      clearProps: options.clearProps ?? "transform,opacity",
    }
  );
}

/**
 * Continuous gentle floating animation (ideal for badges, icons, accent graphics)
 */
export function animateFloat(target, options = {}) {
  if (!target) return null;
  return gsap.to(target, {
    y: options.y ?? -7,
    duration: options.duration ?? 2.2,
    ease: options.ease ?? "sine.inOut",
    repeat: -1,
    yoyo: true,
    delay: options.delay ?? 0,
  });
}

/**
 * Smooth number counter animation
 */
export function animateCounter(target, endValue, options = {}) {
  if (!target) return null;
  const obj = { val: options.startValue ?? 0 };
  return gsap.to(obj, {
    val: endValue,
    duration: options.duration ?? 1.4,
    ease: options.ease ?? "power2.out",
    onUpdate: () => {
      if (typeof options.onUpdate === "function") {
        options.onUpdate(Math.round(obj.val));
      }
    },
  });
}

export { gsap, ScrollTrigger };
