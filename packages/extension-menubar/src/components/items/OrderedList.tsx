import React from 'react';
import { IconListNumberBold } from '@gitee/icons-react';
import { isActive } from '@gitee/wysiwyg-editor-react';
import { MenuBarItem } from '../MenuBarItem';
import { useStatusMap } from '../../MenuBarContext';
import { Tooltip } from '../Tooltip';
import { Button } from '../Button';
import { command } from '../../utils';

export type OrderedListProps = {
  className?: string;
  style?: React.CSSProperties;
  title?: string;
};

export const OrderedList: React.FC<OrderedListProps> = ({
  className,
  style,
  title,
}) => {
  const { editor, statusMap } = useStatusMap(() => ({
    isActive: () => isActive(editor.state, 'orderedList'),
    disabled: () => !editor.can().chain().focus().toggleOrderedList().run(),
  }));
  return (
    <MenuBarItem className={className} style={style}>
      <Tooltip text={title || `有序列表 (${command} + Shift + 7)`}>
        <Button
          onClick={() => editor?.chain().focus().toggleOrderedList().run()}
          isActive={statusMap?.isActive}
          disabled={statusMap?.disabled}
        >
          <IconListNumberBold />
        </Button>
      </Tooltip>
    </MenuBarItem>
  );
};
