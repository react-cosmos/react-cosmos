import React from 'react';
import { FixtureId } from 'react-cosmos-shared2/renderer';
import styled from 'styled-components';
import { RefreshCwIcon, XCircleIcon } from '../../shared/icons';
import { RendererActionSlot } from '../../shared/slots/RendererActionSlot';
import { IconButton32 } from '../../shared/ui/buttons';
import { grey192, grey32, white10 } from '../../shared/ui/colors';

type Props = {
  fixtureId: FixtureId;
  rendererActionOrder: string[];
  onReload: () => unknown;
  onClose: () => unknown;
};

export const RendererHeader = React.memo(function RendererHeader({
  fixtureId,
  rendererActionOrder,
  onReload,
  onClose
}: Props) {
  const slotProps = React.useMemo(() => ({ fixtureId }), [fixtureId]);
  return (
    <Container>
      <Left>
        <IconButton32
          icon={<XCircleIcon />}
          title="Close fixture"
          onClick={onClose}
        />
      </Left>
      <Right>
        <IconButton32
          icon={<RefreshCwIcon />}
          title="Reload fixture"
          onClick={onReload}
        />
        <RendererActionSlot
          slotProps={slotProps}
          plugOrder={rendererActionOrder}
        />
      </Right>
    </Container>
  );
});

const Container = styled.div`
  flex-shrink: 0;
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: space-between;
  height: 40px;
  padding: 0 4px;
  border-top: 1px solid ${white10};
  border-bottom: 1px solid ${white10};
  background: ${grey32};
  color: ${grey192};
  white-space: nowrap;
  overflow-x: auto;
`;

const Actions = styled.div`
  > button {
    margin-left: 4px;

    :first-child {
      margin-left: 0;
    }
  }
`;

const Left = styled(Actions)`
  display: flex;
  flex-direction: row;
  align-items: center;
`;

const Right = styled(Actions)`
  display: flex;
  flex-direction: row;
  align-items: center;
`;
