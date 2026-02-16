import { useCallback, useEffect, useRef, useState } from 'react';
import { TileLayer } from 'react-leaflet';
import { getBaseMapById } from '@/modules/map/data/baseMaps';
import { env } from '@/shared/config/env';
import { useAppSelector } from '@/store/hooks';
import { selectBaseMapId, selectTileLink, selectTileOpacity } from '@/store/slices/mapSelectors';

const OVERLAY_BASE_OPACITY = 0.8;
const TRANSITION_DURATION_MS = 240;

interface TilesLayerProps {
  overlayTileLink?: string;
}

export const TilesLayer = ({ overlayTileLink }: TilesLayerProps) => {
  const tileLinkFromState = useAppSelector(selectTileLink);
  const tileOpacity = useAppSelector(selectTileOpacity);
  const baseMapId = useAppSelector(selectBaseMapId);
  const tileLink = overlayTileLink ?? tileLinkFromState;
  const baseMap = getBaseMapById(baseMapId);

  const [visibleOverlayUrl, setVisibleOverlayUrl] = useState('');
  const [incomingOverlayUrl, setIncomingOverlayUrl] = useState<string | null>(null);
  const [transitionAlpha, setTransitionAlpha] = useState(0);

  const incomingUrlRef = useRef<string | null>(null);
  const startedFadeForUrlRef = useRef<string | null>(null);
  const animationFrameRef = useRef<number | null>(null);

  const overlayOpacity = OVERLAY_BASE_OPACITY * tileOpacity;

  const clearFadeAnimation = useCallback(() => {
    if (animationFrameRef.current !== null && typeof window !== 'undefined') {
      window.cancelAnimationFrame(animationFrameRef.current);
      animationFrameRef.current = null;
    }
  }, []);

  useEffect(() => {
    return () => {
      clearFadeAnimation();
    };
  }, [clearFadeAnimation]);

  useEffect(() => {
    incomingUrlRef.current = incomingOverlayUrl;
  }, [incomingOverlayUrl]);

  useEffect(() => {
    const nextOverlayUrl = tileLink || '';
    let timeoutId: number | null = null;

    const applyOverlayChange = () => {
      if (!nextOverlayUrl) {
        clearFadeAnimation();
        setIncomingOverlayUrl(null);
        incomingUrlRef.current = null;
        setVisibleOverlayUrl('');
        setTransitionAlpha(0);
        startedFadeForUrlRef.current = null;
        return;
      }

      if (!visibleOverlayUrl) {
        clearFadeAnimation();
        setVisibleOverlayUrl(nextOverlayUrl);
        setIncomingOverlayUrl(null);
        incomingUrlRef.current = null;
        setTransitionAlpha(0);
        startedFadeForUrlRef.current = null;
        return;
      }

      if (nextOverlayUrl === visibleOverlayUrl || nextOverlayUrl === incomingUrlRef.current) {
        return;
      }

      clearFadeAnimation();
      setIncomingOverlayUrl(nextOverlayUrl);
      incomingUrlRef.current = nextOverlayUrl;
      setTransitionAlpha(0);
      startedFadeForUrlRef.current = null;
    };

    if (typeof window !== 'undefined') {
      timeoutId = window.setTimeout(applyOverlayChange, 0);
    }

    return () => {
      if (timeoutId !== null && typeof window !== 'undefined') {
        window.clearTimeout(timeoutId);
      }
    };
  }, [clearFadeAnimation, tileLink, visibleOverlayUrl]);

  const startTransitionToIncomingLayer = useCallback(
    (targetUrl: string) => {
      if (!targetUrl || incomingUrlRef.current !== targetUrl) {
        return;
      }

      if (startedFadeForUrlRef.current === targetUrl) {
        return;
      }

      startedFadeForUrlRef.current = targetUrl;
      clearFadeAnimation();

      if (typeof window === 'undefined' || typeof window.requestAnimationFrame !== 'function') {
        setVisibleOverlayUrl(targetUrl);
        setIncomingOverlayUrl(null);
        incomingUrlRef.current = null;
        setTransitionAlpha(0);
        return;
      }

      const startedAt = performance.now();

      const step = (timestamp: number) => {
        const progress = Math.min(1, (timestamp - startedAt) / TRANSITION_DURATION_MS);
        setTransitionAlpha(progress);

        if (progress < 1) {
          animationFrameRef.current = window.requestAnimationFrame(step);
          return;
        }

        if (incomingUrlRef.current === targetUrl) {
          setVisibleOverlayUrl(targetUrl);
          setIncomingOverlayUrl(null);
          incomingUrlRef.current = null;
          setTransitionAlpha(0);
        }

        animationFrameRef.current = null;
      };

      animationFrameRef.current = window.requestAnimationFrame(step);
    },
    [clearFadeAnimation],
  );

  const incomingLayerUrl = incomingOverlayUrl;

  return (
    <>
      <TileLayer
        key={`base-${baseMap.id}`}
        opacity={1}
        url={baseMap.url}
        attribution={baseMap.attribution}
      />

      {visibleOverlayUrl && (
        <TileLayer
          key={`overlay-visible-${visibleOverlayUrl}`}
          opacity={overlayOpacity * (incomingOverlayUrl ? 1 - transitionAlpha : 1)}
          minZoom={5}
          maxZoom={12}
          keepBuffer={4}
          updateWhenIdle={false}
          url={`${env.tileApiUrl}${visibleOverlayUrl}`}
        />
      )}

      {incomingLayerUrl && (
        <TileLayer
          key={`overlay-incoming-${incomingLayerUrl}`}
          opacity={overlayOpacity * transitionAlpha}
          minZoom={5}
          maxZoom={12}
          keepBuffer={4}
          updateWhenIdle={false}
          eventHandlers={{
            load: () => startTransitionToIncomingLayer(incomingLayerUrl),
          }}
          url={`${env.tileApiUrl}${incomingLayerUrl}`}
        />
      )}
    </>
  );
};
