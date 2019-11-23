import React from 'react';
import styled from 'styled-components';
import { Header } from './Header';
import { CONTENT_TOP_PADDING_PX, useHeaderScroll } from './useHeaderScroll';
import { useWindowViewport } from './useWindowViewport';
import { useWindowYScroll } from './useWindowYScroll';

export function Root() {
  const windowViewport = useWindowViewport();
  const yScroll = useWindowYScroll();
  const { cropRatio, minimizeRatio } = useHeaderScroll(yScroll);
  const showContent = minimizeRatio >= 1;

  const Features = styled.div`
    display: flex;
    flex-direction: row;
  `;

  const Feature = styled.div`
    &:first-child {
      margin-right: 32px;
    }
    &:last-child {
      margin-left: 32px;
    }
  `;

  return (
    <Container
      style={{
        paddingTop: CONTENT_TOP_PADDING_PX,
        background: cropRatio > 0.5 ? '#fff' : '#093556'
      }}
    >
      <Header
        windowViewport={windowViewport}
        cropRatio={cropRatio}
        minimizeRatio={minimizeRatio}
      />
      <Content style={{ opacity: showContent ? 1 : 0 }}>
        <Section style={{ margin: `50vh 0 0 0` }}>
          <Features>
            <Feature>
              <strong>Visual TDD.</strong>
              <br />
              Develop one component at a time. Isolate the UI you're working on
              and iterate quickly. Reloading your whole app on every change is
              slowing you down!
            </Feature>
            <Feature>
              <strong>Component library.</strong>
              <br />
              From blank states to edge cases, define component states to come
              back to. Your component library keeps you organized and makes a
              great foundation of test cases.
            </Feature>
            <Feature>
              <strong>Open platform.</strong>
              <br />
              React Cosmos is simple, but can be used in powerful ways. Snapshot
              and visual regression tests are possible, as well as custom
              integrations tailored to your needs.
            </Feature>
          </Features>
        </Section>
        {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16].map(i => (
          <Section key={i}>
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
          </Section>
        ))}
      </Content>
    </Container>
  );
}

const Container = styled.div`
  color: #093556;
`;

const Content = styled.div`
  max-width: 960px;
  margin: 0 auto;
  line-height: 1.5em;
  transition: 0.4s opacity;
  padding: 16px;
`;

const Section = styled.div`
  margin: 128px 0;
`;
