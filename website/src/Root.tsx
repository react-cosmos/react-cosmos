import React from 'react';
import styled from 'styled-components';
import { Header } from './Header';
import { HEADER_PADDING_PX, HEADER_SIZE_PX } from './shared';
import { useWindowViewport } from './use-window-viewport';
import { HEADER_SCROLL_LENGTH_PX, useHeaderScroll } from './useHeaderScroll';

export function Root() {
  const windowViewport = useWindowViewport();
  const scrollRatio = useHeaderScroll();
  const cropRatio = Math.min(1, scrollRatio * 2);
  const minimizeRatio = Math.max(0, scrollRatio - 0.5) * 2;
  const showContent = minimizeRatio >= 1;

  return (
    <Container
      style={{
        paddingTop:
          HEADER_SCROLL_LENGTH_PX + HEADER_SIZE_PX + 2 * HEADER_PADDING_PX,
        background: cropRatio > 0.5 ? '#fff' : '#093556'
      }}
    >
      <Header
        windowViewport={windowViewport}
        cropRatio={cropRatio}
        minimizeRatio={minimizeRatio}
      />
      <div style={{ opacity: showContent ? 1 : 0, transition: '0.4s opacity' }}>
        <p style={{ paddingTop: 128 }}>
          Lorem Ipsum is simply dummy text of the printing and typesetting
          industry. Lorem Ipsum has been the industry&apos;s standard dummy text
          ever since the 1500s, when an unknown printer took a galley of type
          and scrambled it to make a type specimen book. It has survived not
          only five centuries, but also the leap into electronic typesetting,
          remaining essentially unchanged. It was popularised in the 1960s with
          the release of Letraset sheets containing Lorem Ipsum passages, and
          more recently with desktop publishing software like Aldus PageMaker
          including versions of Lorem Ipsum.
        </p>
        {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16].map(i => (
          <p key={i}>
            Lorem Ipsum is simply dummy text of the printing and typesetting
            industry. Lorem Ipsum has been the industry&apos;s standard dummy
            text ever since the 1500s, when an unknown printer took a galley of
            type and scrambled it to make a type specimen book. It has survived
            not only five centuries, but also the leap into electronic
            typesetting, remaining essentially unchanged. It was popularised in
            the 1960s with the release of Letraset sheets containing Lorem Ipsum
            passages, and more recently with desktop publishing software like
            Aldus PageMaker including versions of Lorem Ipsum. Lorem Ipsum is
            simply dummy text of the printing and typesetting industry. Lorem
            Ipsum has been the industry&apos;s standard dummy text ever since
            the 1500s, when an unknown printer took a galley of type and
            scrambled it to make a type specimen book. It has survived not only
            five centuries, but also the leap into electronic typesetting,
            remaining essentially unchanged. It was popularised in the 1960s
            with the release of Letraset sheets containing Lorem Ipsum passages,
            and more recently with desktop publishing software like Aldus
            PageMaker including versions of Lorem Ipsum. Lorem Ipsum is simply
            dummy text of the printing and typesetting industry. Lorem Ipsum has
            been the industry&apos;s standard dummy text ever since the 1500s,
            when an unknown printer took a galley of type and scrambled it to
            make a type specimen book. It has survived not only five centuries,
            but also the leap into electronic typesetting, remaining essentially
            unchanged. It was popularised in the 1960s with the release of
            Letraset sheets containing Lorem Ipsum passages, and more recently
            with desktop publishing software like Aldus PageMaker including
            versions of Lorem Ipsum.
          </p>
        ))}
      </div>
    </Container>
  );
}

const Container = styled.div`
  padding: 64px;
`;
