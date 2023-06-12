import classNames from 'classnames';
import React, { useMemo } from 'react';
import { LinkBubbleMenu } from '@gitee/tide-extension-link';
import { TableCellBubbleMenu } from '@gitee/tide-extension-table';
import { ImageBubbleMenu } from '@gitee/tide-extension-image';
import {
  Blockquote,
  Bold,
  BulletList,
  Code,
  CodeBlock,
  Emoji,
  Fullscreen,
  Heading,
  HorizontalRule,
  Image,
  Italic,
  Link,
  MenuBar,
  MenuBarContextProvider,
  MenuBarDivider,
  OrderedList,
  Redo,
  Strike,
  Table,
  TaskList,
  TextBubbleMenu,
  Undo,
} from '@gitee/tide-extension-menubar';
import { EditorContent } from './EditorContent';
import type { TideEditor } from './TideEditor';
import './EditorRender.less';

export type EditorRenderProps = {
  editor: TideEditor;
  className?: string;
  style?: React.CSSProperties;
  menuClassName?: string;
  menuStyle?: React.CSSProperties;
  contentClassName?: string;
  contentStyle?: React.CSSProperties;
};

export const EditorRender: React.FC<EditorRenderProps> = ({
  editor,
  className,
  style,
  menuClassName,
  menuStyle,
  contentClassName,
  contentStyle,
}) => {
  const menuItems = useMemo(() => {
    if (!editor) {
      return null;
    }
    const {
      heading,
      bulletList,
      orderedList,
      taskList,
      image,
      table,
      codeBlock,
      blockquote,
      horizontalRule,
      emoji,
    } = editor.state.schema.nodes;
    const { bold, italic, strike, link, code } = editor.state.schema.marks;
    return [
      [
        editor.menuEnableUndoRedo && <Undo key="undo" />,
        editor.menuEnableUndoRedo && <Redo key="redo" />,
      ],
      [
        heading && <Heading key="heading" />,
        bold && <Bold key="bold" />,
        italic && <Italic key="italic" />,
        strike && <Strike key="strike" />,
        code && <Code key="code" />,
      ],
      [
        bulletList && <BulletList key="bulletList" />,
        orderedList && <OrderedList key="orderedList" />,
        taskList && <TaskList key="taskList" />,
      ],
      [
        link && <Link key="link" />,
        image && <Image key="image" />,
        table && <Table key="table" />,
        codeBlock && <CodeBlock key="codeBlock" />,
      ],
      [
        blockquote && <Blockquote key="blockquote" />,
        horizontalRule && <HorizontalRule key="horizontalRule" />,
        emoji && <Emoji key="emoji" />,
      ],
      [
        editor.menuEnableFullscreen && (
          <Fullscreen
            key="fullscreen"
            fullscreen={editor.fullscreen}
            onFullscreenChange={(f) => editor.setFullscreen(f)}
          />
        ),
      ],
    ]
      .map((group) => group.filter(Boolean))
      .filter((group) => group.length > 0)
      .map((group, index, items) => (
        <React.Fragment key={index}>
          {group}
          {index < items.length - 1 && <MenuBarDivider />}
        </React.Fragment>
      ));
  }, [
    editor,
    editor?.menuEnableUndoRedo,
    editor?.menuEnableFullscreen,
    editor?.fullscreen,
  ]);

  if (!editor) {
    return null;
  }

  return (
    <div
      className={classNames(
        'gwe-editor',
        { 'gwe-editor--fullscreen': !!editor?.fullscreen },
        className
      )}
      style={style}
    >
      <MenuBarContextProvider editor={editor}>
        {!(editor.readOnly && !editor.readOnlyShowMenu) && (
          <MenuBar
            className={classNames(menuClassName, {
              disabled: editor.readOnlyShowMenu,
            })}
            style={menuStyle}
          >
            {menuItems}
          </MenuBar>
        )}
        <EditorContent
          editor={editor}
          className={contentClassName}
          style={contentStyle}
        >
          <LinkBubbleMenu editor={editor} />
          <TableCellBubbleMenu editor={editor} />
          <ImageBubbleMenu editor={editor} />
          <TextBubbleMenu editor={editor} />
        </EditorContent>
      </MenuBarContextProvider>
    </div>
  );
};

EditorRender.displayName = 'EditorRender';
