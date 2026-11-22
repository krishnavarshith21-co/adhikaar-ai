"use client";

import dynamic from "next/dynamic";
import React, { Component, type ReactNode } from "react";
import { SculptureFallback } from "./sculpture-fallback";

interface Props {
  children?: ReactNode;
}

interface State {
  hasError: boolean;
}

class ThreeErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError() {
    return { hasError: true };
  }

  componentDidCatch(error: Error) {
    console.warn("3D Heritage Sculpture fallback activated:", error.message);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="heritage-viewer">
          <SculptureFallback />
        </div>
      );
    }
    return this.props.children;
  }
}

const DynamicHeroSculpture = dynamic(
  () =>
    import("@/components/three/hero-sculpture").then((mod) => mod.HeroSculpture),
  {
    ssr: false,
    loading: () => (
      <div className="heritage-viewer">
        <SculptureFallback />
      </div>
    ),
  }
);

export function SculptureWrapper() {
  return (
    <ThreeErrorBoundary>
      <DynamicHeroSculpture />
    </ThreeErrorBoundary>
  );
}
