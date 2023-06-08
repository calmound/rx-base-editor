import {
  BubbleMenuPlugin,
  BubbleMenuPluginProps,
} from '@tiptap/extension-bubble-menu';
import React, { useEffect, useState } from 'react';

type Optional<T, K extends keyof T> = Pick<Partial<T>, K> & Omit<T, K>;

export type BubbleMenuProps = Omit<
  Optional<BubbleMenuPluginProps, 'pluginKey'>,
  'element'
> & {
  className?: string;
  children: React.ReactNode;
  updateDelay?: number;
};

export const BubbleMenu = (props: BubbleMenuProps) => {
  const [element, setElement] = useState<HTMLDivElement | null>(null);

  useEffect(() => {
    if (!element) {
      return;
    }

    if (props.editor.isDestroyed) {
      return;
    }

    const {
      pluginKey = 'bubbleMenu',
      editor,
      tippyOptions = {},
      updateDelay,
      shouldShow = null,
    } = props;

    const plugin = BubbleMenuPlugin({
      updateDelay,
      editor,
      element,
      pluginKey,
      shouldShow,
      tippyOptions,
    });

    editor.registerPlugin(plugin);
    return () => editor.unregisterPlugin(pluginKey);
  }, [props.editor, element]);

  return (
    <div
      ref={setElement}
      className={props.className}
      style={{ visibility: 'hidden' }}
    >
      {props.children}
    </div>
  );
};
